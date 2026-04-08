# 🚀 Docuvio – Smart Document Printing & Order Management System

## 📌 Overview

Docuvio is a full-stack web application designed to digitize and streamline document printing services for students and local print shops. It replaces manual workflows with an automated system where users can upload documents, configure print settings, make payments, and track orders in real time.

---

## ✨ Features

* 📄 Document upload with automatic PDF conversion
* 🔢 Page count detection for accurate pricing
* 💰 Dynamic pricing based on print configuration
* ⚡ Real-time order tracking (pending → completed)
* 🔐 Secure authentication for students & shop owners
* 🖥️ Dedicated dashboard for shop owners
* 💳 Integrated payment workflow
* ☁️ Cloud-based document storage

---

## 🛠️ Tech Stack

**Frontend:**

* React.js
* Tailwind CSS

**Backend:**

* Node.js
* Express.js

**Database & Services:**

* Supabase (PostgreSQL, Auth, Realtime)

**Other Tools:**

* WebSockets (Realtime updates)
* Cloud Storage (File handling)
* Payment Gateway (Razorpay / Stripe)

---

## 🧠 System Architecture

* React frontend communicates with backend APIs
* Backend manages business logic and order lifecycle
* Supabase handles database, authentication, and realtime updates
* Storage service manages file uploads and retrieval

---

## 🔄 Order Lifecycle

```text
Pending → Confirmed → Printing → Ready → Completed
```

---

## 📸 Screenshots

> (Add real screenshots here for better impact)

* User Dashboard
* File Upload Interface
* Order Tracking Page
* Shop Owner Panel

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/docuvio-fullstack.git
cd docuvio-fullstack
```

### 2. Setup Backend

```bash
cd backend
npm install
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PAYMENT_API_KEY=your_payment_key
```

---

## 🚀 Future Enhancements

* 📱 Mobile application support
* 🤖 AI-based document optimization
* 📊 Analytics dashboard for shop owners
* 📍 Location-based shop discovery
* ⏱️ Automated pricing and delivery estimation

---

## 💡 Key Learnings

* Built a real-time full-stack application
* Implemented secure authentication and payment workflows
* Designed scalable order lifecycle management
* Worked with Supabase as a backend-as-a-service platform

---

## ⚠️ Note

This repository is intended for showcasing development skills and system design.
The codebase is not open for public contributions.

---

## 📄 License

This project is proprietary and developed for demonstration and academic purposes.
All rights reserved © Akshat Paul.

Unauthorized copying, distribution, or modification of this project is not permitted.

---

## 👨‍💻 Author

**Akshat Paul**
Full Stack Developer | Cloud Enthusiast
