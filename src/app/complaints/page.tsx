"use client";

import { useState, useEffect } from "react";
import { fetchComplaints, createComplaint, updateComplaintStatus, deleteComplaint, payComplaint } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ComplaintsPage() {
  const { user, loading: authLoading } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComplaint({ ...formData, userId: user?.id || 1 });
      setFormData({ title: "", description: "" });
      loadComplaints();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await updateComplaintStatus(id, newStatus);
      loadComplaints();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await deleteComplaint(id);
      loadComplaints();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePay = async (complaintId: number) => {
    try {
      await payComplaint({ complaintId, amount: 50.0 }); // Hardcoded amount for now
      alert("Payment successful!");
      // Optionally reload complaints or fetch payments
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'resolved') return 'bg-green-100 text-green-700';
    if (status === 'in progress') return 'bg-blue-100 text-blue-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end pb-4 border-b">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Complaints Management
            </h1>
            <p className="text-gray-500 mt-2">Track and resolve community issues.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Create Complaint Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4">Submit Complaint</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken elevator"
                  className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide context about the issue..."
                  className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-sm"
              >
                Submit Issue
              </button>
            </form>
          </div>

          {/* Complaints List */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Active & Past Issues</h2>
            
            {loading ? (
              <p className="text-gray-500 animate-pulse">Loading complaints...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : complaints.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center py-12">
                <p className="text-gray-500 text-lg">No complaints found. Perfect!</p>
              </div>
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-bold text-lg text-gray-900">{c.title}</h3>
                       <span className={`px-2 py-0.5 text-xs rounded-full font-semibold uppercase tracking-wider ${getStatusColor(c.status)}`}>
                         {c.status}
                       </span>
                    </div>
                    <p className="text-gray-600 mb-2">{c.description}</p>
                    <p className="text-xs text-gray-400 font-medium">Submitted by User #{c.userId} • Ticket #{c.id}</p>
                  </div>
                  
                  {/* Status Toggles (For Admin/Staff) & Actions (For Resident) */}
                  <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                    {user?.role === "resident" ? (
                      <>
                        <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-2 border rounded-lg">Readonly Status</span>
                        {c.userId === user.id && (
                          <button 
                            onClick={() => handleDelete(c.id)}
                            className="text-sm px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition"
                          >
                            Delete
                          </button>
                        )}
                        {c.status === "resolved" && (
                          <button 
                            onClick={() => handlePay(c.id)}
                            className="text-sm px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm transition"
                          >
                            Pay Now
                          </button>
                        )}
                      </>
                    ) : (
                      <select 
                        value={c.status}
                        onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                        className="text-sm p-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="in progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
