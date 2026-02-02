// ============================================
// API.JS - Comunicación con el servidor JSON
// ============================================

const API_BASE_URL = 'http://localhost:3000';

export class API {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Método genérico para hacer peticiones fetch
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Si es una petición DELETE, puede no devolver contenido
            if (response.status === 204) {
                return { success: true };
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ==================== USUARIOS ====================

    // Obtener todos los usuarios
    async getUsers() {
        return this.request('/users');
    }

    // Obtener usuario por ID
    async getUserById(id) {
        return this.request(`/users/${id}`);
    }

    // Obtener usuario por email
    async getUserByEmail(email) {
        return this.request(`/users?email=${encodeURIComponent(email)}`);
    }

    // Crear usuario
    async createUser(userData) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Actualizar usuario
    async updateUser(id, userData) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    // ==================== EVENTOS ====================

    // Obtener todos los eventos
    async getEvents() {
        return this.request('/events');
    }

    // Obtener evento por ID
    async getEventById(id) {
        return this.request(`/events/${id}`);
    }

    // Obtener eventos por organizador
    async getEventsByOrganizer(organizerId) {
        return this.request(`/events?organizerId=${organizerId}`);
    }

    // Crear evento
    async createEvent(eventData) {
        return this.request('/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    }

    // Actualizar evento
    async updateEvent(id, eventData) {
        return this.request(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData),
        });
    }

    // Eliminar evento
    async deleteEvent(id) {
        return this.request(`/events/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== REGISTROS ====================

    // Obtener todos los registros
    async getRegistrations() {
        return this.request('/registrations');
    }

    // Obtener registros por evento
    async getRegistrationsByEvent(eventId) {
        return this.request(`/registrations?eventId=${eventId}`);
    }

    // Obtener registros por usuario
    async getRegistrationsByUser(userId) {
        return this.request(`/registrations?userId=${userId}`);
    }

    // Verificar si un usuario ya está registrado en un evento
    async isUserRegistered(eventId, userId) {
        const registrations = await this.getRegistrationsByEvent(eventId);
        return registrations.some(reg => reg.userId === userId);
    }

    // Crear registro
    async createRegistration(registrationData) {
        return this.request('/registrations', {
            method: 'POST',
            body: JSON.stringify(registrationData),
        });
    }

    // Eliminar registro
    async deleteRegistration(id) {
        return this.request(`/registrations/${id}`, {
            method: 'DELETE',
        });
    }

    // Eliminar registros por evento
    async deleteRegistrationsByEvent(eventId) {
        const registrations = await this.getRegistrationsByEvent(eventId);
        const deletePromises = registrations.map(reg => this.deleteRegistration(reg.id));
        return Promise.all(deletePromises);
    }
}
