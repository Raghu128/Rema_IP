# 📌 Rema  

🚀 **Rema** is a project management dashboard designed for faculty and students to efficiently handle research projects, student leaves, expenses, and equipment usage. This web application streamlines academic project management, ensuring smooth collaboration between professors and students.  

🔗 **Live Demo**: [Rema](https://rema-dash.vercel.app/)  
![Demo App](/ScreenShots/ProjectManage.png)
---

## 📖 Table of Contents  

- [📝 Features](#-features)  
- [🛠 Tech Stack](#-tech-stack)  
- [🚀 Installation](#-installation)  
- [📌 Environment Variables](#-environment-variables)  
- [📂 Folder Structure](#-folder-structure)  
- [📊 Database Schema](#-database-schema)  
- [👨‍💻 API Endpoints](#-api-endpoints)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  

---

## 📝 Features  

### **Faculty Dashboard**  
✅ View notifications and upcoming venue details on the landing page  
✅ Manage research projects and sponsored projects  
✅ View and manage students working under a professor  
✅ Track and approve student leave requests  
✅ Manage project-related expenses and equipment  
✅ Add new users and generate credentials for student access  

### **Student Dashboard**  
✅ View notifications and upcoming venue details  
✅ Access projects they are working on  
✅ Track leave requests and usage history  
✅ View and manage professor-assigned equipment  

---

## 🛠 Tech Stack  

### **Frontend**  
- ⚛️ React.js (Vite)  
- 🌐 Axios for API requests  

### **Backend**  
- 🚀 Node.js with Express.js  
- 📦 MongoDB with Mongoose ORM  
- 🔐 JWT Authentication  
- 🍪 Cookie-based authentication  

### **Deployment**  
- 🌍 **Frontend**: Vercel  
- ☁ **Backend**: Vercel

---

## 🚀 Installation  

### **Clone the Repository**  
```sh
git clone https://github.com/Raghu128/Rema_IP.git
```

### **Backend Setup**  
1. Navigate to the `backend` folder:  
   ```sh
   cd backend
   ```  
2. Install dependencies:  
   ```sh
   npm install
   ```  
3. Create a `.env` file in the backend root directory and add:  
   ```
   PORT=5000
   ADMIN_PASSWORD=yourpassword
   MONGODB_URI=your-mongodb-uri
   DB_NAME=rema-dash
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=https://rema-dash.vercel.app
   ```
4. Start the backend server:  
   ```sh
   npm start
   ```  

### **Frontend Setup**  
1. Navigate to the `frontend` folder:  
   ```sh
   cd frontend
   ```  
2. Install dependencies:  
   ```sh
   npm install
   ```  
3. Create a `.env` file in the frontend root directory and add:  
    ```
    VITE_BACKEND_URL=https://rema-backend.vercel.app/
    ```
4. Start the frontend:  
   ```sh
   npm run dev
   ```  

---

## 📌 Environment Variables  

The `.env` file contains the following variables for the backend:  
```plaintext
PORT=5000
ADMIN_PASSWORD=yourpassword
MONGODB_URI=your-mongodb-uri
DB_NAME=rema-dash
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://rema-dash.vercel.app
```

---

## 📂 Folder Structure  

```
rema-dash/
│── frontend/  
│   ├── src/  
│   │   ├── components/  
│   │   ├── pages/  
│   │   ├── hooks/  
│   │   ├── utils/  
│   │   ├── assets/  
│   │   ├── App.js  
│   │   └── main.jsx  
│   ├── public/  
│   ├── package.json  
│   └── vite.config.js  
│  
│── backend/  
│   ├── controllers/  
│   ├── models/  
│   ├── routes/  
│   ├── middleware/  
│   ├── config/  
│   ├── server.js  
│   ├── .env  
│   ├── package.json  
│   └── README.md  
```

---

## 📊 Database Schema  

The backend uses MongoDB with the following schema:  

### **User Table**  
| Column     | Type     | Description |
|------------|---------|-------------|
| id         | SERIAL  | Primary Key |
| name       | String  | User's Name |
| role       | Enum    | student, faculty, admin |
| email      | String  | Unique Email |
| password   | String  | Hashed Password |

### **Projects Table**  
| Column     | Type     | Description |
|------------|---------|-------------|
| id         | SERIAL  | Primary Key |
| faculty_id | INT     | Faculty Reference |
| name       | String  | Project Name |
| domain     | String  | Research Domain |
| status     | Enum    | ongoing, completed, cancelled |

> **For full schema details, check the backend folder.**

---

## 👨‍💻 API Endpoints  

### **User Management**  
- `POST /api/v1/user` – Create a new user  
- `GET /api/v1/userbyid/:id` – Fetch user by ID  
- `POST /api/v1/logout` – Logout user  

### **Projects Management**  
- `GET /api/v1/projects` – Fetch all projects  
- `POST /api/v1/projects` – Add a new project  
- `GET /api/v1/projects/:id` – Fetch project details  
- `PUT /api/v1/projects/:id` – Update project  

### **Leave Management**  
- `GET /api/v1/leaves` – Fetch leave requests  
- `POST /api/v1/leaves` – Request leave  
- `DELETE /api/v1/leaves/:id` – Cancel leave  

> **For full API documentation, check the backend folder.**

---

## 🤝 Contributing  

💡 We welcome contributions! If you’d like to contribute:  
1. Fork the repository  
2. Create a new branch (`git checkout -b feature-branch`)  
3. Make your changes and commit (`git commit -m "Add new feature"`)  
4. Push to your fork (`git push origin feature-branch`)  
5. Submit a pull request  

---

## 📄 License  

This project is licensed under the **MIT License**.  

---

🚀 **Happy Coding!** 🚀  

Let me know if you want any changes or improvements! 🎉
