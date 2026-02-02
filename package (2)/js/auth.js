// ============================================
// AUTH.JS - Gestión de autenticación
// ============================================

import { API } from './api.js';

const STORAGE_KEY = 'eventManager_user';

export class Auth {
    constructor() {
        this.api = new API();
        this.storageKey = STORAGE_KEY;
    }

    // Verificar sesión al iniciar la aplicación
    async checkSession() {
        try {
            const userData = localStorage.getItem(this.storageKey);

            if (userData) {
                const user = JSON.parse(userData);

                // Verificar que el usuario aún existe en la base de datos
                try {
                    const userFromDB = await this.api.getUserById(user.id);
                    if (userFromDB) {
                        return true;
                    } else {
                        // El usuario no existe, limpiar sesión
                        this.logout();
                        return false;
                    }
                } catch (error) {
                    // Error al verificar usuario, puede ser que el servidor no esté disponible
                    console.warn('No se pudo verificar la sesión:', error);
                    return true; // Mantener la sesión local
                }
            }

            return false;
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            return false;
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        try {
            const userData = localStorage.getItem(this.storageKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    }

    // Verificar si está autenticado
    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }

    // Registrar nuevo usuario
    async register(userData) {
        try {
            // Validar datos requeridos
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error('Todos los campos son requeridos');
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Por favor ingresa un email válido');
            }

            // Validar longitud de contraseña
            if (userData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            // Verificar si el email ya existe
            const existingUsers = await this.api.getUserByEmail(userData.email);

            if (existingUsers && existingUsers.length > 0) {
                throw new Error('El email ya está registrado');
            }

            // Crear usuario con rol por defecto 'user'
            const newUser = {
                name: userData.name.trim(),
                email: userData.email.trim().toLowerCase(),
                password: userData.password, // En producción, esto debería estar encriptado
                role: 'user',
                createdAt: new Date().toISOString()
            };

            const createdUser = await this.api.createUser(newUser);

            // Guardar sesión
            this.saveSession(createdUser);

            return {
                success: true,
                user: createdUser,
                message: 'Usuario registrado correctamente'
            };
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    // Iniciar sesión
    async login(email, password) {
        try {
            // Validar campos vacíos
            if (!email || !password) {
                throw new Error('Por favor ingresa email y contraseña');
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Por favor ingresa un email válido');
            }

            // Buscar usuario por email
            const users = await this.api.getUserByEmail(email.trim().toLowerCase());

            if (!users || users.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            const user = users[0];

            // Verificar contraseña
            if (user.password !== password) {
                throw new Error('Contraseña incorrecta');
            }

            // Guardar sesión
            this.saveSession(user);

            return {
                success: true,
                user: user,
                message: 'Inicio de sesión exitoso'
            };
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    // Cerrar sesión
    logout() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return false;
        }
    }

    // Guardar sesión en localStorage
    saveSession(user) {
        try {
            // No guardar la contraseña en localStorage
            const { password, ...safeUser } = user;
            localStorage.setItem(this.storageKey, JSON.stringify(safeUser));
        } catch (error) {
            console.error('Error al guardar sesión:', error);
            throw new Error('Error al guardar la sesión');
        }
    }
}
