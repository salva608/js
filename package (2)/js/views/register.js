// ============================================
// REGISTER.JS - Vista de registro
// ============================================

import { Router } from '../router.js';
import { Auth } from '../auth.js';

export class RegisterView {
    constructor(params = []) {
        this.params = params;
        this.auth = new Auth();
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
                    <h2 class="form-title">Crear Cuenta</h2>
                    <form id="registerForm">
                        <div class="form-group">
                            <label for="name">Nombre Completo</label>
                            <input type="text" id="name" name="name" placeholder="Tu nombre completo" required>
                            <span class="error-message" id="nameError"></span>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="tu@email.com" required>
                            <span class="error-message" id="emailError"></span>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" name="password" placeholder="Mínimo 6 caracteres" required>
                            <span class="error-message" id="passwordError"></span>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirmar Contraseña</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repite tu contraseña" required>
                            <span class="error-message" id="confirmPasswordError"></span>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Crear Cuenta</button>
                    </form>
                    <div class="form-footer">
                        <p>¿Ya tienes cuenta? <a href="#" data-view="login">Inicia sesión aquí</a></p>
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
        const form = document.getElementById('registerForm');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }
    }

    async handleRegister() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const router = new Router();

        // Limpiar errores previos
        this.clearErrors();

        try {
            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            // Validar longitud de contraseña
            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            // Intentar registrar
            const result = await this.auth.register({ name, email, password });

            // Mostrar mensaje de éxito
            if (window.app && window.app.showToast) {
                window.app.showToast(result.message, 'success');
            }

            // Redirigir a eventos
            router.navigateTo('events');
        } catch (error) {
            // Determinar qué campo mostrar el error
            let errorField = 'emailError';
            if (error.message.includes('nombre') || error.message.includes('campo')) {
                errorField = 'nameError';
            } else if (error.message.includes('contrasena') || error.message.includes('contraseña')) {
                errorField = 'passwordError';
            } else if (error.message.includes('email') || error.message.includes('registrado')) {
                errorField = 'emailError';
            }

            this.showError(errorField, error.message);
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
