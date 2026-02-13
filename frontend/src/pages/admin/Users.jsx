import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import {
  fetchUsers as fetchUsersFromFirebase,
  createUser as createUserFirebase,
  updateUser as updateUserFirebase,
  deleteUser as deleteUserFirebase,
} from "../../lib/firebaseService";

const UsersPage = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch users from Firebase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsersFromFirebase();
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (!editingId && !formData.password) {
      toast.error("Password is required for new users");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...formData };

      // Only include password if provided
      if (!payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await updateUserFirebase(editingId, payload);
        toast.success("User updated");
      } else {
        await createUserFirebase(payload);
        toast.success("User created");
      }

      setFormData({ name: "", email: "", password: "" });
      setEditingId(null);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, password: "" });
    setEditingId(user.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserFirebase(userId);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to delete user");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Users Management</h2>
          <p className="text-gray-400 mt-1">
            Manage admin users and permissions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 border rounded-lg bg-gray-900/50 border-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? "Edit User" : "Create New User"}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password {editingId && "(Leave blank to keep current)"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-lg disabled:opacity-50 transition"
              >
                <Check className="w-5 h-5" />
                {editingId ? "Update User" : "Create User"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="border rounded-lg bg-gray-900/50 border-gray-800/50 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50 bg-gray-800/30">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/20 transition"
                  >
                    <td className="px-6 py-4 text-white">{user.name}</td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
