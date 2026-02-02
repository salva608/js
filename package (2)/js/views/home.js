// ============================================
// HOME.JS - Vista de inicio
// ============================================

import { Router } from '../router.js';
import { Auth } from '../auth.js';

export class HomeView {
    constructor(params = []) {
        this.params = params;
        this.auth = new Auth();
    }

    render(container) {
        const isAuthenticated = this.auth.isAuthenticated();

        container.innerHTML = `
            <div class="home-hero">
                <h1>Sistema de Gestión de Eventos</h1>
                <p>${isAuthenticated
                    ? `¡Bienvenido de nuevo, ${this.auth.getCurrentUser().name}!`
                    : 'La plataforma definitiva para crear y gestionar tus eventos'
                }</p>
                ${!isAuthenticated ? `
                    <div class="form-footer">
                        <a href="#" data-view="login" class="btn btn-primary">Iniciar Sesión</a>
                        <a href="#" data-view="register" class="btn btn-secondary" style="margin-left: 1rem;">Registrarse</a>
                    </div>
                ` : `
                    <div class="form-footer">
                        <a href="#" data-view="events" class="btn btn-primary">Ver Eventos</a>
                        <a href="#" data-view="createEvent" class="btn btn-secondary" style="margin-left: 1rem;">Crear Evento</a>
                    </div>
                `}
            </div>

            <div class="features-grid">
                <div class="card feature-card">
                    <div class="feature-icon">📅</div>
                    <h3 class="feature-title">Crear Eventos</h3>
                    <p class="feature-description">Crea eventos personalizados con fecha, ubicación, descripción y capacidad máxima.</p>
                </div>

                <div class="card feature-card">
                    <div class="feature-icon">👥</div>
                    <h3 class="feature-title">Gestionar Asistentes</h3>
                    <p class="feature-description">Controla los registros y la capacidad de tus eventos de manera eficiente.</p>
                </div>

                <div class="card feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3 class="feature-title">Sistema Seguro</h3>
                    <p class="feature-description">Autenticación segura y protección de rutas para tus datos.</p>
                </div>

                <div class="card feature-card">
                    <div class="feature-icon">📱</div>
                    <h3 class="feature-title">Diseño Responsivo</h3>
                    <p class="feature-description">Accede desde cualquier dispositivo con nuestra interfaz adaptativa.</p>
                </div>
            </div>
        `;

        // Configurar event listeners
        this.setupEventListeners(container);
    }

    setupEventListeners(container) {
        // Los event listeners se manejan en app.js
    }
}
