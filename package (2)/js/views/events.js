// ============================================
// EVENTS.JS - Vista de lista de eventos
// ============================================

import { Router } from '../router.js';
import { Auth } from '../auth.js';
import { API } from '../api.js';

export class EventsView {
    constructor(params = []) {
        this.params = params;
        this.auth = new Auth();
        this.api = new API();
        this.events = [];
    }

    async render(container) {
        const currentUser = this.auth.getCurrentUser();

        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Eventos</h1>
                    <p class="page-subtitle">Explora y gestiona todos los eventos disponibles</p>
                </div>
                <a href="#" data-view="createEvent" class="btn btn-primary">Crear Evento</a>
            </div>

            <div id="eventsContainer">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        // Cargar eventos
        await this.loadEvents();
    }

    async loadEvents() {
        const container = document.getElementById('eventsContainer');

        try {
            // Obtener todos los eventos
            this.events = await this.api.getEvents();

            if (this.events.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📅</div>
                        <h2 class="empty-state-title">No hay eventos disponibles</h2>
                        <p>Sé el primero en crear un evento.</p>
                        <a href="#" data-view="createEvent" class="btn btn-primary mt-2">Crear Evento</a>
                    </div>
                `;
                return;
            }

            // Obtener conteo de registros para cada evento
            const eventsWithRegistrations = await Promise.all(
                this.events.map(async (event) => {
                    const registrations = await this.api.getRegistrationsByEvent(event.id);
                    return {
                        ...event,
                        registrationCount: registrations.length
                    };
                })
            );

            // Renderizar eventos
            this.renderEvents(container, eventsWithRegistrations);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">❌</div>
                    <h2 class="empty-state-title">Error al cargar eventos</h2>
                    <p>No se pudieron cargar los eventos. Por favor, verifica que el servidor esté ejecutándose.</p>
                    <button onclick="location.reload()" class="btn btn-primary mt-2">Reintentar</button>
                </div>
            `;
        }
    }

    renderEvents(container, events) {
        const currentUser = this.auth.getCurrentUser();

        container.innerHTML = `
            <div class="events-grid">
                ${events.map(event => this.createEventCard(event, currentUser)).join('')}
            </div>
        `;

        // Configurar event listeners para las tarjetas
        this.setupEventListeners();
    }

    createEventCard(event, currentUser) {
        const isOrganizer = currentUser && event.organizerId === currentUser.id;
        const isFull = event.registrationCount >= event.maxCapacity;
        const eventDate = new Date(event.date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="card event-card" data-event-id="${event.id}">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${this.escapeHtml(event.title)}</h3>
                        <div class="card-meta">
                            <span>📅 ${eventDate}</span>
                            <span>📍 ${this.escapeHtml(event.location)}</span>
                        </div>
                    </div>
                </div>
                <p class="card-description">${this.escapeHtml(event.description.substring(0, 150))}${event.description.length > 150 ? '...' : ''}</p>
                <div class="card-meta mb-2">
                    <span>👥 ${event.registrationCount}/${event.maxCapacity} registrados</span>
                    ${isFull ? '<span style="color: #e74c3c;">⚠️ Cupo lleno</span>' : ''}
                </div>
                <div class="card-actions">
                    <a href="#" data-view="eventDetail" data-id="${event.id}" class="btn btn-primary btn-small">Ver Detalles</a>
                    ${isOrganizer ? `
                        <a href="#" data-view="editEvent" data-id="${event.id}" class="btn btn-secondary btn-small">Editar</a>
                        <button class="btn btn-danger btn-small delete-event" data-id="${event.id}">Eliminar</button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Event listeners para ver detalles
        document.querySelectorAll('[data-view="eventDetail"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = e.target.closest('[data-id]').dataset.id;
                const router = new Router();
                router.navigateTo('eventDetail', [eventId]);
            });
        });

        // Event listeners para editar
        document.querySelectorAll('[data-view="editEvent"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const eventId = e.target.closest('[data-id]').dataset.id;
                const router = new Router();
                router.navigateTo('editEvent', [eventId]);
            });
        });

        // Event listeners para eliminar
        document.querySelectorAll('.delete-event').forEach(button => {
            button.addEventListener('click', async (e) => {
                const eventId = e.target.dataset.id;
                await this.handleDeleteEvent(eventId);
            });
        });
    }

    async handleDeleteEvent(eventId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            // Eliminar registros asociados primero
            await this.api.deleteRegistrationsByEvent(eventId);

            // Eliminar evento
            await this.api.deleteEvent(eventId);

            // Mostrar mensaje y recargar
            if (window.app && window.app.showToast) {
                window.app.showToast('Evento eliminado correctamente', 'success');
            }

            // Recargar eventos
            await this.loadEvents();
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            if (window.app && window.app.showToast) {
                window.app.showToast('Error al eliminar el evento', 'error');
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
