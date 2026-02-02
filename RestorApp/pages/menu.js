import { fetchMenu, createOrder } from "../services/api.js";
import { getUser } from "../services/storage.js";

// Estado del carrito
let cart = [];
let allProducts = [];
let filteredProducts = [];

export function menu() {
  const user = getUser();
  const secondLink = user && user.role === 'admin' 
    ? `<a href="#/admin" class="nav-link">Admin</a>`
    : `<a href="#/profile" class="nav-link">Profile</a>`;

  return `
    <div class="menu-wrapper">
        <!-- Navbar -->
        <nav class="navbar">
            <div class="navbar-container">
                <a href="#/menu" class="navbar-brand">
                    <svg class="logo-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87-.91-7-5.05-7-9V8.31l7-3.89 7 3.89V11c0 3.95-3.13 8.09-7 9z"/>
                        <path d="M8 12l-2-2-1.41 1.41L8 14.83l8-8L14.59 5.42z"/>
                    </svg>
                    RestorApp
                </a>
                <div class="nav-links">
                    <a href="#/menu" class="nav-link">Menu</a>
                    ${secondLink}
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="main-container">
            <h1 class="page-title">Menu</h1>

            <!-- Search Bar -->
            <div class="search-container">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <input type="text" id="searchInput" class="search-input" placeholder="Search menu...">
            </div>

            <!-- Filter Buttons -->
            <div class="filter-buttons">
                <button class="filter-btn active" data-category="All">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    All
                </button>
                <button class="filter-btn" data-category="Burgers">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    Burgers
                </button>
                <button class="filter-btn" data-category="Pizza">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                    </svg>
                    Pizza
                </button>
                <button class="filter-btn" data-category="Drinks">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                    </svg>
                    Drinks
                </button>
                <button class="filter-btn" data-category="Sides">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8.5 5a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V9a.5.5 0 0 0 1 0V7.5H10a.5.5 0 0 0 0-1H8.5V5z"/>
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
                    </svg>
                    Sides
                </button>
                <button class="filter-btn" data-category="Desserts">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M7.5 1.018a7 7 0 0 0-4.79 11.566L7.5 7.793V1.018zm1 0v6.775l4.79 4.79A7 7 0 0 0 8.5 1.018z"/>
                        <path d="M4.985 12.522c.059.042.118.082.178.122.131.086.268.167.407.246.285.162.577.312.875.448l.01.005.658.256a7.001 7.001 0 0 0 3.743 0l.658-.256.01-.005c.298-.136.59-.286.875-.448.14-.08.276-.16.407-.246.06-.04.119-.08.178-.122.902-.652 1.683-1.433 2.335-2.335a7.013 7.013 0 0 0 1.823-4.67c0-.054-.003-.107-.004-.161V5.1a7.012 7.012 0 0 0-1.823-4.67 7.001 7.001 0 0 0-2.335-2.335A7.012 7.012 0 0 0 8.004 0h-.008a7.012 7.012 0 0 0-4.67 1.823A7.001 7.001 0 0 0 .991 4.158 7.012 7.012 0 0 0 0 8.828c0 .054.003.107.004.161V9a7.012 7.012 0 0 0 1.823 4.67 7.001 7.001 0 0 0 2.335 2.335l.002.001.001.001z"/>
                    </svg>
                    Desserts
                </button>
            </div>

            <div class="content-grid">
                <!-- Product Grid -->
                <div class="products-section">
                    <div id="productsGrid" class="products-grid">
                        <!-- Products will be rendered here -->
                    </div>
                </div>

                <!-- Order Sidebar -->
                <div class="order-sidebar">
                    <div class="order-header">
                        <div class="order-title">
                            Your Order
                            <span id="cartBadge" class="order-badge">0</span>
                        </div>
                        <a href="#" id="clearAllBtn" class="clear-all-btn">Clear all</a>
                    </div>

                    <!-- Order Items -->
                    <div id="orderItems" class="order-items">
                        <p class="text-muted text-center">Your cart is empty</p>
                    </div>

                    <!-- Order Summary -->
                    <div id="orderSummary" class="order-summary" style="display: none;">
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span id="subtotal">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (8%)</span>
                            <span id="tax">$0.00</span>
                        </div>
                        <div class="summary-total">
                            <span>Total</span>
                            <span id="total" class="total-amount">$0.00</span>
                        </div>
                        <button id="confirmBtn" class="confirm-btn">
                            Confirm Order
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
}

/**
 * Función principal que inicializa la página de menú
 * - Carga todos los productos desde la API
 * - Renderiza los productos inicialmente
 * - Configura los event listeners para filtros, búsqueda y carrito
 */
export async function menuLogic() {
  // CARGA DE DATOS: Obtener todos los productos de la API
  allProducts = await fetchMenu();
  // Inicialmente, mostrar todos los productos (sin filtro)
  filteredProducts = [...allProducts];
  renderProducts(filteredProducts);

  // CONFIGURACIÓN DE INTERACTIVIDAD
  setupFilters();   // Activar botones de categoría
  setupSearch();    // Activar barra de búsqueda
  setupCart();      // Activar carrito y confirmación
}

/**
 * Renderiza la grilla de productos en el DOM
 * - Recibe un array de productos a mostrar (puede estar filtrado)
 * - Convierte cada producto a una card visual
 * - Añade event listeners a botones de "Add to order"
 * - Si no hay productos, muestra mensaje de "No products found"
 */
function renderProducts(products) {
  const grid = document.getElementById("productsGrid");

  // VALIDACIÓN: Si no hay productos (resultado de filtro vacío)
  if (products.length === 0) {
    grid.innerHTML = `<p class="text-muted">No products found</p>`;
    return;
  }

  // RENDERIZADO: Convertir array de productos a HTML de cards
  grid.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <span class="product-category">${product.category.toUpperCase()}</span>
        </div>
        <div class="product-body">
            <div class="product-header">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-price">$${product.price.toFixed(2)}</span>
            </div>
            <p class="product-description">${product.description}</p>
            <button class="add-to-order-btn" data-id="${product.id}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                Add to order
            </button>
        </div>
    </div>
  `
    )
    .join("");

  // EVENT LISTENERS: Añadir clic a cada botón "Add to order"
  document.querySelectorAll(".add-to-order-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = parseInt(btn.dataset.id);
      addToCart(productId);  // Añadir producto al carrito
    });
  });
}

/**
 * Configura los botones de filtro por categoría
 * - Cuando se hace clic en un botón, actualiza el estado visual (active)
 * - Filtra los productos según la categoría seleccionada
 * - Si es "All", muestra todos los productos
 * - Re-renderiza la grilla con los productos filtrados
 */
function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // ESTADO VISUAL: Remover clase 'active' de todos los botones
      filterButtons.forEach((b) => b.classList.remove("active"));
      // ESTADO VISUAL: Añadir clase 'active' solo al botón clickeado
      btn.classList.add("active");

      // LÓGICA DE FILTRO
      const category = btn.dataset.category;

      if (category === "All") {
        // Mostrar todos los productos
        filteredProducts = [...allProducts];
      } else {
 **
 * Configura la barra de búsqueda para filtrar por nombre de producto
 * - Cada vez que el usuario escribe en la barra de búsqueda
 * - Filtra productos cuyo nombre contenga el texto (case-insensitive)
 * - Re-renderiza la grilla con los resultados
 */
function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();  // Obtener texto de búsqueda en minúsculas

    // FILTRO: Mostrar solo productos cuyo nombre incluya el texto de búsqueda
    filteredProducts = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query)
    );

    // Re-dibujar grilla con resultados de búsqueda// ===== BÚSQUEDA =====
function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    filteredProducts = allProducts.filter((p) =>
 **
 * Configura los eventos del carrito (limpiar y confirmar orden)
 * Botón "Clear all": Vacía el carrito
 * Botón "Confirm Order": Envía la orden al servidor, guarda en BD y redirige
 */
function setupCart() {
  const clearAllBtn = document.getElementById("clearAllBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  // EVENTO 1: Botón "Clear all" - Vaciar carrito
  clearAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cart = [];              // Vaciar array
    renderCart();           // Actualizar interfaz
  });

  // EVENTO 2: Botón "Confirm Order" - Crear orden
  confirmBtn.addEventListener("click", async () => {
    if (cart.length === 0) return;  // No permitir orden vacía

    // OBTENER DATOS NECESARIOS
    const user = getUser();                  // Usuario actual de la sesión
    const subtotal = calculateSubtotal();    // Suma de todos los items
    const tax = subtotal * 0.08;             // Impuesto 8%
    const total = subtotal + tax;            // Total final

    // CONSTRUIR OBJETO DE ORDEN
    const order = {
      userId: user.id,                       // ID del usuario que ordena
      items: cart,                           // Array de items del carrito
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: "pending",                     // Estado inicial: pendiente
      createdAt: new Date().toISOString(),   // Fecha y hora de creación
    };

    try {
      // ENVIAR ORDEN AL SERVIDOR
      await createOrder(order);
      
      // FEEDBACK AL USUARIO
/**
 * Añade un producto al carrito o aumenta su cantidad si ya existe
 * - Si el producto ya está en el carrito: incrementar cantidad
 * - Si es nuevo: crear item en el carrito
 * - Actualizar la interfaz del carrito
 */
function addToCart(productId) {
  // Encontrar el producto en el array de todos los productos
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;  // Si no existe, salir

  // Verificar si el producto ya está en el carrito
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    // Si ya existe: solo incrementar cantidad
    existingItem.quantity += 1;
  } else {
    // Si es nuevo: crear item completo
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  // Actualizar la interfaz del carrito      alert("Error creating order");
      console.error(error);
    }
  });
}

function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  renderCart();
}

/**
 * Elimina un producto completamente del carrito
 */
function removeFromCart(productId) {
  // Filtrar: mantener solo items que NO sean de este producto
  cart = cart.filter((item) => item.productId !== productId);
  // Actualizar interfaz
  renderCart();
}

/**
 * Modifica la cantidad de un producto en el carrito
 * - change: número positivo o negativo para sumar/restar
 * - Si cantidad llega a 0 o menos, eliminar producto
 * - Si es válido, actualizar cantidad
 */
function updateQuantity(productId, change) {
  // Encontrar item en el carrito
  const item = cart.find((item) => item.productId === productId);
  if (!item) return;  // Si no existe, salir

  // Modificar cantidad
  item.quantity += change;

  // Si cantidad es 0 o menos, eliminar del carrito
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    // Si es válido, actualizar interfaz
    renderCart();
  }
}

/**
 * Renderiza todos los items del carrito en la interfaz
 * - Actualiza el badge con cantidad total de items
 * - Muestra mensaje si el carrito está vacío
 * - Renderiza cada item con controls (+ - Remove)
 * - Añade event listeners para botones
 * - Actualiza el resumen de precios
 */
function renderCart() {
  const orderItems = document.getElementById("orderItems");
  const cartBadge = document.getElementById("cartBadge");
  const orderSummary = document.getElementById("orderSummary");

  // ACTUALIZAR BADGE: Contar total de items (por cantidad)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;

  // VALIDACIÓN: Si carrito está vacío
  if (cart.length === 0) {
    orderItems.innerHTML = `<p class="text-muted text-center">Your cart is empty</p>`;
    orderSummary.style.display = "none";
    return;
  }

  // RENDERIZADO: Convertir cada item del carrito a HTML
  orderItems.innerHTML = cart
    .map(
      (item) => `
    <div class="order-item">
        <img src="${item.image}" alt="${item.name}" class="order-item-image">
        <div class="order-item-details">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-controls">
                <button class="quantity-btn" data-id="${item.productId}" data-action="decrease">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.productId}" data-action="increase">+</button>
                <a href="#" class="remove-btn" data-id="${item.productId}">Remove</a>
            </div>
        </div>
        <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `
    )
    .join("");

  // EVENT LISTENERS: Botones de aumentar/disminuir cantidad
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      // Si es "increase": +1, si es "decrease": -1
      updateQuantity(productId, action === "increase" ? 1 : -1);
    });
  });

  // EVENT LISTENERS: Botones de remover item
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = parseInt(btn.dataset.id);
      removeFromCart(productId);
    });
  });

  // ACTUALIZAR RESUMEN: Calcular y mostrar totales
  updateSummary();
  orderSummary.style.display = "block";
}

/**
 * Calcula el subtotal (suma de todos items: precio × cantidad)
 * Devuelve la suma total sin impuestos
 */
function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Actualiza los valores de subtotal, impuesto y total en el DOM
 * Cálculos:
 * - Subtotal: suma de precios
 * - Tax: subtotal × 0.08 (8%)
 * - Total: subtotal + tax
 */
function updateSummary() {
  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08;      // Aplicar 8% de impuesto
  const total = subtotal + tax;     // Sumar subtotal + impuesto

  // Inyectar valores en el DOM
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}