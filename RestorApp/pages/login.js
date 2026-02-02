import { fetchUsers } from "../services/api.js";
import { saveUser } from "../services/storage.js";

export function login() {
  return `
    <div class="login-wrapper">
      <div class="login-container">
        <div class="login-card">
          <div class="logo-circle">
            <i class="bi bi-x-diamond-fill"></i>
          </div>

          <h2 class="text-center mb-2">RestorApp</h2>
          <p class="text-center text-muted mb-4">Login to your account</p>

          <form id="loginForm">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <div class="input-group">
                <i class="bi bi-person input-icon"></i>
                <input id="name" type="text" class="form-control" placeholder="e.g. John Doe">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <i class="bi bi-envelope input-icon"></i>
                <input id="email" type="email" class="form-control" placeholder="name@example.com">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="input-group">
                <i class="bi bi-lock input-icon"></i>
                <input id="password" type="password" class="form-control" placeholder="Enter your password">
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label">Select Role</label>
              <div class="input-group">
                <i class="bi bi-briefcase input-icon"></i>
                <select id="role" class="form-select">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-sign-in w-100 mb-3">
              Sign In
            </button>

            <p id="error" class="text-center text-danger mb-0"></p>
          </form>
        </div>

        <p class="footer-text">RestorApp Academic Simulation</p>
      </div>
    </div>
  `;
}


export async function loginLogic() {
  const form = document.getElementById("loginForm");
  const error = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!email) {
      error.textContent = "Email is required";
      return;
    }

    if (!password) {
      error.textContent = "Password is required";
      return;
    }

    const users = await fetchUsers();

    const user = users.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (!user) {
      error.textContent = "Invalid credentials";
      return;
    }

    saveUser(user);

    // Redirección por rol
    location.hash = "#/menu";
  });
}
