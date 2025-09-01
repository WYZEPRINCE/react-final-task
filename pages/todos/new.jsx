"use client";

import { useRouter } from "next/navigation"; // ✅ App Router
import TodoForm from "../../components/TodoForm";
import { createTodo } from "../../utils/helper";

export default function NewTodo() {
  const router = useRouter();

  async function handleCreate(newTodo) {
    try {
      // call API
      const saved = await createTodo(newTodo);

      // ✅ also sync with localStorage for instant UI update
      const local = JSON.parse(localStorage.getItem("todos") || "[]");
      localStorage.setItem("todos", JSON.stringify([saved, ...local]));

      // redirect home
      router.push("/");
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create todo. Please try again.");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Todo</h1>
      {/* ✅ no initialData means blank form */}
      <TodoForm onSubmit={handleCreate} />
    </main>
  );
}
