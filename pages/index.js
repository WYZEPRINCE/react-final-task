'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TodoItem from "../pages/components/TodoItem";
import {
  fetchTodos as clientFetchTodos,
  updateTodo,
  deleteTodo,
} from "../pages/utils/helper";

export default function Home({ initialTodos = [] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // load client-side latest (merge server API + localStorage)
    async function load() {
      try {
        const api = await clientFetchTodos(); // fetch from /api/todos
        // local todos saved by the app (if any)
        const local = JSON.parse(localStorage.getItem("todos") || "[]");

        // merge: local ones first, then API (avoid duplicates by id)
        const byId = {};
        local.concat(api).forEach((t) => (byId[String(t.id)] = t));
        const merged = Object.values(byId);

        setTodos(merged);
      } catch (err) {
        console.error("Client fetch failed, falling back to SSR data:", err);
        setTodos((prev) => (prev.length ? prev : initialTodos));
      }
    }

    load();

    // Listen for storage events so adding in New page updates list instantly
    function onStorage(e) {
      if (e.key === "todos" || e.key === "newTodo") {
        const local = JSON.parse(localStorage.getItem("todos") || "[]");
        // merge again
        const byId = {};
        local.forEach((t) => (byId[String(t.id)] = t));
        // Remove todos dependency from this function to avoid infinite loop
        setTodos(currentTodos => {
          currentTodos.forEach((t) => (byId[String(t.id)] = t));
          return Object.values(byId);
        });
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [initialTodos]); // ✅ Removed 'todos' dependency to fix infinite loop

  async function handleDelete(id) {
    try {
      await deleteTodo(id); // call API
    } catch (e) {
      console.error("API delete failed (server)", e);
    }
    const updated = todos.filter((t) => String(t.id) !== String(id));
    setTodos(updated);
    // persist only local-created ones
    localStorage.setItem(
      "todos",
      JSON.stringify(updated.filter((t) => t.isLocal))
    );
  }

  async function handleUpdate(updatedTodo) {
    console.log("Updating todo:", updatedTodo); // Debug log
    
    try {
      // Call API to update on server (if not a local-only todo)
      if (!updatedTodo.isLocal) {
        await updateTodo(updatedTodo.id, updatedTodo);
      }
    } catch (e) {
      console.error("API update failed (server)", e);
    }

    // Update React state
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        String(todo.id) === String(updatedTodo.id) ? updatedTodo : todo
      )
    );

    // Update localStorage for local todos
    const localTodos = todos.filter(t => t.isLocal);
    const updatedLocalTodos = localTodos.map(todo =>
      String(todo.id) === String(updatedTodo.id) ? updatedTodo : todo
    );
    localStorage.setItem("todos", JSON.stringify(updatedLocalTodos));
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const incompleteCount = todos.filter((t) => !t.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (activeTab === "completed") return todo.completed;
    if (activeTab === "incomplete") return !todo.completed;
    return true;
  });

  return (
    <main className="flex min-h-screen">
      {/* Sidebar - md+ only */}
      <div
        className={`hidden md:flex flex-col w-64 bg-white shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <h2 className="text-xl font-bold p-4 border-b">Filters</h2>
        <nav className="flex flex-col p-2 gap-2">
          <button
            className={`flex justify-between items-center px-3 py-2 rounded-xl ${
              activeTab === "all"
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("all")}
          >
            <span>All</span>
            <span className="bg-gray-200 text-xs px-2 py-1 rounded-lg">
              {todos.length}
            </span>
          </button>
          <button
            className={`flex justify-between items-center px-3 py-2 rounded-xl ${
              activeTab === "completed"
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            <span>Completed</span>
            <span className="bg-gray-200 text-xs px-2 py-1 rounded-lg">
              {completedCount}
            </span>
          </button>
          <button
            className={`flex justify-between items-center px-3 py-2 rounded-xl ${
              activeTab === "incomplete"
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("incomplete")}
          >
            <span>Incomplete</span>
            <span className="bg-gray-200 text-xs px-2 py-1 rounded-lg">
              {incompleteCount}
            </span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Todos</h1>
          <div className="flex items-center gap-2">
            <button
              className="hidden md:block px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <Link
              href="/todos/new"
              className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-600"
            >
              + Add
            </Link>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex md:hidden justify-around bg-white rounded-xl shadow-sm mb-6">
          <button
            className={`flex-1 py-2 rounded-xl ${
              activeTab === "all" ? "bg-blue-500 text-white font-semibold" : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All ({todos.length})
          </button>
          <button
            className={`flex-1 py-2 rounded-xl ${
              activeTab === "completed"
                ? "bg-blue-500 text-white font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedCount})
          </button>
          <button
            className={`flex-1 py-2 rounded-xl ${
              activeTab === "incomplete"
                ? "bg-blue-500 text-white font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("incomplete")}
          >
            Incomplete ({incompleteCount})
          </button>
        </div>

        <div>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((t) => (
              <TodoItem
                key={t.id}
                todo={t}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No todos found.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  try {
    // For SSR, import server-side todos directly so the page renders on the server
    const { todos } = await import("../pages/lib/data/todos");
    return { props: { initialTodos: todos } };
  } catch (err) {
    return { props: { initialTodos: [] } };
  }
}