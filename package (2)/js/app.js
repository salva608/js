// ============================================
// APP.JS - Punto de entrada principal
// ============================================

// Importar módulos
import { Router } from './router.js';
import { Auth } from './auth.js';
import { API } from './api.js';

// Inicialización de la aplicación
class App {
    constructor() {
        this.router = new Router();
        this.auth = new Auth();
        this.api = new API();

        // Referencias al DOM
        this.header = document.getElementById('header');
        this.main = document.getElementById('main');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.toastContainer = document.getElementById('toastContainer');

        // Estado de la aplicación
        this.state = {
            user: null,
            currentView: 'home'
        };

        // Inicializar
        this.init();
    }

    async init() {
        try {
            // Verificar sesión existente
            await this.auth.checkSession();

            // Configurar event listeners
            this.setupEventListeners();

            // Renderizar vista inicial
            this.render();

            console.log('Aplicación inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            this.showToast('Error al inicializar la aplicación', 'error');
        }
    }

    setupEventListeners() {
        // Event listener para navegación
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('[data-view]');
            if (navLink) {
                e.preventDefault();
                const view = navLink.dataset.view;
                this.router.navigateTo(view);
            }
        });

        // Event listener para logout
        this.logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });

        // Event listener para popstate (botones atrás/adelante del navegador)
        window.addEventListener('popstate', () => {
            this.router.handleRoute();
        });
    }

    async handleLogout() {
        try {
            this.auth.logout();
            this.router.navigateTo('login');
            this.showToast('Sesión cerrada correctamente', 'success');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            this.showToast('Error al cerrar sesión', 'error');
        }
    }

    render() {
        // Actualizar header según el estado de autenticación
        this.updateHeader();

        // Renderizar la vista actual
        this.router.renderCurrentView();
    }

    updateHeader() {
        const user = this.auth.getCurrentUser();

        if (user) {
            this.header.classList.remove('hidden');
            document.getElementById('userInfo').textContent = `Hola, ${user.name}`;
        } else {
            this.header.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        // Agregar al contenedor
        this.toastContainer.appendChild(toast);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Método para acceder al contexto global
    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
