// ============================================
// ROUTER.JS - Sistema de enrutamiento SPA
// ============================================

import { Auth } from './auth.js';

// Importar vistas
import { HomeView } from './views/home.js';
import { LoginView } from './views/login.js';
import { RegisterView } from './views/register.js';
import { EventsView } from './views/events.js';
import { CreateEventView } from './views/createEvent.js';
import { EditEventView } from './views/editEvent.js';
import { EventDetailView } from './views/eventDetail.js';

export class Router {
    constructor() {
        this.main = document.getElementById('main');
        this.auth = new Auth();

        // Definir rutas
        this.routes = {
            'home': {
                view: HomeView,
                protected: false
            },
            'login': {
                view: LoginView,
                protected: false
            },
            'register': {
                view: RegisterView,
                protected: false
            },
            'events': {
                view: EventsView,
                protected: true
            },
            'createEvent': {
                view: CreateEventView,
                protected: true
            },
            'editEvent': {
                view: EditEventView,
                protected: true
            },
            'eventDetail': {
                view: EventDetailView,
                protected: true
            }
        };

        // Manejar rutas no encontradas
        this.notFoundRoute = {
            render: () => {
                this.main.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <h2 class="empty-state-title">404 - Página no encontrada</h2>
                        <p>La página que buscas no existe.</p>
                        <a href="#" data-view="home" class="btn btn-primary mt-2">Volver al inicio</a>
                    </div>
                `;
            }
        };

        // Configurar navegación inicial
        this.handleRoute();
    }

    navigateTo(view, params = null) {
        // Verificar si la ruta requiere autenticación
        const route = this.routes[view];

        if (!route) {
            console.error(`Ruta no encontrada: ${view}`);
            this.notFoundRoute.render();
            return;
        }

        // Verificar protección de ruta
        if (route.protected && !this.auth.isAuthenticated()) {
            this.navigateTo('login');
            return;
        }

        // Navegar a la ruta
        if (params) {
            window.history.pushState({ view, params }, '', `#${view}`);
        } else {
            window.history.pushState({ view }, '', `#${view}`);
        }

        this.renderCurrentView();
    }

    handleRoute() {
        // Obtener hash de la URL
        const hash = window.location.hash.slice(1) || 'home';
        const [view, ...params] = hash.split('/');

        // Verificar si la ruta existe
        const route = this.routes[view];

        if (!route) {
            this.notFoundRoute.render();
            return;
        }

        // Verificar protección de ruta
        if (route.protected && !this.auth.isAuthenticated()) {
            this.navigateTo('login');
            return;
        }

        // Renderizar vista
        const viewInstance = new route.view(params);
        viewInstance.render(this.main);
    }

    renderCurrentView() {
        // Obtener hash de la URL
        const hash = window.location.hash.slice(1) || 'home';
        const [view, ...params] = hash.split('/');

        // Verificar si la ruta existe
        const route = this.routes[view];

        if (!route) {
            this.notFoundRoute.render();
            return;
        }

        // Verificar protección de ruta
        if (route.protected && !this.auth.isAuthenticated()) {
            this.navigateTo('login');
            return;
        }

        // Renderizar vista
        const viewInstance = new route.view(params);
        viewInstance.render(this.main);
    }

    // Método para obtener parámetros de la ruta
    getParams() {
        const hash = window.location.hash.slice(1);
        const parts = hash.split('/');
        return parts.slice(1);
    }
}
