import { fetchOrders, updateOrder, fetchUsers } from "../services/api.js";

let allOrders = [];
let selectedOrder = null;
let users = [];

export function admin() {
    return `
    <div class="admin-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
        <div class="navbar-container">
            <a class="navbar-brand" href="#/menu">
                <div class="logo-triangle"></div>
                RestorApp Admin
            </a>
            <div class="nav-menu">
                <a class="nav-link" href="#/menu">Menu</a>
                <a class="nav-link active" href="#/admin">Dashboard</a>
                <a class="nav-link" href="#/profile">Profile</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="main-container">
        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon orders">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                        <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zm-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Total Orders</h3>
                    <div class="stat-value" id="totalOrders">0</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon pending">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584.531.531 0 0 0 .013-.012l.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354a.717.717 0 0 0-.012.012A6.973 6.973 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1h-3zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0z"/>
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Pending Orders</h3>
                    <div class="stat-value" id="pendingOrders">0</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon revenue">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                        <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/>
                    </svg>
                </div>
                <div class="stat-info">
                    <h3>Total Revenue</h3>
                    <div class="stat-value" id="totalRevenue">$0</div>
                </div>
            </div>
        </div>

        <div class="content-grid">
            <!-- Recent Orders Table -->
            <div class="orders-section">
                <div class="section-header">
                    <h2 class="section-title">Recent Orders</h2>
                    <div class="header-actions">
                        <select id="statusFilter" class="btn-filter">
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                <div class="orders-card">
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTableBody">
                            <tr>
                                <td colspan="5" class="text-center">Loading orders...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Order Details Sidebar -->
            <div class="details-section">
                <div class="order-details-card" id="orderDetails">
                    <div class="text-center" style="padding: 2rem; color: #6b7280;">
                        <p>Select an order to view details</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    `;
}

export async function adminLogic() {
    // Cargar datos
    allOrders = await fetchOrders();
    users = await fetchUsers();
    
    // Renderizar
    updateStats();
    renderOrdersTable(allOrders);
    
    // Event listeners
    setupFilters();
}

// ===== ESTADÍSTICAS =====
function updateStats() {
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

// ===== RENDERIZAR TABLA =====
function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No orders found</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(order => {
            const user = users.find(u => u.id === order.userId);
            const userName = user ? user.name : 'Unknown User';
            const date = new Date(order.createdAt);
            const formattedDate = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            return `
                <tr class="order-row" data-order-id="${order.id}">
                    <td class="order-id">#${order.id}</td>
                    <td>${userName}</td>
                    <td class="order-date">${formattedDate}</td>
                    <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
                    <td>$${order.total.toFixed(2)}</td>
                </tr>
            `;
        })
        .join('');
    
    // Event listeners para las filas
    document.querySelectorAll('.order-row').forEach(row => {
        row.addEventListener('click', () => {
            const orderId = parseInt(row.dataset.orderId);
            selectOrder(orderId);
        });
    });
}

// ===== SELECCIONAR ORDEN =====
function selectOrder(orderId) {
    selectedOrder = allOrders.find(o => o.id === orderId);
    if (!selectedOrder) return;
    
    // Actualizar clase activa
    document.querySelectorAll('.order-row').forEach(row => {
        row.classList.remove('active');
    });
    document.querySelector(`[data-order-id="${orderId}"]`).classList.add('active');
    
    renderOrderDetails(selectedOrder);
}

// ===== RENDERIZAR DETALLES =====
function renderOrderDetails(order) {
    const user = users.find(u => u.id === order.userId);
    const userName = user ? user.name : 'Unknown User';
    const userEmail = user ? user.email : 'N/A';
    
    const detailsCard = document.getElementById('orderDetails');
    
    detailsCard.innerHTML = `
        <div class="order-details-header">
            <span class="detail-label">Order Details</span>
            <span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span>
        </div>
        <div class="order-number">#${order.id}</div>

        <!-- Customer Info -->
        <div class="customer-info">
            <div class="customer-avatar">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
            </div>
            <div class="customer-details">
                <h4>Customer</h4>
                <div class="customer-name">${userName}</div>
                <div class="customer-contact">${userEmail}</div>
            </div>
        </div>

        <!-- Order Items -->
        <div class="items-section">
            <div class="items-label">Items</div>
            
            ${order.items.map(item => `
                <div class="order-item">
                    <div class="item-info">
                        <div>
                            <span class="item-quantity">${item.quantity}x</span>
                            <span class="item-name">${item.name}</span>
                        </div>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('')}
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${order.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (8%)</span>
                <span>$${order.tax.toFixed(2)}</span>
            </div>
            <div class="summary-total">
                <span>Total</span>
                <span>$${order.total.toFixed(2)}</span>
            </div>
        </div>

        <!-- Update Status -->
        <div class="update-status-section">
            <div class="update-label">Update Status</div>
            <select class="status-select" id="statusSelect">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            </select>
            <button class="btn-update" id="updateStatusBtn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                Update
            </button>
        </div>
    `;
    
    // Event listener para actualizar estado
    document.getElementById('updateStatusBtn').addEventListener('click', async () => {
        const newStatus = document.getElementById('statusSelect').value;
        await updateOrderStatus(order.id, newStatus);
    });
}

// ===== ACTUALIZAR ESTADO =====
async function updateOrderStatus(orderId, newStatus) {
    try {
        await updateOrder(orderId, { status: newStatus });
        
        // Actualizar localmente
        const order = allOrders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
        }
        
        // Re-renderizar
        updateStats();
        const currentFilter = document.getElementById('statusFilter').value;
        const filtered = currentFilter === 'all' 
            ? allOrders 
            : allOrders.filter(o => o.status === currentFilter);
        renderOrdersTable(filtered);
        
        if (selectedOrder && selectedOrder.id === orderId) {
            selectedOrder.status = newStatus;
            renderOrderDetails(selectedOrder);
        }
        
        alert('Order status updated successfully!');
    } catch (error) {
        alert('Error updating order status');
        console.error(error);
    }
}

// ===== FILTROS =====
function setupFilters() {
    const statusFilter = document.getElementById('statusFilter');
    
    statusFilter.addEventListener('change', (e) => {
        const status = e.target.value;
        
        const filtered = status === 'all' 
            ? allOrders 
            : allOrders.filter(o => o.status === status);
        
        renderOrdersTable(filtered);
    });
}

// ===== HELPERS =====
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}