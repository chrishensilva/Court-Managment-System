import { useEffect, useState } from "react";
import "./Todo.css";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = async () => {
    if (!task || !date || !time) return;

    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, date, time }),
    });

    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);

    setTask("");
    setDate("");
    setTime("");
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((item) => item.id !== id));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  return (
    <div className="todo-box">
      <h3>Notes</h3>

      <div className="input-area">
        <input
          type="text"
          placeholder="Work / Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <button onClick={addTodo}>Add</button>
      </div>
      <div className="task-list">
        <ul>
          {todos.map((item) => (
            <li key={item.id}>
              <span>
                <strong>{item.task}</strong> – {formatDate(item.date)} at{" "}
                {item.time.slice(0, 5)}
              </span>

              <button
                className="delete-btn"
                onClick={() => deleteTodo(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
