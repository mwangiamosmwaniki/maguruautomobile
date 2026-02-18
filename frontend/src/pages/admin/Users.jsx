import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/AuthContext";
import {
  fetchUsers as fetchUsersFromFirebase,
  createUser as createUserFirebase,
  updateUser as updateUserFirebase,
  deleteUser as deleteUserFirebase,
} from "../../lib/firebaseService";

const css = `
  .usr-delete-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.78);
    z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 20px;
    animation: usrFadeIn 0.2s ease;
  }
  @keyframes usrFadeIn { from { opacity: 0; } to { opacity: 1; } }

  .usr-delete-modal {
    background: #141720;
    border: 1px solid rgba(232,23,75,0.15);
    border-radius: 22px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(232,23,75,0.06);
    animation: usrModalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
  }
  @keyframes usrModalIn {
    from { transform: scale(0.82) translateY(24px); opacity: 0; }
    to   { transform: scale(1)    translateY(0);    opacity: 1; }
  }

  .usr-delete-strip {
    height: 3px;
    background: linear-gradient(90deg, #e8174b 0%, #ff6b35 40%, #e8174b 80%, #ff6b35 100%);
    background-size: 300% 100%;
    animation: usrStripShimmer 3s linear infinite;
  }
  @keyframes usrStripShimmer {
    from { background-position: 100% 0; }
    to   { background-position: -100% 0; }
  }

  .usr-delete-body { padding: 36px 28px 28px; text-align: center; }

  .usr-delete-icon-wrap { position: relative; width: 80px; height: 80px; margin: 0 auto 22px; }
  .usr-delete-ripple {
    position: absolute; inset: -12px; border-radius: 50%;
    background: rgba(232,23,75,0.08);
    animation: usrRipple 2.5s ease-in-out infinite;
  }
  .usr-delete-ripple:nth-child(2) { inset: -4px; animation-delay: 0.4s; background: rgba(232,23,75,0.12); }
  @keyframes usrRipple {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.12); opacity: 0.5; }
  }
  .usr-delete-icon-ring {
    position: relative; z-index: 1;
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(232,23,75,0.15) 0%, rgba(232,23,75,0.05) 100%);
    border: 1.5px solid rgba(232,23,75,0.3);
    display: flex; align-items: center; justify-content: center;
    color: #e8174b;
  }

  .usr-delete-title {
    font-size: 22px; font-weight: 700;
    color: #fff; margin-bottom: 8px; letter-spacing: 0.5px;
  }
  .usr-delete-subtitle { font-size: 13px; color: #666; line-height: 1.6; }

  .usr-delete-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(232,23,75,0.07);
    border: 1px solid rgba(232,23,75,0.18);
    border-radius: 100px; padding: 7px 16px;
    font-size: 13px; font-weight: 600; color: #e8174b;
    margin: 14px 0; max-width: 100%;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .usr-delete-warning {
    display: flex; align-items: flex-start; gap: 10px;
    background: rgba(232,163,23,0.05);
    border: 1px solid rgba(232,163,23,0.12);
    border-radius: 12px; padding: 12px 14px;
    margin: 16px 0 24px; text-align: left;
  }
  .usr-delete-warning svg { color: #e8a317; flex-shrink: 0; margin-top: 1px; }
  .usr-delete-warning span { font-size: 12px; color: #887766; line-height: 1.5; }

  .usr-delete-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .usr-delete-cancel {
    padding: 13px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; color: #777;
    font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .usr-delete-cancel:hover { background: rgba(255,255,255,0.08); color: #bbb; }

  .usr-delete-confirm {
    padding: 13px; background: #e8174b;
    border: none; border-radius: 12px;
    color: #fff; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    position: relative; overflow: hidden;
  }
  .usr-delete-confirm::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 100%);
    pointer-events: none;
  }
  .usr-delete-confirm:hover { background: #c8103f; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(232,23,75,0.45); }
  .usr-delete-confirm:active { transform: translateY(0); box-shadow: none; }

  @media (max-width: 480px) {
    .usr-delete-actions { grid-template-columns: 1fr; }
    .usr-delete-modal { border-radius: 16px; }
  }
`;

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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
      if (!payload.password) delete payload.password;

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

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, password: "" });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteUserFirebase(confirmDeleteId);
      toast.success("User deleted");
      setConfirmDeleteId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to delete user");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const userToDelete = users.find((u) => u.id === confirmDeleteId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>

      {/* ── Delete Confirmation Modal ── */}
      {confirmDeleteId && (
        <div
          className="usr-delete-overlay"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="usr-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="usr-delete-strip" />
            <div className="usr-delete-body">
              <div className="usr-delete-icon-wrap">
                <div className="usr-delete-ripple" />
                <div className="usr-delete-ripple" />
                <div className="usr-delete-icon-ring">
                  <Trash2 size={28} />
                </div>
              </div>

              <div className="usr-delete-title">Delete User</div>
              <div className="usr-delete-subtitle">
                You're about to permanently remove
              </div>

              <div className="usr-delete-pill">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                {userToDelete?.name || "this user"} — {userToDelete?.email}
              </div>

              <div className="usr-delete-warning">
                <AlertTriangle size={15} />
                <span>
                  This action is irreversible. The user will lose all access to
                  the admin dashboard immediately.
                </span>
              </div>

              <div className="usr-delete-actions">
                <button
                  className="usr-delete-cancel"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Keep User
                </button>
                <button className="usr-delete-confirm" onClick={handleDelete}>
                  <Trash2 size={14} />
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Users Management</h2>
            <p className="mt-1 text-gray-400">
              Manage admin users and permissions
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 text-white transition rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
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
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Admin"
                    className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@maguruautomobile.com"
                    className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Password {editingId && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-2 text-white placeholder-gray-500 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  {editingId ? "Update User" : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 text-gray-300 transition border border-gray-700 rounded-lg hover:border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-hidden border rounded-lg bg-gray-900/50 border-gray-800/50">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800/50 bg-gray-800/30">
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-left text-gray-300">
                      Created
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-right text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition border-b border-gray-800/50 hover:bg-gray-800/20"
                    >
                      <td className="px-6 py-4 text-white">{user.name}</td>
                      <td className="px-6 py-4 text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {user.createdAt?.toDate
                          ? user.createdAt.toDate().toLocaleDateString()
                          : user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-400 transition rounded-lg hover:bg-blue-500/10"
                            title="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(user.id)}
                            className="p-2 text-red-400 transition rounded-lg hover:bg-red-500/10"
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
    </>
  );
};

export default UsersPage;
