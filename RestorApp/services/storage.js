const USER_KEY = "restorapp_user";

// Guardar usuario en sesión
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Obtener usuario logueado
export function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Verificar si hay sesión activa
export function isLoggedIn() {
  return getUser() !== null;
}

// Cerrar sesión
export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
