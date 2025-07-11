
# Obesity Prediction Frontend

This is the frontend interface for the Obesity Risk Prediction Model, built using HTML, CSS, and vanilla JavaScript.

# Live Website

(https://obesity-risk-prediction-model.vercel.app/)

# Features

- Dynamic input form for health & lifestyle data
- Clean, responsive UI (Apple-like, Nord theme)
- Sends data to backend and displays:
  - Obesity risk class
  - BMI score
  - Lifestyle improvement suggestions (non-medical)

# Structure

📦 obesity-frontend
├── index.html # Main HTML layout
├── style.css # Custom styling
└── script.js # Logic for form + prediction

# Setup

No build tools required.

# Steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/obesity-frontend.git
   cd obesity-frontend
Open index.html in your web browser:

Windows: Right-click → “Open with” → Your browser

macOS/Linux (Terminal):

open index.html       # macOS
xdg-open index.html   # Linux
start index.html      # Windows (PowerShell)
You’re live! The app will connect to your backend API as defined in script.js.

 Make sure the backend is already deployed and the URL is correct in script.js.

🧠 Backend API
Ensure this is configured in script.js:

fetch("https://your-backend-url.up.railway.app/predict")
