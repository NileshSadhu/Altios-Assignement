import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt?: string;
  updatedAt?: string;
}

type StatusFilter = "all" | "pending" | "in-progress" | "completed";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function getAllTask(filter: StatusFilter) {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks", {
        params: filter === "all" ? {} : { status: filter },
      });

      setData(response.data.tasks);
    } catch (error) {
      console.log("Failed to fetch all tasks : ", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);

      await api.delete(`/tasks/${id}`);

      setData((prev) => prev.filter((task) => task._id !== id));
      setConfirmDeleteId(null);
      toast.success("Task deleted");
    } catch (error) {
      console.log("Failed to delete task : ", error);
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    getAllTask(statusFilter);
  }, [statusFilter]);

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">Dashboard</p>
          <p className="text-sm text-black">
            Welcome, {localStorage.getItem("username")}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/tasks/new")}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white sm:px-4"
          >
            Add Task
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 sm:px-4 hover:bg-black hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "pending", "in-progress", "completed"] as StatusFilter[]).map(
          (option) => (
            <button
              key={option}
              onClick={() => setStatusFilter(option)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                statusFilter === option
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {option === "all" ? "All" : option}
            </button>
          ),
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading tasks...</p>
      ) : data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="mb-3 text-gray-500">
            {statusFilter === "all"
              ? "No tasks yet."
              : `No ${statusFilter} tasks.`}
          </p>
          <button
            onClick={() => navigate("/tasks/new")}
            className="text-sm font-medium text-black"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((task) => (
            <div
              key={task._id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div
                onClick={() => navigate(`/tasks/${task._id}/edit`)}
                className="cursor-pointer"
              >
                <p className="font-medium">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-1 ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                {confirmDeleteId === task._id ? (
                  <>
                    <span className="self-center text-sm text-gray-500">
                      Delete this task?
                    </span>
                    <button
                      onClick={() => handleDelete(task._id)}
                      disabled={deletingId === task._id}
                      className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {deletingId === task._id ? "Deleting..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(task._id)}
                    className="rounded-lg border border-red-300 px-3 py-1 text-sm font-medium text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
