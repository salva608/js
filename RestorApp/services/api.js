const BASE_URL = "http://localhost:3000";

// ===== USERS =====
export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
}

// ===== MENU =====
export async function fetchMenu() {
  const res = await fetch(`${BASE_URL}/menu`);
  return res.json();
}

// ===== ORDERS =====
export async function fetchOrders() {
  const res = await fetch(`${BASE_URL}/orders`);
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });

  return res.json();
}

export async function updateOrder(id, data) {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
