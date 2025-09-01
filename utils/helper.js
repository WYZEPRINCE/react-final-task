// utils/api.js
const isServer = typeof window === "undefined";

const API_BASE = isServer
  ? process.env.API_BASE_URL || "http://localhost:3000" // server-side
  : process.env.NEXT_PUBLIC_BASE_URL || ""; // client-side

async function handleRes(res) {
  if (!res.ok) {
    const text = await res.text();
    // console.error("API request failed:", res.url, res.status, text);
    // throw new Error(`API error ${res.status}: ${text}`);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchTodos() {
  const res = await fetch(`${API_BASE}/api/todos`, { cache: "no-store" });
  return handleRes(res);
}

export async function fetchTodo(id) {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, { cache: "no-store" });
  return handleRes(res);
}

export async function createTodo(data) {
  const res = await fetch(`${API_BASE}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}


export async function updateTodo(id, updatedTodo) {
  try {
    const res = await fetch(`${API_BASE}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });
    if (!res.ok) {
      // throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return handleRes(res);
  } catch (error) {
    console.error("Failed to update todo:", error);
  
  }
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: "DELETE",
  });
  return handleRes(res);
}
