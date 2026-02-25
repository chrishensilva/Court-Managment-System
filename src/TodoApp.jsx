import { useEffect, useState } from "react";
import "./Todo.css";
import API_BASE_URL from "./config";
import { useToast } from "./ToastContext";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const { toast, confirm } = useToast();

  const addTodo = async () => {
    if (!task || !date || !time) {
      toast("Please fill in all task details.", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/addTodo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ task, date, time }),
      });

      const result = await res.json();
      if (result.status === "success") {
        const newTodo = { id: result.id, task, date, time };
        setTodos([newTodo, ...todos]);
        setTask("");
        setDate("");
        setTime("");
        toast("Note added to dashboard.", "success");
      }
    } catch (err) {
      console.error("Error adding todo:", err);
      toast("Failed to add note.", "error");
    }
  };

  const deleteTodo = async (id) => {
    const confirmed = await confirm("This note will be permanently removed from your dashboard.", "Delete Note?", "danger");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/deleteTodo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.status === "success") {
        setTodos(todos.filter((item) => item.id !== id));
        toast("Note removed.", "info");
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
      toast("Failed to delete note.", "error");
    }
  };


  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/getTodos`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTodos(data);
        }
      })
      .catch(err => console.error("Error fetching todos:", err));
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
