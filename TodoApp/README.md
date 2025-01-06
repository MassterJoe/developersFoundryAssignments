# TodoApp Backend

**TodoApp** is a robust backend system designed to support task management with secure APIs for user authentication and task operations. Built with modern web technologies, it ensures reliability, scalability, and security.

---

## 🚀 Features

- **User Registration and Authentication**: Secure user management using JWT or sessions.
- **Task Management**: CRUD operations for tasks with attributes like title, description, deadline, and priority.
- **Task Filtering**: APIs for filtering tasks by priority or due date.
- **Search Functionality**: Search for tasks using keywords in titles or descriptions.
- **Data Persistence**: Reliable storage powered by MongoDB.
- **API Documentation**: Comprehensive Swagger documentation for seamless integration.

---

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB

---

## ⚙️ Installation and Setup

Follow these steps to set up the backend locally:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/MassterJoe/developersFoundryAssignments
    cd todoapp
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and configure the following:
    ```env
    PORT=3000
    JWT_SECRET=your_jwt_secret
    DB_URI=mongodb://localhost:27017/todoapp
    ```

4. **Run the Application**:
    ```bash
    npm start
    ```
    Access the API at `http://localhost:3000`.

---

## 🧪 API Endpoints

| Method | Endpoint                         | Description                  |
|--------|----------------------------------|------------------------------|
| POST   | `/api/auth/register`             | Register a new user          |
| POST   | `/api/auth/login`                | Login a user                 |
| GET    | `/api/tasks`                     | Fetch all tasks              |
| POST   | `/api/tasks`                     | Create a new task            |
| PUT    | `/api/tasks/:id`                 | Update a task by ID          |
| DELETE | `/api/tasks/:id`                 | Delete a task by ID          |
| GET    | `/api/tasks/search?query=:query` | Search tasks by keyword      |

---

## 🚧 Roadmap

- [x] User authentication and registration
- [x] Basic task management
- [x] Task filtering and search

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📧 Contact

If you have any questions or feedback, feel free to reach out:

- **Author**: Salawu O. Joseph

