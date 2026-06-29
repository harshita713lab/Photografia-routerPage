# 📸 Fotographiya Wedding Photography Chatbot

A fully functional, options-based chatbot built for **Fotographiya** — a premium wedding photography and cinematography brand. The chatbot follows a structured conversation flow with hierarchical menus, options-based navigation, and detailed informational endpoints.

> [!NOTE]
> The chatbot operates **without any external AI API** (like ChatGPT or Groq). All responses are pre-defined and stored in a clean JSON configuration file, making it lightning-fast, 100% reliable, and incredibly easy to maintain.

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [How to Use](#-how-to-use)
- [How to Edit Content](#-how-to-edit-content)
- [API Endpoints](#-api-endpoints)
- [Email Notifications](#-email-notifications)
- [License](#-license)

---

## 🔍 Overview

This chatbot is designed to assist Fotographiya's clients with instant information about wedding photography services, pricing packages, team details, and consultation bookings. It works like a guided conversation where users click on intuitive options to navigate through menus and get detailed answers without typing anything.

**Key Updates:**
- ✅ **Fully Options-Based** — No text input required, users navigate via buttons
- ✅ **Logo Integration** — Brand logo displayed on toggle button and header
- ✅ **Form Submissions** — Book Event & Send Call Request forms with email notifications
- ✅ **Lightning Fast** — 6-9ms response time for option clicks

---

## ✨ Features

### ⚙️ Core Features
- **Options-Based Navigation** — Users click on buttons instead of typing
- **Three-Level Conversation Flow** — `Main Menu` ➔ `Sub-menu` ➔ `Detailed Answers`
- **Universal "Back to Main Menu"** — Available on every screen
- **Premium UI** — Clean black-and-white minimalist design
- **100% Responsive** — Works flawlessly on mobile, tablet, and desktop
- **Typing Indicator** — Smooth animation showing bot "thinking"

### 📂 Content Sections
- **Our Services** — Wedding, Engagement, Pre-Wedding, Maternity, Baby, Mehndi & Sangeet, Parties, Corporate Events
- **Pricing & Packages** — Silver, Golden, and Premium packages with detailed pricing
- **About Us** — Who We Are, Services Provided, Booking Policy
- **Contact Us** — WhatsApp, Call Now, Send Call Request

### 📧 Email Notifications
- **Form Submissions Only** — Emails sent only for "Book Event" and "Send Call Request" forms
- **No Spam** — Option clicks do not trigger emails
- **Detailed Reports** — Complete form data with team member quick-action buttons

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 + Vite |
| **Styling** | Vanilla CSS3 + Google Fonts (Inter) + Material Icons |
| **Backend** | Node.js + Express |
| **Data Layer** | Static JSON Configuration File |
| **Email** | Nodemailer (Gmail SMTP) |
| **Security** | Helmet, CORS, & Rate Limiting |
| **Icons** | Material Icons |

---

## 📂 Project Structure

```text
fotographiya-chatbot/
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── logs/
│   │   ├── access.log
│   │   └── chat-requests.log
│   └── src/
│       ├── data/
│       │   └── chatbot-config.json
│       ├── controllers/
│       │   └── chatController.js
│       ├── routes/
│       │   └── chatRoutes.js
│       ├── services/
│       │   └── aiService.js
│       └── middleware/
│           └── errorHandler.js
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── assets/
        │   ├── font/
        │   │   └── (Inter font files)
        │   └── image/
        │       └── logo.jpeg
        ├── components/
        │   ├── Chatbot.jsx
        │   ├── ChatWindow.jsx
        │   ├── ChatHeader.jsx
        │   ├── ChatMessages.jsx
        │   ├── ChatMessage.jsx
        │   ├── ChatToggle.jsx
        │   ├── OptionGrid.jsx
        │   ├── OptionButton.jsx
        │   ├── FormInput.jsx
        │   ├── TypingIndicator.jsx
        │   └── CloseIcon.jsx
        └── style/
            └── chatBotStyle.css

```
----------------------------
## 🚀 Installation & Setup
### 📋 Prerequisites

| Requirement  |  Version |
| :-----  |  :------ |
| **Node.js** | v18 or higher |
| **npm** | v9 or higher |

--------------------

### Step 1: Clone the Repository

```

git clone <repository-url>
cd fotographiya-chatbot

```
### Step 2: Backend Setup

```
cd Backend
npm install
npm run dev
```
✅ Backend server: http://localhost:5000

### Step 3: Frontend Setup

```
cd Frontend
npm install
npm run dev
```
✅ Frontend server: http://localhost:5173

### Step 4: Open in Browser

* Go to http://localhost:5173
* Click the chat toggle button at the bottom-right corner
--------------------
## 🎮 How to Use
### For Users
* **Step 1** :- Click the chat toggle button (Fotographiya logo) at bottom-right
* **Step 2** :- Chat window slides open with welcome message
* **Step 3** :- Click any option button to navigate
* **Step 4** :- Use "Back to Main Menu" to restart the conversation

#### Example Flow
```
Main Menu → Our Services → Wedding Photography → Book My Event
```
-----
## 📝 How to Edit Content
> [!IMPORTANT]
All conversation content is stored in Backend/src/data/chatbot-config.json.

### Adding a New Option
1. Add option to the target menu's options array:

```json
"menu": {
  "options": [
    { "id": "existing", "label": "Existing Option" },
    { "id": "new_option", "label": "New Option", "icon": "icon_name" }
  ]
}
```

2. Define the response block:
```json
"new_option": {
  "type": "details",
  "title": "Your Title",
  "message": "Your message here...",
  "options": [
    { "id": "book_event", "label": "Book Now", "icon": "event_note" },
    { "id": "menu", "label": "Back to Main Menu", "icon": "arrow_back" }
  ]
}
```

3. Restart backend: Ctrl+C → npm run dev
------
## 🔗 API Endpoints

| Method | Endpoint            | Description                                                                    |
| ------ | ------------------- | ------------------------------------------------------------------------------ |
| `POST` | `/api/chat/message` | Sends the user's selected option and returns the appropriate chatbot response. |
| `POST` | `/api/chat/form`    | Submits event booking or callback request details to the server.               |
| `GET`  | `/health`           | Checks the current health and availability of the API service.                 |
| `GET`  | `/dashboard`        | Displays chatbot conversation logs and analytics. |
-------------
## 📧 Email Notifications
### How It Works
#### Step	Process
* 1️⃣	User fills and submits a form (Book Event or Send Call Request)
* 2️⃣	Email notification is sent to team members
* 3️⃣	Team receives complete form data with quick-action buttons

#### Email Content
* ✅ Complete form data in HTML + Text format
* ✅ WhatsApp and Call quick-action buttons
* ✅ Timestamp and IP address tracking
#### Configuration
Create `.env` in Backend folder:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```
---------------
## 📊 Performance
| Action| 	Response Time | 
| :---------- | :------- |
| Menu Clicks| 	6-9ms | 
| Service Clicks| 	6-8ms | 
| Package Clicks| 	6- | 
| Form Submissions| 	3.35s (Email sending) | 
------------------------
## 🔧 Removed Components
The following components were removed to simplify the codebase:

* ❌ ChatInput.jsx (Text input removed - fully options-based)

* ❌ SendIcon.jsx (No longer needed)

* ❌ ResetButton.jsx (Unused)

* ❌ BotIcon.jsx (Replaced with brand logo)

* ❌ ChatIcon.jsx (Replaced with brand logo)
----------
## 📄 License

This project was developed as part of an **internship assignment** at **Fotographiya**.

- All code, design, and intellectual property contained in this repository are the property of **Fotographiya**.
- This project is for **internal demonstration and evaluation purposes only**.
- Unauthorized use, copying, distribution, or modification of this project is **strictly prohibited** without prior written consent from Fotographiya.

> **Note:** This project is not open-source and does not fall under any public license.

---

## 👩‍💻 Developer

**Name:** Harshita Rathore  
**Role:** Intern Developer  
**Organization:** Fotographiya  
**GitHub:** [harshita713lab](https://github.com/harshita713lab)

---

## 📧 Contact

For any questions regarding this project, please contact:

📧 **Email:** harshitar713@gmail.com  
🔗 **GitHub:** [harshita713lab](https://github.com/harshita713lab)

> 📌 **Note:** This project was developed during an internship at Fotographiya. For official inquiries, please contact the organization directly through their official channels.

---
## 🙌 Acknowledgements
* React & Vite — For an incredible development environment

* Google Fonts — For the Inter font family

* Material Icons — For clean, scalable icons
<div align="center">

---

### 🚀 Thank You for Visiting!

*This project was created with dedication and passion during an internship at Fotographiya.*

---

**Developed with ❤️ by [Harshita Rathore]**

---

[⬆ Back to Top](#-fotographiya-chatbot)

</div>
---



