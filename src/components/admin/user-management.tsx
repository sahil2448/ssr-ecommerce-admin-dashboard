"use client";

import { useState } from "react";
import { useApiSWR } from "@/lib/swr";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  isActive: boolean;
  githubId?: string;
  createdAt: string;
}

export function UserManagement() {
  const { data: users, mutate } = useApiSWR<User[]>("/api/admin/users");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success("User created successfully");
      setFormData({ name: "", email: "", password: "", role: "viewer" });
      setShowForm(false);
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      toast.success("Role updated");
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;

    try {
      await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      toast.success("User deleted");
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Add User
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="p-4 border rounded-lg space-y-4 bg-muted/30">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="viewer">Viewer (Read-only)</option>
              <option value="editor">Editor (Create & Edit)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Create User
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-3 text-sm font-medium">Name</th>
              <th className="text-left p-3 text-sm font-medium">Email</th>
              <th className="text-left p-3 text-sm font-medium">Auth Method</th>
              <th className="text-left p-3 text-sm font-medium">Role</th>
              <th className="text-right p-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="border-b hover:bg-muted/30">
                <td className="p-3 text-sm font-medium">{user.name}</td>
                <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                <td className="p-3 text-sm">
                  <span className="px-2 py-1 rounded text-xs bg-muted">
                    {user.githubId ? "GitHub" : "Email/Password"}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                      user.role === "admin" ? "bg-red-100 text-red-700" :
                      user.role === "editor" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 hover:bg-destructive/10 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
