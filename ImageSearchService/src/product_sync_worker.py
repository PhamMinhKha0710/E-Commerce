import pika
import json
import logging
from PIL import Image
import numpy as np
import io
import torch
from torchvision import models, transforms
from torch.nn.functional import normalize
from elasticsearch import Elasticsearch
import requests
from datetime import datetime, timezone

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Elasticsearch connection
es = Elasticsearch(["http://localhost:9200"], verify_certs=False, request_timeout=10)
if not es.ping():
    raise Exception("Elasticsearch connection failed")

# Load ResNet34 model
logging.info("Loading ResNet34 model")
model = models.resnet34(weights=models.ResNet34_Weights.DEFAULT)
dimension = 512  # ResNet34 feature vector dimension
model.eval()
model = torch.nn.Sequential(*(list(model.children())[:-1]))  # Remove the fully connected layer
logging.info("Model loaded successfully")

# Image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def extract_features(image_data: bytes) -> np.ndarray:
    try:
        img = Image.open(io.BytesIO(image_data)).convert('RGB')
        img_tensor = preprocess(img).unsqueeze(0)
        with torch.no_grad():
            features = model(img_tensor)
        features = features.squeeze().cpu().numpy()
        if features.ndim > 1:
            features = features.flatten()
        if features.shape != (dimension,):
            raise ValueError(f"Feature vector shape {features.shape} does not match expected ({dimension},)")
        return normalize(torch.tensor(features), p=2, dim=0).numpy()
    except Exception as e:
        logging.error(f"Failed to extract features: {e}")
        raise

def vector_to_list(vector: np.ndarray) -> list:
    return vector.tolist()

def validate_suggestion_input(inputs, max_length=50):
    """
    Kiểm tra và cắt ngắn các chuỗi gợi ý.
    - Loại bỏ None, chuỗi rỗng, hoặc chuỗi chỉ chứa khoảng trắng.
    - Cắt ngắn chuỗi vượt quá max_length.
    """
    return [s[:max_length] for s in inputs if s and isinstance(s, str) and len(s.strip()) > 0]

def process_message(ch, method, properties, body):
    try:
        message = json.loads(body)
        product_id = message['productId']
        item_id = message['itemId']
        action = message['action']
        data = message['data']
        elasticsearch_id = message.get('elasticsearchId')

        logging.info(f"Processing message: productId={product_id}, itemId={item_id}, action={action}")

        if action in ['add', 'update']:
            if not data or not data.get('image_url'):
                raise ValueError("Missing image_url in message data")

            # Xử lý suggestion từ message
            suggestion = data.get('suggestion', {})
            suggestion_input = suggestion.get('input', [])
            suggestion_weight = suggestion.get('weight', 1)

            # Kiểm tra và xử lý suggestion_input
            suggestion_input = validate_suggestion_input(suggestion_input, max_length=50)
            
            # Đảm bảo có ít nhất một gợi ý
            if not suggestion_input:
                suggestion_input = [data.get('sku', 'default_sku')]

            response = requests.get(data['image_url'], timeout=10)
            response.raise_for_status()
            image_data = response.content
            feature_vector = extract_features(image_data)
            doc = {
                'product_id': product_id,
                'item_id': item_id,
                'name': data['name'],
                'description': data.get('description'),
                'category': data['category'],
                'sub_category': data.get('sub_category'),
                'brand': data['brand'],
                'price': data['price'],
                'old_price': data.get('old_price'),
                'stock': data['stock'],
                'sku': data['sku'],
                'image_url': data['image_url'],
                'feature_vector': vector_to_list(feature_vector),
                'popularity_score': data['rating'] * data['total_rating_count'],
                'has_variation': data['has_variation'],
                'created_at': datetime.now(timezone.utc).isoformat(),
                'updated_at': datetime.now(timezone.utc).isoformat(),
                'tags': [data['category'], data['brand']] + ([data['sub_category']] if data.get('sub_category') else []),
                'rating': data['rating'],
                'total_rating_count': data['total_rating_count'],
                'status': data['status'],
                'variations': data['variations'],
                'suggestion': {
                    'input': suggestion_input,
                    'weight': suggestion_weight
                }
            }
            print(doc)
            es.index(index='ecommerce_product_item', id=str(product_id), body=doc)
            logging.info(f"Synced product {product_id} for action {action}")

            requests.post('http://localhost:5130/api/products/update-elasticsearch-id', json={
                'productId': product_id,
                'elasticsearchId': str(product_id)
            })

        elif action == 'delete':
            if not elasticsearch_id:
                logging.warning(f"No elasticsearchId provided for delete action, productId={product_id}")
            else:
                try:
                    es.delete(index='ecommerce_product_item', id=elasticsearch_id)
                    logging.info(f"Deleted product {product_id}, elasticsearchId={elasticsearch_id}")
                except Exception as e:
                    if 'not_found' in str(e):
                        logging.warning(f"Product {product_id} not found in Elasticsearch")
                    else:
                        raise
                requests.post('http://localhost:5130/api/products/update-elasticsearch-id', json={
                    'productId': product_id,
                    'elasticsearchId': None
                })

        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        logging.error(f"Error processing message: {e}", exc_info=True)
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
        ch.basic_publish(exchange='', routing_key='product_sync_dead_letter_queue', body=body)

def start_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    arguments = {'x-dead-letter-exchange': '', 'x-dead-letter-routing-key': 'product_sync_dead_letter_queue'}
    channel.queue_declare(queue='product_sync_queue', durable=True, arguments=arguments)
    channel.queue_declare(queue='product_sync_dead_letter_queue', durable=True)
    channel.basic_consume(queue='product_sync_queue', on_message_callback=process_message)
    logging.info("Starting RabbitMQ consumer for product_sync_queue...")
    channel.start_consuming()

if __name__ == "__main__":
    start_consumer()