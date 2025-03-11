# CAD Model Viewer Backend

A Flask-based backend API for handling 3D model file uploads and retrieval.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Upload a Model
- **POST** `/upload`
- Accepts multipart form data with a file field named 'file'
- Supports .stl and .obj files
- Returns filename on successful upload

### Get a Model
- **GET** `/models/<filename>`
- Returns the requested model file

### List All Models
- **GET** `/models`
- Returns a list of all uploaded model filenames

## Security Features
- Secure filename handling
- File type validation
- 16MB file size limit
- CORS enabled 