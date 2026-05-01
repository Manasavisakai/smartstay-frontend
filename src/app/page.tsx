"use client";

import { useAuth } from "@/context/AuthContext";
import { fetchUsers, deleteUser, fetchPayments } from "@/lib/api";
import AIBox from "./AIBox";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [fetchingPayments, setFetchingPayments] = useState(false);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "staff")) {
      loadUsers();
    }
    if (user && user.role === "admin" && user.adminRole === "Finance Admin") {
      loadPayments();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      setFetchingUsers(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const loadPayments = async () => {
    try {
      setFetchingPayments(true);
      const data = await fetchPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingPayments(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8"><p>Loading dashboard...</p></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end pb-4 border-b">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 capitalize">
              {user.role} Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Welcome back, {user.name}!</p>
          </div>
        </header>

        {user.role === "resident" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome Home</h2>
            <p className="text-gray-600 mb-6">Manage your property details and report any issues directly to staff.</p>
            <a href="/complaints" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
              Report an Issue
            </a>
          </div>
        )}

        {user.role === "manager" || user.role === "staff" || user.role === "admin" ? (
          <div>
            <h2 className="text-xl font-bold mb-4">System Users (Admin/Staff View)</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {fetchingUsers ? (
                <p>Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-xl">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        {user.role === "admin" && <th className="px-4 py-3 rounded-tr-xl text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 font-medium text-gray-900">{u.name}</td>
                          <td className="px-4 py-4">{u.email}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100">{u.role}</span>
                          </td>
                          {user.role === "admin" && (
                            <td className="px-4 py-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-500 hover:text-red-700 font-medium transition"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {user.role === "admin" && user.adminRole === "Finance Admin" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Transactions (Finance Admin)</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {fetchingPayments ? (
                <p>Loading payments...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-xl">Payment ID</th>
                        <th className="px-4 py-3">Complaint ID</th>
                        <th className="px-4 py-3">User ID</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 rounded-tr-xl">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4 font-medium text-gray-900">#{p.id}</td>
                          <td className="px-4 py-4">#{p.complaintId}</td>
                          <td className="px-4 py-4">User #{p.userId}</td>
                          <td className="px-4 py-4 font-semibold text-green-600">${p.amount.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700 capitalize">{p.status}</span>
                          </td>
                          <td className="px-4 py-4">{new Date(p.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        <AIBox />
      </div>
    </div>

  );
}
