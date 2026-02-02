# RestorApp – JavaScript SPA Simulation

RestorApp is a Single Page Application (SPA) developed using Vanilla JavaScript.  
The project simulates a restaurant order management system, applying core frontend concepts such as SPA architecture, CRUD operations, session persistence and role-based access.

---

## 🧩 Project Objective

The objective of this project is to demonstrate the understanding of:
- SPA architecture without page reloads
- CRUD operations applied to restaurant orders
- Session persistence using browser storage
- DOM manipulation and dynamic rendering
- Basic authentication and protected routes by role

---

## 🏗️ Project Structure

src/
│
├── pages/ # Application views (login, menu, admin, profile)
├── routes/ # SPA router logic
├── services/ # API simulation and localStorage handling
├── store/ # Global state logic (future scalability)
├── styles/ # Application styles
├── app.js # Application entry point
└── index.html # Main HTML file


---

## 🔄 SPA Architecture

The application works as a SPA by dynamically rendering views inside a main container.
Navigation between views is handled by a custom router without reloading the page.

---

## 🔐 Authentication and Roles

- The system includes a basic authentication mechanism.
- User session data is stored using `localStorage`.
- Routes are protected based on user roles (admin / user).
- Unauthorized access redirects the user to the login view.

---

## 📦 CRUD Operations

Although the application does not require a traditional database, CRUD operations are implemented over **restaurant orders**, which are the core entity of the system:

- **Create:** Add a new order
- **Read:** Display existing orders
- **Update:** Change order status
- **Delete:** Remove an order

Data persistence is simulated using `localStorage`.

---

## 💾 Session Persistence

User sessions are preserved between page reloads using browser storage, allowing a continuous user experience.

---

## 🧠 DOM Interaction

The application dynamically updates the UI through:
- Event listeners
- Conditional rendering
- State-based DOM updates

---

## 🚀 How to Run the Project

1. Clone or download the repository
2. Open the `index.html` file in your browser
3. Log in using the available roles
4. Navigate through the application

---

## 📌 Notes

Due to time constraints, advanced validations and error handling were left for future improvements.
However, the architecture allows easy scalability and optimization.
