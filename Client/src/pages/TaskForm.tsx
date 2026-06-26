import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import toast from "react-hot-toast";

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(
    "pending",
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function getTaskById() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/tasks/${id}`);
      const task = response.data.task;

      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
      setPriority(task.priority);
      toast.success(isEditMode ? "Task updated" : "Task created");
    } catch (error) {
      console.log("Failed to fetch task : ", error);
      setError("Failed to load task.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const payload = { title, description, status, priority };

      if (isEditMode) {
        await api.put(`/tasks/${id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      navigate("/");
    } catch (error) {
      console.log("Failed to save task : ", error);

      let message: string | undefined;

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message;
      }

      toast.error(message ?? "Failed to save task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (isEditMode) {
      getTaskById();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md p-6">
        <p className="text-gray-500">Loading task...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-6 text-2xl font-bold">
        {isEditMode ? "Edit Task" : "Create Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Status</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as "pending" | "in-progress" | "completed",
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : isEditMode
                ? "Update Task"
                : "Create Task"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
