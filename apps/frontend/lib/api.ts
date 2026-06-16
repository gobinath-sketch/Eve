import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;

export async function createRegistrationDraft(data: Record<string, unknown>) {
  const res = await api.post('/registrations/draft', data);
  return res.data;
}

export async function createPaymentOrder(registrationId: string) {
  const res = await api.post('/payments/create-order', { registrationId });
  return res.data;
}

export async function verifyPayment(data: {
  registrationId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const res = await api.post('/payments/verify', {
    razorpay_order_id: data.razorpayOrderId,
    razorpay_payment_id: data.razorpayPaymentId,
    razorpay_signature: data.razorpaySignature,
  });
  return res.data;
}

export async function getRegistration(id: string) {
  const res = await api.get(`/registrations/${id}`);
  return res.data;
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await api.post('/contact', data);
  return res.data;
}

export async function getCurrentEvent() {
  const res = await api.get('/events/current');
  return res.data;
}

export async function adminLogin(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function adminLogout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function getAdminMe() {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function getAdminStats() {
  const res = await api.get('/admin/stats');
  return res.data;
}

export async function getAdminRegistrations(params?: Record<string, string>) {
  const res = await api.get('/admin/registrations', { params });
  return res.data;
}

export async function deleteRegistration(id: string) {
  const res = await api.delete(`/admin/registrations/${id}`);
  return res.data;
}

export async function resendEmail(id: string) {
  const res = await api.post(`/admin/registrations/${id}/resend-email`);
  return res.data;
}

export async function markAttendance(id: string) {
  const res = await api.post(`/admin/registrations/${id}/attendance`);
  return res.data;
}

export function getExportUrl(type: 'csv' | 'excel') {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return `${base}/admin/export/${type}`;
}
