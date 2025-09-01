import { todos } from "@/lib/data/todos";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const newTodo = {
      id: String(Date.now()),
      content,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.unshift(newTodo);
    return res.status(201).json(newTodo);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
