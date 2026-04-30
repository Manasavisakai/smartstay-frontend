"use client";

import { useState } from "react";
import Link from "next/link";
import { registerApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { login } = useAuth();
  const [role, setRole] = useState("resident");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    apartmentName: "",
    block: "",
    flatNumber: "",
    roleType: "Maintenance Staff",
    adminRole: "Finance Admin",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        phoneNumber: formData.phoneNumber || null,
        apartmentName: role === "resident" ? formData.apartmentName : null,
        block: role === "resident" ? formData.block : null,
        flatNumber: role === "resident" ? formData.flatNumber : null,
        roleType: role === "staff" ? formData.roleType : null,
        adminRole: role === "admin" ? formData.adminRole : null,
      };

      console.log("Submitting registration:", payload);
      const { access_token } = await registerApi(payload);
      console.log("Registration success");
      await login(access_token);
    } catch (err: any) {
      console.warn("Registration Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 border py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Join SmartStay</h1>
          <p className="text-gray-500">Create your account to manage properties.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          {["resident", "staff", "admin"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition ${
                role === tab ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setRole(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                required
                className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                required
                className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          {/* Dynamic Forms based on Role */}
          {role === "resident" && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Apartment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunrise"
                  className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.apartmentName}
                  onChange={(e) => setFormData({ ...formData, apartmentName: e.target.value })}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Block</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A"
                  className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Door No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101"
                  className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.flatNumber}
                  onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                />
              </div>
            </div>
          )}

          {role === "staff" && (
            <div className="col-span-2 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <label className="block text-sm font-medium text-gray-700">Staff Category</label>
              <select
                className="mt-1 w-full p-2 border rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                value={formData.roleType}
                onChange={(e) => setFormData({ ...formData, roleType: e.target.value })}
              >
                {[
                  "Maintenance Staff", "Electrician", "Plumber", "Security Guard", 
                  "Housekeeping", "Facility Manager", "Supervisor", "Parking Manager", "Lift Operator"
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          {role === "admin" && (
            <div className="col-span-2 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <label className="block text-sm font-medium text-gray-700">Admin Role</label>
              <select
                className="mt-1 w-full p-2 border rounded-xl bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.adminRole}
                onChange={(e) => setFormData({ ...formData, adminRole: e.target.value })}
              >
                {[
                  "Super Admin", "Finance Admin", "Operations Admin", "Security Admin", 
                  "Maintenance Admin", "Community Manager"
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Choose Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full p-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-2 px-4 text-white font-semibold rounded-xl transition duration-200 shadow-sm ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating account..." : `Create ${role} Account`}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
