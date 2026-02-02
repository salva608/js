// ============================================
// EVENTDETAIL.JS - Vista de detalles de evento
// ============================================

import { Router } from '../router.js';
import { Auth } from '../auth.js';
import { API } from '../api.js';

export class EventDetailView {
    constructor(params = []) {
        this.params = params;
        this.auth = new Auth();
        this.api = new API();
        this.eventId = params[0] || null;
        this.event = null;
        this.registrations = [];
    }

    async render(container) {
        if (!this.eventId) {
            const router = new Router();
            router.navigateTo('events');
            return;
        }

        container.innerHTML = `
            <div class="event-detail">
                <div id="loadingContainer" class="loading">
                    <div class="spinner"></div>
                </div>
                <div id="eventContent" style="display: none;"></div>
            </div>
        `;

        // Cargar datos del evento
        await this.loadEvent();
    }

    async loadEvent() {
        try {
            // Obtener evento
            this.event = await this.api.getEventById(this.eventId);

            if (!this.event) {
                throw new Error('Evento no encontrado');
            }

            // Obtener registros
            this.registrations = await this.api.getRegistrationsByEvent(this.eventId);

            // Renderizar contenido
            this.renderContent();
        } catch (error) {
            console.error('Error al cargar evento:', error);
            const router = new Router();
            if (window.app && window.app.showToast) {
                window.app.showToast(error.message || 'Error al cargar el evento', 'error');
            }
            router.navigateTo('events');
        }
    }

    renderContent() {
        const currentUser = this.auth.getCurrentUser();
        const isOrganizer = currentUser && this.event.organizerId === currentUser.id;
        const isRegistered = this.registrations.some(reg => reg.userId === currentUser.id);
        const isFull = this.registrations.length >= this.event.maxCapacity;

        // Formatear fecha
        const eventDate = new Date(this.event.date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const createdDate = new Date(this.event.createdAt).toLocaleDateString('es-ES');

        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('eventContent').style.display = 'block';

        document.getElementById('eventContent').innerHTML = `
            <div class="event-detail-header">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <a href="#" data-view="events" class="btn btn-secondary btn-small mb-2">← Volver a Eventos</a>
                        <h1 class="event-detail-title">${this.escapeHtml(this.event.title)}</h1>
                        <div class="event-detail-meta">
                            <span>📅 ${eventDate}</span>
                            <span>📍 ${this.escapeHtml(this.event.location)}</span>
                            <span>👤 Organizado por: ${this.escapeHtml(this.event.organizerName || 'Desconocido')}</span>
                        </div>
                    </div>
                    ${isOrganizer ? `
                        <div style="display: flex; gap: 0.5rem;">
                            <a href="#" data-view="editEvent" data-id="${this.event.id}" class="btn btn-secondary btn-small">Editar Evento</a>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="event-detail-description">
                <h3 style="margin-bottom: 1rem;">Descripción del Evento</h3>
                <p>${this.escapeHtml(this.event.description)}</p>
                <p style="margin-top: 1rem; color: var(--text-light); font-size: 0.875rem;">
                    Evento creado el ${createdDate}
                </p>
            </div>

            <div class="registration-info">
                <h3>Registro de Asistentes</h3>

                <div class="registration-status ${isFull ? 'full' : 'available'}">
                    <strong>Estado:</strong>
                    ${isFull
                        ? '⚠️ Este evento ha alcanzado su capacidad máxima'
                        : `✅ Hay ${this.registrations.length} de ${this.event.maxCapacity} cupos disponibles`
                    }
                </div>

                ${!isOrganizer ? `
                    <div style="margin: 1.5rem 0;">
                        ${isRegistered ? `
                            <button id="unregisterBtn" class="btn btn-danger btn-full">
                                Cancelar Mi Registro
                            </button>
                        ` : `
                            <button id="registerBtn" class="btn btn-primary btn-full" ${isFull ? 'disabled' : ''}>
                                ${isFull ? 'Cupo Lleno' : 'Registrarse al Evento'}
                            </button>
                        `}
                    </div>
                ` : ''}

                <div style="margin-top: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">Lista de Registrados (${this.registrations.length}/${this.event.maxCapacity})</h4>
                    ${this.registrations.length > 0 ? `
                        <ul style="list-style: none; padding: 0;">
                            ${this.registrations.map(reg => `
                                <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="color: var(--secondary-color);">✓</span>
                                    ${this.escapeHtml(reg.userName || 'Usuario')}
                                    ${reg.userId === currentUser?.id ? '<span style="color: var(--text-light);">(Tú)</span>' : ''}
                                </li>
                            `).join('')}
                        </ul>
                    ` : `
                        <p style="color: var(--text-light);">Aún no hay nadie registrado.</p>
                    `}
                </div>
            </div>
        `;

        // Configurar event listeners
        this.setupEventListeners(isOrganizer, isRegistered, isFull);
    }

    setupEventListeners(isOrganizer, isRegistered, isFull) {
        // Event listener para volver
        document.querySelector('[data-view="events"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            const router = new Router();
            router.navigateTo('events');
        });

        // Event listener para editar
        document.querySelector('[data-view="editEvent"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            const router = new Router();
            router.navigateTo('editEvent', [this.event.id]);
        });

        // Event listener para registrarse
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn && !isOrganizer) {
            registerBtn.addEventListener('click', async () => {
                await this.handleRegister();
            });
        }

        // Event listener para cancelar registro
        const unregisterBtn = document.getElementById('unregisterBtn');
        if (unregisterBtn && !isOrganizer) {
            unregisterBtn.addEventListener('click', async () => {
                await this.handleUnregister();
            });
        }
    }

    async handleRegister() {
        try {
            const currentUser = this.auth.getCurrentUser();

            // Verificar capacidad máxima
            if (this.registrations.length >= this.event.maxCapacity) {
                throw new Error('El evento ha alcanzado su capacidad máxima');
            }

            // Verificar si ya está registrado
            const alreadyRegistered = this.registrations.some(reg => reg.userId === currentUser.id);
            if (alreadyRegistered) {
                throw new Error('Ya estás registrado en este evento');
            }

            // Crear registro
            const registrationData = {
                eventId: this.event.id,
                userId: currentUser.id,
                userName: currentUser.name,
                eventTitle: this.event.title,
                registeredAt: new Date().toISOString()
            };

            await this.api.createRegistration(registrationData);

            // Mostrar mensaje de éxito
            if (window.app && window.app.showToast) {
                window.app.showToast('Te has registrado correctamente al evento', 'success');
            }

            // Recargar datos
            await this.loadEvent();
        } catch (error) {
            console.error('Error al registrarse:', error);
            if (window.app && window.app.showToast) {
                window.app.showToast(error.message, 'error');
            }
        }
    }

    async handleUnregister() {
        if (!confirm('¿Estás seguro de que deseas cancelar tu registro?')) {
            return;
        }

        try {
            const currentUser = this.auth.getCurrentUser();

            // Encontrar el registro del usuario actual
            const registration = this.registrations.find(reg => reg.userId === currentUser.id);

            if (!registration) {
                throw new Error('No se encontró tu registro');
            }

            // Eliminar registro
            await this.api.deleteRegistration(registration.id);

            // Mostrar mensaje de éxito
            if (window.app && window.app.showToast) {
                window.app.showToast('Has cancelado tu registro correctamente', 'success');
            }

            // Recargar datos
            await this.loadEvent();
        } catch (error) {
            console.error('Error al cancelar registro:', error);
            if (window.app && window.app.showToast) {
                window.app.showToast(error.message, 'error');
            }
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
