// ============================================
// CREATEEVENT.JS - Vista de creación de eventos
// ============================================

import { Router } from '../router.js';
import { Auth } from '../auth.js';
import { API } from '../api.js';

export class CreateEventView {
    constructor(params = []) {
        this.params = params;
        this.auth = new Auth();
        this.api = new API();
    }

    render(container) {
        container.innerHTML = `
            <div class="form-container" style="max-width: 700px;">
                <h2 class="form-title">Crear Nuevo Evento</h2>
                <form id="createEventForm">
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
                    </div>

                    <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Crear Evento</button>
                        <a href="#" data-view="events" class="btn btn-secondary" style="flex: 1; text-align: center; line-height: 1.5;">Cancelar</a>
                    </div>
                </form>
            </div>
        `;

        // Configurar event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('createEventForm');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleCreateEvent();
            });
        }

        // Configurar fecha mínima
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            dateInput.min = now.toISOString().slice(0, 16);
        }
    }

    async handleCreateEvent() {
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

            const currentUser = this.auth.getCurrentUser();

            // Crear objeto del evento
            const eventData = {
                title,
                description,
                date: new Date(date).toISOString(),
                location,
                maxCapacity,
                organizerId: currentUser.id,
                organizerName: currentUser.name,
                createdAt: new Date().toISOString()
            };

            // Crear evento en la API
            const createdEvent = await this.api.createEvent(eventData);

            // Mostrar mensaje de éxito
            if (window.app && window.app.showToast) {
                window.app.showToast('Evento creado correctamente', 'success');
            }

            // Redirigir a la lista de eventos
            router.navigateTo('events');
        } catch (error) {
            console.error('Error al crear evento:', error);

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
