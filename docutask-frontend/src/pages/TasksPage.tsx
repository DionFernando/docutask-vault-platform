import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  ClipboardList,
  Pencil,
  Trash2,
  Plus,
  X,
  CalendarDays,
} from "lucide-react";

type Task = {
  id?: number;
  title: string;
  description: string;
  documentId: string;
  assignedUserId: number;
  status: string;
  priority: string;
  dueDate: string;
};

const emptyForm: Task = {
  title: "",
  description: "",
  documentId: "",
  assignedUserId: 1,
  status: "TODO",
  priority: "HIGH",
  dueDate: "",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<Task>(emptyForm);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingTaskId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, form);
      } else {
        await api.post("/tasks", form);
      }

      resetForm();
      loadTasks();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setForm({
      title: task.title,
      description: task.description,
      documentId: task.documentId,
      assignedUserId: task.assignedUserId,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setEditingTaskId(task.id || null);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${id}`);
      if (editingTaskId === id) {
        resetForm();
      }
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-200 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Tasks</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage task assignments, priority levels, and due dates
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1E3A5F]">
            {editingTaskId ? "Edit Task" : "Add New Task"}
          </h2>

          {editingTaskId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X size={16} />
              Cancel Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Task Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            placeholder="Document ID"
            value={form.documentId}
            onChange={(e) => setForm({ ...form, documentId: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="min-h-[110px] rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
            required
          />

          <input
            type="number"
            placeholder="Assigned User ID"
            value={form.assignedUserId}
            onChange={(e) =>
              setForm({ ...form, assignedUserId: Number(e.target.value) })
            }
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>

          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] py-2 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E3A5F]">
          Task List
        </h2>

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No tasks found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                      <ClipboardList size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">{t.title}</h3>
                      <p className="text-sm text-slate-500">
                        Document ID: {t.documentId}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mb-3 text-sm text-slate-600">{t.description}</p>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                      t.priority
                    )}`}
                  >
                    {t.priority}
                  </span>
                </div>

                <p className="mb-2 text-xs text-slate-500">
                  Assigned User ID:{" "}
                  <span className="font-medium">{t.assignedUserId}</span>
                </p>

                <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays size={14} />
                  <span>
                    Due Date:{" "}
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}