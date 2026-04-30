export const API_BASE_URL = "http://localhost:8000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function loginApi(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    const errorMessage = Array.isArray(error.detail) ? error.detail.map((e: any) => e.msg).join(", ") : (error.detail || "Login failed");
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function registerApi(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    const errorMessage = Array.isArray(error.detail) ? error.detail.map((e: any) => e.msg).join(", ") : (error.detail || "Registration failed");
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function googleLoginApi(data: any) {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Google login failed");
  return res.json();
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorMsg = `Auth failed with status: ${res.status}`;
    throw new Error(errorMsg);
  }
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE_URL}/users/`, { 
    headers: getAuthHeaders(),
    cache: "no-store" 
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createUser(data: any) {
  const res = await fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to create user");
  }
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
}

export async function fetchComplaints() {
  const res = await fetch(`${API_BASE_URL}/complaints/`, { 
    headers: getAuthHeaders(),
    cache: "no-store" 
  });
  if (!res.ok) throw new Error("Failed to fetch complaints");
  return res.json();
}

export async function createComplaint(data: any) {
  const res = await fetch(`${API_BASE_URL}/complaints/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to create complaint");
  }
  return res.json();
}

export async function updateComplaintStatus(id: number, status: string) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to update status");
  }
  return res.json();
}

export async function deleteComplaint(id: number) {
  const res = await fetch(`${API_BASE_URL}/complaints/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to delete complaint");
  }
}

export async function fetchPayments() {
  const res = await fetch(`${API_BASE_URL}/payments/`, { 
    headers: getAuthHeaders(),
    cache: "no-store" 
  });
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
}

export async function payComplaint(data: { complaintId: number, amount: number }) {
  const res = await fetch(`${API_BASE_URL}/payments/pay`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Payment failed");
  }
  return res.json();
}
