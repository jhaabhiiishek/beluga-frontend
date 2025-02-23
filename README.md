
# Malware Detection Tool

A full-stack web application for static malware analysis.  
The tool allows users to upload files (e.g., `.exe`, `.pdf`, `.docx`), perform static analysis using YARA rules and the VirusTotal API, and display a vulnerability score with detailed results. It also supports user profiling with email/password authentication and segmented scan logs per user.

## Features

- **Static Analysis**:  
  Analyze files using a combination of custom YARA rules and VirusTotal API checks.
  
- **Multi-File Support**:  
  Accepts various file types: Windows executables (.exe), PDFs, DOCX files, and YARA rule files (.yar, .yara).

- **Risk Factor Reporting**:  
  Identifies specific parts of the file that triggered malicious indicators.

- **User Authentication**:  
  Sign up and log in using email and password (JWT-based).  
  All scan logs are associated with the authenticated user.

- **Custom YARA Rule Builder**:  
  Create new YARA rules on the fly using a builder interface.

- **Responsive and Modern UI**:  
  iOS-inspired design with mobile-responsive pages.

- **Safe Static Analysis**:  
  The backend performs *only static analysis* without sandboxing or executing the file.  
  **Warning:** Always analyze malware in an isolated environment for safety.

## Setup Instructions

### Prerequisites

- **Python 3.9+**
- **Node.js (v14 or later) and npm**
- **Git**
- For production, we recommend using a virtual machine or container (see [Deployment](#deployment) below).

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/malware-detection-tool.git
   cd malware-detection-tool/backend
   ```

2. **Create and activate a Python virtual environment:**

   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Unix or MacOS:
   source venv/bin/activate
   ```

3. **Install backend dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

   Ensure your `requirements.txt` includes packages such as:
   - Flask
   - flask-cors
   - flask-sqlalchemy
   - flask-jwt-extended
   - yara-python
   - requests
   - python-dotenv
   - Werkzeug

4. **Set Environment Variables:**

   Create a `.env` file (or set environment variables in your deployment environment) with:
   ```ini
   SECRET_KEY=your_secret_key_here
   JWT_SECRET_KEY=your_jwt_secret_here
   API_KEY=your_default_virustotal_api_key_here
   ```
   (If you want users to supply their own VirusTotal API key for detailed scans, that field is passed in via the frontend.)

5. **Initialize the Database:**

   If using SQLite, delete any existing `scan_logs.db` file (for development) and let the application create a new one:
   ```bash
   del scan_logs.db   # on Windows
   rm scan_logs.db    # on Unix/MacOS
   python app.py      # This will create a new database with updated models.
   ```

6. **Run the Backend:**

   ```bash
   python app.py
   ```

   The backend will start on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. **Navigate to the frontend folder:**

   ```bash
   cd ../frontend
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Run the Frontend:**

   ```bash
   npm start
   ```

   The app should now be accessible (usually on [http://localhost:3000](http://localhost:3000)).

### Deployment Recommendations

For your hackathon deployment, consider the following:

#### Backend

- **Dockerize the Backend:**  
  Create a `Dockerfile` for your backend so that it can be deployed in an isolated container.  
  Example:
  ```dockerfile
  FROM python:3.9-slim
  ENV PYTHONDONTWRITEBYTECODE=1
  ENV PYTHONUNBUFFERED=1
  WORKDIR /app
  COPY requirements.txt /app/
  RUN pip install --upgrade pip && pip install -r requirements.txt
  COPY . /app/
  EXPOSE 5000
  CMD ["python", "app.py"]
  ```
  Then build and run:
  ```bash
  docker build -t malware-detection-backend .
  docker run -d -p 5000:5000 malware-detection-backend
  ```

- **Secure Environment:**  
  Since malware files are being statically analyzed, ensure the backend is deployed on an isolated network or VM.  
  **Warning:** Do not run this system on production servers without proper isolation and security measures.

#### Frontend

- **Static Site Hosting:**  
  Deploy your React frontend on services like **Netlify**, **Vercel**, or **GitHub Pages**.  
  Simply build the project:
  ```bash
  npm run build
  ```
  And follow the hosting service instructions to deploy the build folder.

### User Profiling & Security

- **User Authentication:**  
  Users sign up and log in with email and password. Their JWT token is stored in localStorage and used to authorize all API calls.
- **Scan Logs are Segmented:**  
  Each scan log is saved with the user’s ID so that users only see their own logs.
- **VirusTotal API Key:**  
  The default API key is set in the environment, but for detailed scans, users may provide their own key via the frontend.
- **Static Analysis Only:**  
  The backend performs static analysis using YARA and VirusTotal API. It does not execute any uploaded file, keeping your system safe (though always run such tools in isolated environments).

## Features Recap

- **Static File Analysis:**  
  Uses YARA rules and VirusTotal API to analyze uploaded files.
- **User Authentication:**  
  Signup and login using email/password with JWT-based protection.
- **User-Specific Logs:**  
  Scan logs are associated with the user who performed them.
- **Custom Rule Builder:**  
  Build custom YARA rules dynamically.
- **Responsive, Modern UI:**  
  Frontend components are styled with an iOS-inspired design and mobile responsiveness.
- **Optional VirusTotal API Key Input:**  
  Users may supply their own API key when requesting detailed scans.
- **Deployment Ready:**  
  Dockerfile and build instructions for both frontend and backend are provided.

## Final Notes

- **Safety Disclaimer:**  
  This tool performs only static analysis. Do **NOT** run or execute any uploaded malware. Always use proper isolation (e.g., VMs or containers) when analyzing potentially malicious files.
