import { todos } from "@/lib/data/todos";

export default function handler(req, res) {
  const { id } = req.query;

  const todoIndex = todos.findIndex((t) => String(t.id) === String(id));

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (req.method === "PUT") {
    const { content, completed } = req.body;

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...(content !== undefined && { content }),
      ...(completed !== undefined && { completed }),
    };

    return res.status(200).json(todos[todoIndex]);
  }

  if (req.method === "DELETE") {
    // Delete todo
    const index = todos.findIndex((t) => String(t.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const deletedTodo = todos.splice(index, 1)[0];
    return res.status(200).json({ message: "Todo deleted", todo: deletedTodo });
  }
}
