"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogOut } from "lucide-react";

function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link href="/" className="flex items-center text-xl font-bold text-blue-600">
              SmartStay
            </Link>
            <div className="flex space-x-4 items-center">
              {(user.role === "admin" || user.role === "staff") && (
                <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                  Dashboard
                </Link>
              )}
              {user.role === "resident" && (
                <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                  Home
                </Link>
              )}
              <Link href="/complaints" className="text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors">
                Complaints
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {user.role}
            </span>
            <span className="text-sm font-semibold text-gray-900 border-r pr-4">{user.name}</span>
            <button onClick={logout} className="text-gray-500 hover:text-red-600 transition flex items-center gap-2 text-sm font-medium">
              <LogOut size={16}/> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navigation />
      {children}
    </AuthProvider>
  );
}
