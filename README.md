🤖 Virtual AI Assistant
Your Personal Voice-Powered AI Assistant

A full-stack AI-powered virtual assistant that allows users to interact with an intelligent assistant using voice commands. The assistant can understand user requests, generate responses using Google Gemini, perform actions such as Google/YouTube searches, open websites, provide information, and maintain user-specific conversation history.

---

🚀 Key Features

🎙️ Voice Interaction
• Uses browser Speech Recognition API to capture voice commands.
• Continuously listens for the assistant's name.
• Converts spoken commands into text.

🧠 Gemini AI Integration
• Sends recognized commands to the backend.
• Uses Google Gemini API to understand the user's request.
• Generates an appropriate response and command type.

🔊 AI Voice Response
• Uses the browser Speech Synthesis API.
• Assistant speaks the generated response back to the user.
• Automatically resumes listening after the response.

⚡ Smart Command Execution
The assistant can perform actions such as:
• 🔎 Google Search
• ▶️ YouTube Search
• 🧮 Open Calculator
• 📸 Open Instagram
• 📘 Open Facebook
• 🌤️ Search Weather

👤 User Authentication
• User signup and login.
• JWT-based authentication.
• HTTP-only cookie-based authentication.
• Protected user-specific data.

🎨 Customizable Assistant
Users can customize:
• Assistant name
• Assistant image
• User profile
• Assistant appearance and preferences

📜 Command History
• Stores user's previous voice commands.
• Displays history inside the menu or sidebar.
• History is associated with the logged-in user.

☁️ Cloud Image Storage
• Assistant images are uploaded and managed using Cloudinary.

---

🧠 How It Works

User speaks
     ↓
Speech Recognition
     ↓
Convert Voice → Text
     ↓
Check Assistant Name
     ↓
Send Command to Backend
     ↓
Gemini AI
     ↓
Understand User Intent
     ↓
Return Response + Command Type
     ↓
Execute Command
     ↓
Speech Synthesis
     ↓
Assistant Speaks Response
     ↓
Resume Listening

---

🛠️ Tech Stack

Frontend
• React.js
• Vite
• Tailwind CSS
• React Router
• Axios
• Web Speech API
• Speech Synthesis API

Backend
• Node.js
• Express.js
• REST API
• JWT Authentication
• Cookie Parser

Database
• MongoDB
• MongoDB Atlas

AI
• Google Gemini API

Cloud Services
• Cloudinary
• Render

---

📁 Project Structure

Virtual-Assistant/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── Gemini.js
│   └── index.js
└── README.md

---

🔐 Authentication Flow

User
 ↓
Signup / Login
 ↓
Backend validates credentials
 ↓
JWT Token Generated
 ↓
Token stored in Cookie
 ↓
Authenticated Request
 ↓
User Data Retrieved

---

🤖 Gemini AI Flow

The backend receives the user's command and sends it to Gemini.

Example input:
"Jarvis, search for React tutorials on YouTube."

Gemini determines:
{
  "type": "youtube-search",
  "userInput": "React tutorials",
  "response": "Sure, searching YouTube for React tutorials."
}

The frontend then uses the type to perform the appropriate action.

---

🎤 Voice Recognition Flow

The application uses the browser's SpeechRecognition API.

Start Recognition
       ↓
Listen continuously
       ↓
Speech detected
       ↓
Convert speech → transcript
       ↓
Check assistant name
       ↓
Stop recognition
       ↓
Send transcript to Gemini

After Gemini responds:

Gemini Response
      ↓
Speech Synthesis
      ↓
Assistant speaks
      ↓
Speech ends
      ↓
Start Recognition again

---

📜 User History

Every recognized command is associated with the logged-in user.

Example:
History
────────────────────────
"Jarvis, are you there?"
"Jarvis, search YouTube"
"Jarvis, open Instagram"
"Jarvis, what is the weather?"

---

🔑 Environment Variables

Create a .env file inside the backend:

PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_URL=your_gemini_api_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Add this to .gitignore:
.env
node_modules

---

💻 Installation

1. Clone Repository
git clone <your-repository-url>
cd Virtual-Assistant

2. Install Backend
cd backend
npm install

3. Install Frontend
cd ../frontend
npm install

---

▶️ Run Locally

Backend
cd backend
npm run dev

Frontend (Open another terminal)
cd frontend
npm run dev

Then open:
http://localhost:5173

---

🌐 Live Demo

• Frontend: Your deployed frontend URL
• Backend: Your deployed backend URL

---

🎯 Project Highlights

This project demonstrates practical experience with:
• Full-stack MERN development
• AI API integration
• Voice-based interaction
• Speech recognition & synthesis
• REST API development
• JWT authentication
• MongoDB data management
• Cloudinary image storage
• Responsive UI development
• Third-party API integration
• Cloud deployment

---

🔮 Future Improvements

• Better natural-language command understanding
• Conversation memory
• Multiple voice and language support
• Mobile application development
• Notifications and reminders
• Email and calendar integrations
• Tool and function calling capabilities
• Agentic AI capabilities

---

💡 Project Concept

The goal of this project is to create a personal voice-controlled AI assistant that combines traditional web application functionality with modern Generative AI. Instead of interacting with an AI only through a text box, the user can speak naturally, allowing the assistant to process requests, perform actions, and respond via voice.

---

📌 Project Status

Status: Active Development 🚧
Core functionality including authentication, voice recognition, Gemini AI integration, command execution, customization, and user history has been implemented.

---

👨‍💻 Built With

React • Node.js • Express • MongoDB • Gemini AI • Web Speech API • Cloudinary • Tailwind CSS
