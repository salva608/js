// ============================================
// EDITEVENT.JS - Vista de edición de eventos
// ============================================

import { Router } from '../router.js';
import { Auth } from '../auth.js';
import { API } from '../api.js';

export class EditEventView {
    constructor(params = []) {
        this.params = params;
        this.auth = new Auth();
        this.api = new API();
        this.eventId = params[0] || null;
        this.event = null;
    }

    async render(container) {
        if (!this.eventId) {
            const router = new Router();
            router.navigateTo('events');
            return;
        }

        container.innerHTML = `
            <div class="form-container" style="max-width: 700px;">
                <h2 class="form-title">Editar Evento</h2>
                <div id="loadingContainer" class="loading">
                    <div class="spinner"></div>
                </div>
                <form id="editEventForm" style="display: none;">
                    <div class="form-group">
                        <label for="title">Título del Evento</label>
                        <input type="text" id="title" name="title" placeholder="Nombre del evento" required>
                        <span class="error-message" id="titleError"></span>
                    </div>

                    <div class="form-group">
                        <label for="description">Descripción</label>
                        <textarea id="description" name="description" placeholder="Describe tu evento..." required></textarea>
                        <span class="error-message" id="descriptionError"></span>
                    </div>

                    <div class="form-group">
                        <label for="date">Fecha y Hora</label>
                        <input type="datetime-local" id="date" name="date" required>
                        <span class="error-message" id="dateError"></span>
                    </div>

                    <div class="form-group">
                        <label for="location">Ubicación</label>
                        <input type="text" id="location" name="location" placeholder="Lugar del evento" required>
                        <span class="error-message" id="locationError"></span>
                    </div>

                    <div class="form-group">
                        <label for="maxCapacity">Capacidad Máxima</label>
                        <input type="number" id="maxCapacity" name="maxCapacity" min="1" max="10000" placeholder="Número máximo de asistentes" required>
                        <span class="error-message" id="maxCapacityError"></span>
                        <small style="color: var(--text-light);">Valor actual: ${this.event ? this.event.registrationCount || 0 : 0} registrados</small>
                    </div>

                    <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Guardar Cambios</button>
                        <a href="#" data-view="events" class="btn btn-secondary" style="flex: 1; text-align: center; line-height: 1.5;">Cancelar</a>
                    </div>
                </form>
            </div>
        `;

        // Cargar datos del evento
        await this.loadEvent();
    }

    async loadEvent() {
        try {
            this.event = await this.api.getEventById(this.eventId);

            if (!this.event) {
                throw new Error('Evento no encontrado');
            }

            // Verificar que el usuario actual es el organizador
            const currentUser = this.auth.getCurrentUser();
            if (this.event.organizerId !== currentUser.id) {
                throw new Error('No tienes permiso para editar este evento');
            }

            // Llenar el formulario
            this.fillForm();

            // Mostrar formulario
            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('editEventForm').style.display = 'block';

            // Configurar event listeners
            this.setupEventListeners();
        } catch (error) {
            console.error('Error al cargar evento:', error);
            const router = new Router();
            if (window.app && window.app.showToast) {
                window.app.showToast(error.message || 'Error al cargar el evento', 'error');
            }
            router.navigateTo('events');
        }
    }

    fillForm() {
        document.getElementById('title').value = this.event.title || '';
        document.getElementById('description').value = this.event.description || '';
        document.getElementById('location').value = this.event.location || '';

        // Formatear fecha para el input datetime-local
        if (this.event.date) {
            const date = new Date(this.event.date);
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            document.getElementById('date').value = localDate.toISOString().slice(0, 16);
        }

        document.getElementById('maxCapacity').value = this.event.maxCapacity || 100;

        // Configurar fecha mínima
        const dateInput = document.getElementById('date');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateInput.min = now.toISOString().slice(0, 16);
    }

    setupEventListeners() {
        const form = document.getElementById('editEventForm');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleUpdateEvent();
            });
        }
    }

    async handleUpdateEvent() {
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value;
        const location = document.getElementById('location').value.trim();
        const maxCapacity = parseInt(document.getElementById('maxCapacity').value, 10);
        const router = new Router();

        // Limpiar errores previos
        this.clearErrors();

        try {
            // Validaciones del lado del cliente
            if (!title || title.length < 3) {
                throw new Error('El título debe tener al menos 3 caracteres');
            }

            if (!description || description.length < 10) {
                throw new Error('La descripción debe tener al menos 10 caracteres');
            }

            if (!date) {
                throw new Error('Por favor selecciona una fecha y hora');
            }

            const eventDate = new Date(date);
            if (eventDate < new Date()) {
                throw new Error('La fecha del evento debe ser futura');
            }

            if (!location || location.length < 3) {
                throw new Error('La ubicación debe tener al menos 3 caracteres');
            }

            if (!maxCapacity || maxCapacity < 1) {
                throw new Error('La capacidad debe ser al menos 1');
            }

            // Verificar que la capacidad no sea menor que los registros actuales
            const registrations = await this.api.getRegistrationsByEvent(this.eventId);
            if (maxCapacity < registrations.length) {
                throw new Error(`No puedes reducir la capacidad por debajo de ${registrations.length} registros actuales`);
            }

            // Actualizar objeto del evento
            const eventData = {
                ...this.event,
                title,
                description,
                date: new Date(date).toISOString(),
                location,
                maxCapacity,
                updatedAt: new Date().toISOString()
            };

            // Actualizar evento en la API
            await this.api.updateEvent(this.eventId, eventData);

            // Mostrar mensaje de éxito
            if (window.app && window.app.showToast) {
                window.app.showToast('Evento actualizado correctamente', 'success');
            }

            // Redirigir a la lista de eventos
            router.navigateTo('events');
        } catch (error) {
            console.error('Error al actualizar evento:', error);

            // Determinar qué campo mostrar el error
            let errorField = 'titleError';
            if (error.message.includes('título')) {
                errorField = 'titleError';
            } else if (error.message.includes('descripción') || error.message.includes('descripcion')) {
                errorField = 'descriptionError';
            } else if (error.message.includes('fecha')) {
                errorField = 'dateError';
            } else if (error.message.includes('ubicación') || error.message.includes('ubicacion')) {
                errorField = 'locationError';
            } else if (error.message.includes('capacidad')) {
                errorField = 'maxCapacityError';
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
