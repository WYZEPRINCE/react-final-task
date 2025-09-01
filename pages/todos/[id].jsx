"use client";
import TodoForm from "../components/TodoForm";
import { fetchTodo, updateTodo, deleteTodo } from "../utils/helper";
import Router from "next/router";

export default function TodoDetail({ todo: initialTodo }) {
  console.log(todo)
  if (!initialTodo) {
    return <p className="p-4 text-red-500">Todo not found</p>;
  }

  async function handleUpdate(updatedFields) {
  const updatedTodo = { ...initialTodo, ...updatedFields }; // keep everything

  try {
    // ✅ send full todo
    await updateTodo(initialTodo.id, { content, completed });

    // ✅ sync local storage
    const local = JSON.parse(localStorage.getItem("todos") || "[]");
    const newLocal = local.map((t) =>
      String(t.id) === String(updatedTodo.id) ? updatedTodo : t
    );
    localStorage.setItem("todos", JSON.stringify(newLocal));

    Router.push("/");
  } catch (err) {
    console.error("Update failed:", err);
  }
}


  async function handleDelete(id) {
    try {
      await deleteTodo(id);

      // remove from localStorage
      const local = JSON.parse(localStorage.getItem("todos") || "[]");
      localStorage.setItem(
        "todos",
        JSON.stringify(local.filter((t) => String(t.id) !== String(id)))
      );

      Router.push("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Todo</h1>
      <TodoForm initialData={initialTodo} onSubmit={handleUpdate} />
      <button
        onClick={() => handleDelete(initialTodo.id)}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete Todo
      </button>
    </main>
  );
}

// ✅ SSR fetch
export async function getServerSideProps({ params }) {
  try {
    const todo = await fetchTodo(params.id);
    return { props: { todo } };
  } catch {
    return { props: { todo: null } };
  }
}
