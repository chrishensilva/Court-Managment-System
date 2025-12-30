import { useState } from "react";
import "./Todo.css";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (!task || !date || !time) return;

    const newTodo = {
      id: Date.now(),
      task,
      date,
      time,
    };

    setTodos([...todos, newTodo]);

    // Clear inputs
    setTask("");
    setDate("");
    setTime("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  return (
    <div className="todo-box">
      <h3>To Do List</h3>

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
                <strong>{item.task}</strong> – {item.date} at {item.time}
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
