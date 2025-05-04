import requests
import os
import logging
import mimetypes

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def add_sample_products():
    sample_products = [
        ('static/sample/product1.jpg', 'Blue Headphones', '/product/1', 'Electronics'),
        ('static/sample/product2.jpg', 'Pink Headphones', '/product/2', 'Electronics'),
        ('static/sample/product3.jpg', 'Cookies', '/product/3', 'Food'),
        ('static/sample/product4.jpg', 'Black Smartphone', '/product/4', 'Electronics'),
        ('static/sample/product5.jpg', 'Laptop', '/product/5', 'Electronics'),
        ('static/sample/product6.jpg', 'Chocolate Cake', '/product/6', 'Food'),
        ('static/sample/product7.jpg', 'Pizza', '/product/7', 'Food'),
        ('static/sample/product8.jpg', 'Red T-Shirt', '/product/8', 'Fashion'),
        ('static/sample/product9.jpg', 'Blue Jeans', '/product/9', 'Fashion'),
        ('static/sample/product10.jpg', 'Leather Jacket', '/product/10', 'Fashion'),
        ('static/sample/product11.jpg', 'Wooden Table', '/product/11', 'Furniture'),
        ('static/sample/product12.jpg', 'Sofa', '/product/12', 'Furniture'),
        ('static/sample/product13.jpg', 'Bookshelf', '/product/13', 'Furniture'),
        ('static/sample/product14.jpg', 'Sci-Fi Novel', '/product/14', 'Books'),
        ('static/sample/product15.jpg', 'Cookbook', '/product/15', 'Books'),
        ('static/sample/product16.jpg', 'Smartwatch', '/product/16', 'Electronics'),
        ('static/sample/product17.jpg', 'Burger', '/product/17', 'Food'),
        ('static/sample/product18.jpg', 'Sneakers', '/product/18', 'Fashion'),
        ('static/sample/product19.jpg', 'Chair', '/product/19', 'Furniture'),
        ('static/sample/product20.png', 'History Book', '/product/20', 'Books'),
    ]

    for img_path, name, url, category in sample_products:
        img_path = os.path.join(os.path.dirname(__file__), img_path)
        if not os.path.exists(img_path):
            logging.warning(f"Image file {img_path} not found, skipping product {name}")
            continue

        content_type, _ = mimetypes.guess_type(img_path)
        if content_type not in ['image/jpeg', 'image/png']:
            logging.warning(f"Unsupported file format for {img_path}, skipping product {name}")
            continue

        try:
            with open(img_path, 'rb') as f:
                files = {'file': (os.path.basename(img_path), f, content_type)}
                data = {
                    'product_name': name,
                    'product_url': url,
                    'category': category
                }
                response = requests.post('http://localhost:8000/add-product', files=files, data=data, timeout=10)
                
                if response.status_code == 200:
                    try:
                        response_json = response.json()
                        product_id = response_json.get('id', 'unknown')
                        logging.info(f"Added product {name} with ID {product_id}")
                    except ValueError:
                        logging.error(f"Failed to parse JSON response for product {name}: {response.text}")
                else:
                    logging.error(f"Failed to add product {name}: {response.status_code} - {response.text}")
        
        except requests.exceptions.RequestException as e:
            logging.error(f"Request failed for product {name}: {e}")
            continue

if __name__ == "__main__":
    add_sample_products()