// ============================================
// LOGIN.JS - Vista de inicio de sesión
// ============================================

import { Router } from '../router.js';
import { Auth } from '../auth.js';
import { API } from '../api.js';

export class LoginView {
    constructor(params = []) {
        this.params = params;
        this.auth = new Auth();
        this.api = new API();
    }

    render(container) {
        // Si ya está autenticado, redirigir a eventos
        if (this.auth.isAuthenticated()) {
            const router = new Router();
            router.navigateTo('events');
            return;
        }

        container.innerHTML = `
            <div class="auth-container">
                <div class="form-container">
                    <h2 class="form-title">Iniciar Sesión</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="tu@email.com" required>
                            <span class="error-message" id="emailError"></span>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" name="password" placeholder="Tu contraseña" required>
                            <span class="error-message" id="passwordError"></span>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Iniciar Sesión</button>
                    </form>
                    <div class="form-footer">
                        <p>¿No tienes cuenta? <a href="#" data-view="register">Regístrate aquí</a></p>
                        <p style="margin-top: 1rem;">
                            <a href="#" data-view="home">Volver al inicio</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Configurar event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('loginForm');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const router = new Router();

        // Limpiar errores previos
        this.clearErrors();

        try {
            // Intentar iniciar sesión
            const result = await this.auth.login(email, password);

            // Mostrar mensaje de éxito
            if (window.app && window.app.showToast) {
                window.app.showToast(result.message, 'success');
            }

            // Redirigir a eventos
            router.navigateTo('events');
        } catch (error) {
            // Mostrar error
            this.showError('passwordError', error.message);
        }
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        const inputElement = document.getElementById(elementId.replace('Error', ''));

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (inputElement) {
            inputElement.parentElement.classList.add('error');
        }
    }

    clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const formGroups = document.querySelectorAll('.form-group');

        errorMessages.forEach(el => el.textContent = '');
        formGroups.forEach(el => el.classList.remove('error'));
    }
}
