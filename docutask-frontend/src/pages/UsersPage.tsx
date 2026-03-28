import { useEffect, useState } from "react";
import api from "../api/axios";
import { Pencil, Trash2, UserPlus, X } from "lucide-react";

type User = {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  role: string;
};

const emptyForm: User = {
  fullName: "",
  email: "",
  password: "",
  role: "ADMIN",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>(emptyForm);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingUserId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        await api.put(`/users/${editingUserId}`, form);
      } else {
        await api.post("/users", form);
      }

      resetForm();
      loadUsers();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditingUserId(user.id || null);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);
      if (editingUserId === id) {
        resetForm();
      }
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage system users and roles
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1E3A5F]">
            {editingUserId ? "Edit User" : "Add New User"}
          </h2>

          {editingUserId && (
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
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder={editingUserId ? "Enter new password" : "Password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required={!editingUserId}
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>

          <button
            type="submit"
            className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] py-2 text-white font-medium transition hover:bg-blue-700"
          >
            <UserPlus size={18} />
            {editingUserId ? "Update User" : "Add User"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E3A5F]">
          User List
        </h2>

        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No users found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-slate-200 p-4 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{u.fullName}</h3>
                    <p className="text-sm text-slate-500 break-all">{u.email}</p>
                  </div>

                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                    {u.role}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u.id)}
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