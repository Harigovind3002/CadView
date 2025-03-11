# CADView - 3D CAD Model Viewer 

CADView is a backend application built with Flask to manage, view, and analyze 3D CAD models. It supports popular file formats like .stl and .obj, enabling efficient upload, retrieval, and visualization of CAD data.

## Features

- Upload and store 3D models
- View models interactively in the browser
- Retrieve and manage stored 3D files

## Tech Stack

### Backend
- Flask: Lightweight Python web framework
- Python: Used for backend logic
- Flask-CORS: Enables cross-origin resource sharing

### Frontend
- React: JavaScript library for building user interfaces
- Three.js: Library for rendering 3D graphics in the browser
- Axios: Used for making HTTP requests to the backend API

## Setup Instructions

### Backend Setup (Flask API)

1. Clone the repository:
   ```bash
   git clone https://github.com/Harigovind3002/CadView.git
   cd CadView
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python app.py
   ```
   The server will start at `http://localhost:5000`.

### Frontend Setup (React App)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the React app:
   ```bash
   npm start
   ```
   The app should open at `http://localhost:3000`.

## API Endpoints

### **Upload a Model**
- **Method:** POST  
- **Endpoint:** `/upload`  
- **Description:** Upload a `.stl` or `.obj` file using multipart form data (`file` field).  

### **Retrieve a Model**
- **Method:** GET  
- **Endpoint:** `/models/`  
- **Description:** Fetch the uploaded file by its name.

### **List All Models**
- **Method:** GET  
- **Endpoint:** `/models`  
- **Description:** Retrieve a list of all uploaded model filenames.

## 3D Model Rendering (Frontend)

The React frontend uses Three.js to render uploaded 3D models dynamically. When a model is selected, it is fetched from the backend and displayed using an interactive WebGL viewer.

### Frontend Usage Steps

1. Open the app: Navigate to `http://localhost:3000/` in your browser.
2. Upload a model: Click on the "Upload Model" button and select a `.stl` or `.obj` file.
3. View models: After uploading, select a model from the list to view it interactively.

## File Structure

```
CadView/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── uploads/ (stores uploaded models)
│   ├── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── ...
│   ├── package.json
│   ├── public/
│   ├── ...
├── README.md
├── .gitignore
└── ...
```

