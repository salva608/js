import { getUser, clearUser } from "../services/storage.js";
import { fetchOrders } from "../services/api.js";

// ─── Mapeo de iconos SVG según estado ───────────────────────────────────────
const statusIcons = {
    pending: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM7.1 4.995a.905.905 0 1 0 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>`,
    preparing: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z"/>
                </svg>`,
    ready: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M11.354 5.646a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7 9.293l3.646-3.647a.5.5 0 0 1 .708 0z"/>
            </svg>`,
    delivered: `<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>`
};

// ─── Formatear fecha a lectura amigable ─────────────────────────────────────
function formatDate(dateStr) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
}

// ─── Generar HTML de un solo pedido ─────────────────────────────────────────
function renderOrderCard(order) {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const icon = statusIcons[order.status] || statusIcons.pending;

    return `
        <div class="order-card">
            <div class="order-icon ${order.status}">
                ${icon}
            </div>
            <div class="order-info">
                <div class="order-number">#ORD-${String(order.id).padStart(4, "0")}</div>
                <div class="order-meta">${formatDate(order.createdAt)} • ${totalItems} ${totalItems === 1 ? "Item" : "Items"}</div>
            </div>
            <div class="order-price">$${order.total.toFixed(2)}</div>
            <span class="order-status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
    `;
}

// ─── Plantilla principal ────────────────────────────────────────────────────
function getTemplate(user) {
    const roleLabel = user.role === "admin" ? "Admin" : "Customer";
    const avatarId = user.id % 10 || 1;

    return `
    <!-- Navbar -->
    <nav class="navbar">
        <div class="navbar-container">
            <a class="navbar-brand" href="#">
                <svg class="logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87-.91-7-5.05-7-9V8.31l7-3.89 7 3.89V11c0 3.95-3.13 8.09-7 9z"/>
                    <path d="M8 12l-2-2-1.41 1.41L8 14.83l8-8L14.59 5.42z"/>
                </svg>
                RestorApp
            </a>
            <a href="#/menu" class="nav-link">Menu</a>
            <button class="logout-btn" id="logout-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                Log Out
            </button>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="main-container">
        <div class="content-grid">
            <!-- Recent Orders Section -->
            <div class="orders-section">
                <div class="section-header">
                    <h2 class="section-title">Recent Orders</h2>
                </div>
                <div id="orders-list">
                    <!-- Se inyecta dinámicamente -->
                </div>
            </div>

            <!-- Account Details Section -->
            <div class="account-section">
                <div class="account-card">
                    <h2 class="section-title">Account Details</h2>

                    <!-- Profile Section -->
                    <div class="profile-section">
                        <div class="profile-avatar">
                            <img src="https://i.pravatar.cc/150?img=${avatarId}" alt="${user.name}">
                            <div class="verified-badge">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="profile-name">${user.name}</div>
                        <div class="profile-email">${user.email}</div>
                        <span class="profile-role">${roleLabel}</span>
                    </div>

                    <!-- Stats Section -->
                    <div class="stats-section">
                        <div class="stat-card">
                            <div class="stat-label">Total Orders</div>
                            <div class="stat-value" id="stat-total-orders">0</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Total Spent</div>
                            <div class="stat-value loyalty" id="stat-total-spent">$0.00</div>
                        </div>
                    </div>

                    <!-- Menu Items -->
                    <div class="menu-items">
                        <div class="menu-item">
                            <div class="menu-item-content">
                                <div class="menu-item-icon">
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z"/>
                                        <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z"/>
                                    </svg>
                                </div>
                                <span class="menu-item-text">Payment Methods</span>
                            </div>
                            <svg class="menu-item-arrow" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>

                        <div class="menu-item">
                            <div class="menu-item-content">
                                <div class="menu-item-icon">
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                    </svg>
                                </div>
                                <span class="menu-item-text">Saved Addresses</span>
                            </div>
                            <svg class="menu-item-arrow" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>

                        <div class="menu-item">
                            <div class="menu-item-content">
                                <div class="menu-item-icon">
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                    </svg>
                                </div>
                                <span class="menu-item-text">Preferences</span>
                            </div>
                            <svg class="menu-item-arrow" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="footer-text">
                        RestorApp Academic Simulation V1.0<br>
                        Performance monitoring active.
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ─── Función principal exportada ────────────────────────────────────────────
export async function profile() {
    // Obtener usuario de sesión; si no existe, redirigir al login
    const user = getUser();
    if (!user) {
        location.hash = "#/login";
        return "";
    }

    // Renderizar esqueleto inmediatamente con datos del usuario
    document.getElementById("app").innerHTML = getTemplate(user);

    // ─── Evento logout ──────────────────────────────────────────────────────
    document.getElementById("logout-btn").addEventListener("click", () => {
        clearUser();
        location.hash = "#/login";
    });

    // ─── Traer pedidos desde la API y procesar ─────────────────────────────
    try {
        const allOrders = await fetchOrders();

        // filter: solo los pedidos del usuario logueado
        const userOrders = allOrders.filter(order => order.userId === user.id);

        // some: verificar si tiene al menos un pedido activo (no entregado)
        const hasActiveOrders = userOrders.some(
            order => order.status === "pending" || order.status === "preparing" || order.status === "ready"
        );

        // every: verificar si todos sus pedidos tienen items válidos
        const allOrdersValid = userOrders.every(
            order => order.items && order.items.length > 0
        );

        // reduce: calcular total gastado solo en pedidos válidos
        const totalSpent = allOrdersValid
            ? userOrders.reduce((sum, order) => sum + order.total, 0)
            : 0;

        // ─── Actualizar estadísticas en el DOM ──────────────────────────────
        document.getElementById("stat-total-orders").textContent = userOrders.length;
        document.getElementById("stat-total-spent").textContent = `$${totalSpent.toFixed(2)}`;

        // ─── Renderizar cards de pedidos con map ────────────────────────────
        const ordersHTML = userOrders.length > 0
            ? userOrders.map(order => renderOrderCard(order)).join("")
            : `<p style="color:#888; padding:12px 0; text-align:center;">No orders yet. Head to the Menu to place your first order!</p>`;

        document.getElementById("orders-list").innerHTML = ordersHTML;

        // Log de debug
        console.log("[Profile] User orders:", userOrders.length, "| Active:", hasActiveOrders, "| All valid:", allOrdersValid, "| Total spent: $" + totalSpent.toFixed(2));

    } catch (error) {
        console.error("[Profile] Error fetching orders:", error);
        document.getElementById("orders-list").innerHTML =
            `<p style="color:#e74c3c; padding:12px 0; text-align:center;">Failed to load orders. Please try refreshing.</p>`;
    }

    // Retorna vacío porque ya se inyectó directamente en #app
    return "";
}