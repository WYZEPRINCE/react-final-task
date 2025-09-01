"use client";
import { useState, useEffect } from "react";

export default function TodoForm({ initialData, onSubmit }) {
  const [content, setContent] = useState(initialData?.content || "");
  const [completed, setCompleted] = useState(initialData?.completed || false);

  // keep form in sync when editing
  useEffect(() => {
    console.log("Form received new initialData:", initialData);
    if (initialData) {
      setContent(initialData.content || "");
      setCompleted(initialData.completed || false);
    }
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return alert("Todo cannot be empty");

    const payload = {
      ...initialData, // keep id and timestamps when editing
      content,
      completed,
    };

    onSubmit(payload);

    // reset form after submit (only when creating new)
    if (!initialData) {
      setContent("");
      setCompleted(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-2xl shadow-md space-y-4"
    >
      {/* Text input */}
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter todo..."
        className="w-full border rounded-xl p-2"
        required
      />

      {/* Checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        Completed
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-xl hover:bg-blue-600"
      >
        Save
      </button>
    </form>
  );
}
