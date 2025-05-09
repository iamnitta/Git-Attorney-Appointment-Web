# Attorney Appointment Web Application

An online system that enables clients and lawyers to schedule appointments, consult on legal cases, and manage related information efficiently and conveniently, reducing reliance on traditional appointment methods.

## 🛠️ Features
- User registration and login
- Lawyer registration
- Search for lawyers and view profiles
- Online lawyer appointment scheduling
- Appointment review and management
- Record service fees and legal cases
- Comment on appointments and approve feedback

## ⚙️ Tech Stack
- Frontend: React, Tailwind CSS  
- Backend: Node.js, Express  
- Database: MongoDB

## 🧱 System Architecture Overview

The application is divided into three main parts:

### 1. Frontend (User Interface)
Built with **React.js** and **Tailwind CSS**

Allows general users to:
- Register and log in
- Search for lawyers and view profiles
- Schedule appointments
- Leave feedback

### 2. Admin Panel (for Admins and Lawyers)
Interface for admins and lawyers to:
- Register as lawyers
- Manage appointments and case records
- Review and approve user feedback
- Record service fees

### 3. Backend
Developed using **Node.js** and **Express.js**

Handles:
- Authentication and authorization
- Data management and API endpoints
- Integration with **MongoDB** for storing user, lawyer, appointment, and case data

## ⚙️ Installation

### 1. frontend (User)

```bash
cd frontend
npm install
npm run dev
 ```
### 2. admin (for Admins and Lawyers)
```bash
cd admin
npm install
npm run dev
 ```

### 3. backend (for Admins and Lawyers)
```bash
cd backend
npm install
npm run server
 ```

 ## 🚀 Deployment

The application has been deployed and is available for public access at:

**Frontend:** [https://git-attorney-appointment-web-frontend.onrender.com](https://git-attorney-appointment-web-frontend.onrender.com)

**Admin:** [https://git-attorney-appointment-web-admin.onrender.com](https://git-attorney-appointment-web-admin.onrender.com)


### Example Login Credentials (for testing purposes):
- **Admin:**
  - **Username:** admin@gmail.com
  - **Password:** lawyer1234

- **Lawyer:**
  - **Username:** noppawat.p@gmail.com
  - **Password:** Noppawat!123
