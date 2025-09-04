# Get Started with React Web Based Sentiment Analysis

## Overview of the Project
This project is a Web Based Sentiment Analysis on Mobile Operating System using SVM. 


## Steps to run
You need to setup the database first to run this project through "https://github.com/ammarsalam/Setup-React-App"

1) Prerequisites
----------------
- "VS Code" installed (latest version)
- "Python 3.10+" and "pip" installed
- "Node.js 18+" and "npm" installed
- "XAMPP" running (Apache + MySQL) with database 'fyp' already imported from 'fyp_project.sql'

---

2) Setup a virtual environment
------------------------------
- Create and activate a virtual environment:
   - Open a new VS Code terminal
   - Activate: venv\Scripts\activate
 
---

3) Setup & Run the Backend (Flask API)
--------------------------------------
Location: '.../FYP WEB PROJECT/backend/'

1. Open a new VS Code terminal:
   - Terminal → New Terminal
   - Navigate to backend: cd backend

2. Start the backend server:
   - flask run: python app.py

3. Verify backend is running:
   - Open "http://127.0.0.1:5000/"

---

4) Setup & Run the Frontend (React)
-----------------------------------
Location: '.../FYP WEB PROJECT/frontend/'

1. Open a second terminal in VS Code:
   - Terminal → New Terminal
   - Navigate to frontend: cd frontend

2. Start the frontend development server:
   - React run: npm run dev

3. Verify frontend is running:
   - Open the URL shown in terminal, usually "http://localhost:5173/"
   - The React app should load and communicate with Flask API.

---

5) Run Order (Summary)
----------------------
1. Start "XAMPP" → Apache & MySQL.
2. Open browser at "http://localhost:5173" to use the system.
