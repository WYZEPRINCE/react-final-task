"use client";
import { useState } from "react";
import TodoForm from "./TodoForm";

export default function TodoItem({ todo, onDelete, onUpdate = () => {} }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col bg-white shadow-sm rounded-2xl p-4 mb-2 hover:bg-gray-50 transition">
      {isEditing ? (
        <TodoForm
          initialData={todo}
          redirect={false}
          onSubmit={(updated) => {
            onUpdate(updated);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p
              className={`text-lg ${todo.completed ? "line-through text-gray-400" : ""}`}
            >
              {todo.content}
            </p>
            <div className="flex gap-2 ml-4">
              <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 font-bold">
                Edit
              </button>
              <button onClick={() => onDelete(todo.id)} className="text-red-500 hover:text-red-700 font-bold">
                Delete
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            📅 {todo.createdAt ? new Date(todo.createdAt).toLocaleDateString() : "No date"}
          </p>
        </>
      )}
    </div>
  );
}
