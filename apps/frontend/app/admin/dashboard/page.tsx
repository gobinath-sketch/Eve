'use client';

import { useEffect, useState } from 'react';
import {
  getAdminMe, getAdminStats, getAdminRegistrations,
  deleteRegistration, resendEmail, markAttendance, adminLogout, getExportUrl,
} from '@/lib/api';
import { useRouter } from 'next/navigation';
import { SITE_NAME } from '@/lib/constants';
import { LogOut, Download, Mail, Trash2, UserCheck } from 'lucide-react';

interface Registration {
  id: string;
  registrationId: string;
  fullName: string;
  email: string;
  mobile: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalRegistrations: number;
  paidRegistrations: number;
  revenueInr: number;
  pendingPayments: number;
  attendanceCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  const load = async () => {
    try {
      const [s, r] = await Promise.all([
        getAdminStats(),
        getAdminRegistrations({ search, status: statusFilter }),
      ]);
      setStats(s);
      setRegistrations(r.data || r);
    } catch {
      router.push('/admin');
    }
  };

  useEffect(() => { getAdminMe().then(load).catch(() => router.push('/admin')); }, [router]);

  const handleLogout = async () => {
    await adminLogout();
    router.push('/admin');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this registration?')) return;
    await deleteRegistration(id);
    load();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <h1 className="font-serif text-xl">{SITE_NAME} Admin</h1>
          <p className="text-xs text-white/40">Dashboard</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary flex items-center gap-2 text-xs">
          <LogOut size={14} /> Logout
        </button>
      </header>

      {stats && (
        <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-5">
          {[
            { label: 'Total', value: stats.totalRegistrations },
            { label: 'Paid', value: stats.paidRegistrations },
            { label: 'Revenue', value: `₹${stats.revenueInr}` },
            { label: 'Pending', value: stats.pendingPayments },
            { label: 'Attendance', value: stats.attendanceCount },
          ].map((s) => (
            <div key={s.label} className="border border-white/10 p-4">
              <p className="text-xs text-white/40">{s.label}</p>
              <p className="text-xl font-medium">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="px-6 pb-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-xs">
            <option value="">All Status</option>
            <option value="PAID">Paid</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_PAYMENT">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <button onClick={load} className="btn-secondary text-xs">Search</button>
          <a href={getExportUrl('csv')} className="btn-secondary flex items-center gap-1 text-xs"><Download size={14} /> CSV</a>
          <a href={getExportUrl('excel')} className="btn-secondary flex items-center gap-1 text-xs"><Download size={14} /> Excel</a>
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-white/40">
              <tr>
                <th className="p-3">Reg ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="p-3">{r.registrationId}</td>
                  <td className="p-3">{r.fullName}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => resendEmail(r.id)} title="Resend Email"><Mail size={14} /></button>
                      <button onClick={() => markAttendance(r.id)} title="Mark Attendance"><UserCheck size={14} /></button>
                      <button onClick={() => handleDelete(r.id)} title="Delete"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
