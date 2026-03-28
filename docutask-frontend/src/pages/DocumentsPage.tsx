import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FileText,
  Pencil,
  Trash2,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";

type DocumentItem = {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  fileUrl: string;
  ownerId: number;
  status: string;
};

const emptyForm: DocumentItem = {
  title: "",
  description: "",
  category: "",
  tags: [],
  fileUrl: "",
  ownerId: 1,
  status: "ACTIVE",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [form, setForm] = useState<DocumentItem>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setTagsInput("");
    setEditingDocumentId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };

    try {
      if (editingDocumentId) {
        await api.put(`/documents/${editingDocumentId}`, payload);
      } else {
        await api.post("/documents", payload);
      }

      resetForm();
      loadDocuments();
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  const handleEdit = (doc: DocumentItem) => {
    setForm({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      tags: doc.tags || [],
      fileUrl: doc.fileUrl,
      ownerId: doc.ownerId,
      status: doc.status,
    });

    setTagsInput((doc.tags || []).join(", "));
    setEditingDocumentId(doc.id || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/documents/${id}`);
      if (editingDocumentId === id) {
        resetForm();
      }
      loadDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Documents</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage uploaded documents, categories, and status
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1E3A5F]">
            {editingDocumentId ? "Edit Document" : "Add New Document"}
          </h2>

          {editingDocumentId && (
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
            placeholder="Document Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
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
            type="text"
            placeholder="Tags (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="url"
            placeholder="File URL"
            value={form.fileUrl}
            onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            placeholder="Owner ID"
            value={form.ownerId}
            onChange={(e) =>
              setForm({ ...form, ownerId: Number(e.target.value) })
            }
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
            <option value="PENDING">PENDING</option>
          </select>

          <button
            type="submit"
            className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] py-2 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            {editingDocumentId ? "Update Document" : "Add Document"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#1E3A5F]">
          Document List
        </h2>

        {documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No documents found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">{d.title}</h3>
                      <p className="text-sm text-slate-500">{d.category}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      d.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : d.status === "ARCHIVED"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>

                <p className="mb-3 line-clamp-3 text-sm text-slate-600">
                  {d.description}
                </p>

                <p className="mb-3 text-xs text-slate-500">
                  Owner ID: <span className="font-medium">{d.ownerId}</span>
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {(d.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                  >
                    <ExternalLink size={16} />
                    Open File
                  </a>

                  <button
                    onClick={() => handleEdit(d)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
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