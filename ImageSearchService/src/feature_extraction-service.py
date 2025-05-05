from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
import io
import torch
from torchvision import models, transforms
import numpy as np
from torch.nn.functional import normalize

app = FastAPI()

# Load ResNet34 model
model = models.resnet34(weights=models.ResNet34_Weights.DEFAULT)
dimension = 512
model.eval()
model = torch.nn.Sequential(*(list(model.children())[:-1]))  # Remove FC layer

# Image preprocessing
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.post("/extract-features")
async def extract_features(file: UploadFile = File(...)):
    try:
        # Read image
        image_data = await file.read()
        img = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Preprocess and extract features
        img_tensor = preprocess(img).unsqueeze(0)
        with torch.no_grad():
            features = model(img_tensor)
        features = features.squeeze().cpu().numpy()
        if features.ndim > 1:
            features = features.flatten()
        if features.shape != (dimension,):
            raise ValueError(f"Feature vector shape {features.shape} does not match expected ({dimension},)")
        
        # Normalize and return
        normalized_features = normalize(torch.tensor(features), p=2, dim=0).numpy()
        return normalized_features.tolist()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract features: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)