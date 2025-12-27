import { useEffect, useState } from "react";

const HOURS_24 = 24 * 60 * 60 * 1000;
const HOURS_48 = 48 * 60 * 60 * 1000;

export default function App() {
  const [input, setInput] = useState(() => "");
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });

  // ✅ CLEANUP LOGIC (PURE FUNCTION)
  const cleanupTodos = (list) => {
    const now = Date.now();

    return list
      .map((todo) => {
        const age = now - todo.createdAt;

        if (todo.status === "incomplete" && age >= HOURS_24) {
          return { ...todo, status: "pending" };
        }

        return todo;
      })
      .filter((todo) => {
        const age = now - todo.createdAt;

        if (todo.status === "complete" && age >= HOURS_24) return false;
        if (todo.status === "pending" && age >= HOURS_48) return false;

        return true;
      });
  };

  // ✅ Run cleanup every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTodos((prev) => cleanupTodos(prev));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);



  const addTodo = () => {
    if (!input.trim()) return;

    setTodos([
      {
        work: input,
        status: "incomplete",
        createdAt: Date.now(),
      },
      ...todos,
    ]);

    setInput("");
  };

  const markComplete = (index) => {
    const updated = [...todos];
    updated[index].status = "complete";
    setTodos(updated);
  };



  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-600 to-indigo-400 flex justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          📝 My Tasks
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-5">
          <input
            className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="What do you need to do?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl active:scale-95 transition"
          >
            Add
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {todos.map((todo, index) => (
            <div
              key={index}
              className="flex items-start justify-between bg-gray-50 rounded-xl p-4 shadow-sm"
            >
              <div>
                <p
                  className={`text-sm font-medium ${todo.status === "complete"
                      ? "line-through text-green-600"
                      : "text-gray-800"
                    }`}
                >
                  {todo.work}
                </p>

                <span
                  className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${todo.status === "complete"
                      ? "bg-green-100 text-green-700"
                      : todo.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {todo.status}
                </span>
              </div>

              {todo.status !== "complete" && (
                <button
                  onClick={() => markComplete(index)}
                  className="text-xs cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg active:scale-95 transition"
                >
                  Done
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <p className="text-center text-black/90 mt-8 text-sm">
            🎉 No tasks left!
          </p>
        )}
      </div>
    </div>
  );
}
