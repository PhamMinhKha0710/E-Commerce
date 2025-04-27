from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from PIL import Image
import numpy as np
import logging
import io
import torch
from torchvision import models, transforms
from torch.nn.functional import normalize
from elasticsearch import Elasticsearch, ApiError
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

# Elasticsearch connection
try:
    es = Elasticsearch(
        ["http://localhost:9200"],
        verify_certs=False,  # Bỏ qua kiểm tra chứng chỉ
        request_timeout=10,
        headers={"Content-Type": "application/json", "Accept": "application/json"}  # Thêm header
    )
    # Kiểm tra kết nối chi tiết
    if not es.ping():
        # Thử yêu cầu GET để lấy thông tin lỗi
        try:
            response = es.transport.perform_request("GET", "/")
            logging.error(f"Elasticsearch ping failed. Response: {response}")
        except ApiError as ae:
            logging.error(f"Elasticsearch request error: {ae.info}")
        except Exception as e:
            logging.error(f"Other connection error: {e}")
        raise Exception("Elasticsearch connection failed")
    logging.info("Connected to Elasticsearch successfully")
    # Kiểm tra phiên bản
    info = es.info()
    logging.info(f"Elasticsearch version: {info['version']['number']}")
except Exception as e:
    logging.error(f"Failed to connect to Elasticsearch: {e}")
    raise

# Load ResNet50 model
logging.info("Loading ResNet50 model")
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
dimension = 2048  # ResNet50 feature vector dimension
model.eval()
model = torch.nn.Sequential(*(list(model.children())[:-1]))  # Remove the last fully connected layer
logging.info("Model loaded successfully")

# Image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Extract feature vector
def extract_features(image_data: bytes) -> np.ndarray:
    try:
        logging.info("Starting feature extraction")
        img = Image.open(io.BytesIO(image_data)).convert('RGB')
        logging.info("Image opened successfully")
        img_tensor = preprocess(img).unsqueeze(0)
        logging.info("Image preprocessed successfully")
        with torch.no_grad():
            features = model(img_tensor)
        logging.info("Feature extraction completed")
        features = features.squeeze().cpu().numpy()
        if features.ndim > 1:
            features = features.flatten()
        if features.shape != (dimension,):
            raise ValueError(f"Feature vector shape {features.shape} does not match expected ({dimension},)")
        features = normalize(torch.tensor(features), p=2, dim=0).numpy()
        logging.info(f"Feature vector shape: {features.shape}")
        return features
    except Exception as e:
        logging.error(f"Failed to extract features: {e}")
        raise

# Convert feature vector to list for Elasticsearch
def vector_to_list(vector: np.ndarray) -> list:
    return vector.tolist()

# API to extract features
@app.post("/extract-features")
async def extract_features_endpoint(file: UploadFile = File(...)):
    try:
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(status_code=400, detail="Invalid file format. Only PNG, JPG, JPEG allowed.")
        
        image_data = await file.read()
        if len(image_data) > 5 * 1024 * 1024:  # 5MB limit
            raise HTTPException(status_code=400, detail="File too large. Max size is 5MB.")
        
        feature_vector = extract_features(image_data)
        return {"feature_vector": vector_to_list(feature_vector)}
    except Exception as e:
        logging.error(f"Error in extract-features: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# API to add product to Elasticsearch
@app.post("/add-product")
async def add_product(
    file: UploadFile = File(...),
    product_name: str = Form(...),
    product_url: str = Form(...),
    category: str = Form(...)
):
    try:
        image_data = await file.read()
        feature_vector = extract_features(image_data)
        
        # Store in Elasticsearch
        doc = {
            "image_path": file.filename,
            "feature_vector": vector_to_list(feature_vector),
            "name": product_name,
            "url": product_url,
            "category": category
        }
        result = es.index(index="products", body=doc)
        logging.info(f"Added product {product_name} with ID {result['_id']}")
        return {"id": result['_id'], "message": "Product added successfully"}
    except Exception as e:
        logging.error(f"Error in add-product: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# API to search similar images
@app.post("/search-similar")
async def search_similar(
    file: UploadFile = File(...),
    category: Optional[str] = Form(None),
    max_distance: float = Form(0.5),
    limit: int = Form(3)
):
    try:
        image_data = await file.read()
        query_vector = extract_features(image_data)
        
        # Elasticsearch vector search (using cosine similarity)
        query = {
            "query": {
                "script_score": {
                    "query": {"match_all": {}},
                    "script": {
                        "source": "cosineSimilarity(params.query_vector, 'feature_vector') + 1.0",
                        "params": {"query_vector": vector_to_list(query_vector)}
                    }
                }
            },
            "size": limit
        }
        if category:
            query["query"]["script_score"]["query"] = {"term": {"category": category}}
        
        response = es.search(index="products", body=query)
        results = []
        for hit in response["hits"]["hits"]:
            score = hit["_score"] - 1.0  # Convert back to cosine similarity
            if score >= (1 - max_distance):
                results.append({
                    "name": hit["_source"]["name"],
                    "image_path": hit["_source"]["image_path"],
                    "url": hit["_source"]["url"],
                    "category": hit["_source"]["category"],
                    "distance": float(1 - score)
                })
        
        logging.info(f"Found {len(results)} similar images")
        return {"results": results}
    except Exception as e:
        logging.error(f"Error in search-similar: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)