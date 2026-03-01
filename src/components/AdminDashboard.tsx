import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import aheadLogo from "@/assets/Ahead-Logo-Transparent.png";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

interface WaitlistEntry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  model: string;
  preorder: string;
  status?: string;
  createdAt: string;
}

interface Grievance {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  createdAt: string;
}

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa"];
const MODEL_LABELS: Record<string, string> = {
  "5am": "5:00 AM Edition",
  founder: "Founder's Steel",
  midnight: "Midnight Discipline",
};

export default function AdminDashboard() {
  const [data, setData] = useState<WaitlistEntry[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [filter, setFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"overview" | "waitlist" | "grievances">("overview");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<WaitlistEntry>>({});


  // Grevidnce Portal Update
  const [editingGrievanceId, setEditingGrievanceId] = useState<string | null>(null);
  const [editGrievanceForm, setEditGrievanceForm] = useState<Partial<Grievance>>({});
  // ------------------------------------------------------------------------------

  const token = localStorage.getItem("admin_token");

  // Grevience Portal Update 
  const handleDeleteGrievance = async (id: string) => {
    if (!confirm("Delete this grievance?")) return;

    try {
      const res = await fetch(API + `/api/admin/grievances/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (res.ok) {
        setGrievances((prev) => prev.filter((g) => g._id !== id));
        toast.success("Grievance deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Error deleting grievance");
    }
  };
  // ------------------------------------------------------------------------------

  // grevience Portal update  
  const handleUpdateGrievance = async (id: string) => {
    try {
      const res = await fetch(API + `/api/admin/grievances/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(editGrievanceForm),
      });

      if (res.ok) {
        toast.success("Grievance updated");
        setEditingGrievanceId(null);
        fetchData();
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Error updating grievance");
    }
  };
  // ----------------------------------------------------------------

  const fetchData = async () => {
    try {
      const [wRes, gRes] = await Promise.all([
        fetch(API + "/api/admin/waitlist", { headers: { Authorization: "Bearer " + token } }),
        fetch(API + "/api/admin/grievances", { headers: { Authorization: "Bearer " + token } }).catch(() => null),
      ]);
      const waitlist = await wRes.json();
      if (Array.isArray(waitlist)) setData(waitlist);
      if (gRes?.ok) {
        const gData = await gRes.json();
        if (Array.isArray(gData)) setGrievances(gData);
      }
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin";
      return;
    }
    fetchData();
  }, []);

  // Analytics
  const analytics = useMemo(() => {
    const total = data.length;
    const interested = data.filter((d) => d.preorder === "yes").length;
    const maybe = data.filter((d) => d.preorder === "maybe").length;
    const notInterested = data.filter((d) => d.preorder === "no").length;
    const fulfilled = data.filter((d) => d.status === "fulfilled").length;

    const pieData = [
      { name: "Interested", value: interested },
      { name: "Maybe", value: maybe },
      { name: "Not Interested", value: notInterested },
      { name: "Fulfilled", value: fulfilled },
    ];

    const modelData = Object.entries(
      data.reduce((acc, d) => {
        acc[d.model] = (acc[d.model] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([model, count]) => ({ name: MODEL_LABELS[model] || model, count }));

    return { total, interested, maybe, notInterested, fulfilled, pieData, modelData };
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const matchFilter = filter === "all" || d.preorder === filter || d.status === filter;
      const matchModel = modelFilter === "all" || d.model === modelFilter;
      const matchSearch =
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchModel && matchSearch;
    });
  }, [data, filter, modelFilter, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await fetch(API + `/api/admin/waitlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      setData((prev) => prev.filter((d) => d._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(API + `/api/admin/waitlist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        toast.success("Updated");
        setEditingId(null);
        fetchData();
      }
    } catch {
      toast.error("Failed");
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Model", "Preorder", "Status", "Date"];
    const rows = data.map((d) => [d.name, d.email, d.phone, d.model, d.preorder, d.status || d.preorder, new Date(d.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ahead-waitlist-${Date.now()}.csv`;
    a.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={aheadLogo} alt="AHEAD" className="h-10 w-auto" />
            <span className="text-xs tracking-widest uppercase text-steel-dark font-medium hidden sm:block">Admin Panel</span>
          </div>
          <button onClick={handleLogout} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 rounded-sm">
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-card/40 backdrop-blur-xl border border-border/50 rounded-lg p-1 w-fit">
          {(["overview", "waitlist", "grievances"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase rounded-md transition-all font-medium ${tab === t ? "bg-gradient-steel text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Total Entries", value: analytics.total, color: "text-foreground" },
                { label: "Interested", value: analytics.interested, color: "text-emerald-400" },
                { label: "Maybe", value: analytics.maybe, color: "text-amber-400" },
                { label: "Not Interested", value: analytics.notInterested, color: "text-red-400" },
                { label: "Fulfilled", value: analytics.fulfilled, color: "text-blue-400" },
              ].map((s) => (
                <GlassCard key={s.label} hover={false}>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">{s.label}</p>
                  <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
                </GlassCard>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard hover={false}>
                <h3 className="font-display text-lg font-semibold mb-4">Interest Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={analytics.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {analytics.pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(225 20% 8%)", border: "1px solid hsl(225 10% 18%)", borderRadius: "8px", color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 className="font-display text-lg font-semibold mb-4">Demand by Model</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analytics.modelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 10% 18%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(220 10% 55%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(220 10% 55%)" }} />
                    <Tooltip contentStyle={{ background: "hsl(225 20% 8%)", border: "1px solid hsl(225 10% 18%)", borderRadius: "8px", color: "#fff" }} />
                    <Bar dataKey="count" fill="hsl(220 10% 72%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* WAITLIST */}
        {tab === "waitlist" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-input border border-border rounded-sm px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-64"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-input border border-border rounded-sm px-4 py-2 text-sm text-foreground appearance-none"
              >
                <option value="all">All Status</option>
                <option value="yes">Interested</option>
                <option value="maybe">Maybe</option>
                <option value="no">Not Interested</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="bg-input border border-border rounded-sm px-4 py-2 text-sm text-foreground appearance-none"
              >
                <option value="all">All Models</option>
                <option value="5am">5:00 AM Edition</option>
                <option value="founder">Founder's Steel</option>
                <option value="midnight">Midnight Discipline</option>
              </select>
              <button onClick={exportCSV} className="ml-auto bg-gradient-steel text-primary-foreground px-5 py-2 text-xs font-semibold tracking-widest uppercase rounded-sm">
                Export CSV
              </button>
            </div>

            <p className="text-sm text-muted-foreground">{filteredData.length} records</p>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card/60 border-b border-border">
                    {["Name", "Email", "Phone", "Model", "Interest", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left p-3 text-xs tracking-widest uppercase text-muted-foreground font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((u) => (
                    <tr key={u._id} className="border-b border-border/30 hover:bg-card/30 transition-colors">
                      {editingId === u._id ? (
                        <>
                          <td className="p-3"><input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="bg-input border border-border rounded px-2 py-1 text-sm w-full" /></td>
                          <td className="p-3 text-muted-foreground">{u.email}</td>
                          <td className="p-3"><input value={editForm.phone || ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="bg-input border border-border rounded px-2 py-1 text-sm w-full" /></td>
                          <td className="p-3">
                            <select value={editForm.model || ""} onChange={(e) => setEditForm({ ...editForm, model: e.target.value })} className="bg-input border border-border rounded px-2 py-1 text-sm">
                              <option value="5am">5:00 AM</option>
                              <option value="founder">Founder's</option>
                              <option value="midnight">Midnight</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select value={editForm.preorder || ""} onChange={(e) => setEditForm({ ...editForm, preorder: e.target.value })} className="bg-input border border-border rounded px-2 py-1 text-sm">
                              <option value="yes">Interested</option>
                              <option value="maybe">Maybe</option>
                              <option value="no">No</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select value={editForm.status || ""} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="bg-input border border-border rounded px-2 py-1 text-sm">
                              <option value="">Default</option>
                              <option value="fulfilled">Fulfilled</option>
                            </select>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 flex gap-2">
                            <button onClick={() => handleUpdate(u._id)} className="text-emerald-400 hover:text-emerald-300 text-xs uppercase tracking-wider">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider">Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 font-medium">{u.name}</td>
                          <td className="p-3 text-muted-foreground">{u.email}</td>
                          <td className="p-3 text-muted-foreground">{u.phone || "—"}</td>
                          <td className="p-3">{MODEL_LABELS[u.model] || u.model}</td>
                          <td className="p-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded ${u.preorder === "yes" ? "bg-emerald-400/10 text-emerald-400" :
                              u.preorder === "maybe" ? "bg-amber-400/10 text-amber-400" :
                                "bg-red-400/10 text-red-400"
                              }`}>
                              {u.preorder === "yes" ? "Interested" : u.preorder === "maybe" ? "Maybe" : "Not Interested"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-xs font-medium ${u.status === "fulfilled" ? "text-blue-400" : "text-muted-foreground"}`}>
                              {u.status === "fulfilled" ? "Fulfilled" : "Pending"}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 flex gap-2">
                            <button onClick={() => { setEditingId(u._id); setEditForm(u); }} className="text-steel-light hover:text-foreground text-xs uppercase tracking-wider">Edit</button>
                            <button onClick={() => handleDelete(u._id)} className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider">Del</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* GRIEVANCES
        {tab === "grievances" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="font-display text-xl font-bold mb-4">User Grievances</h2>
            {grievances.length === 0 ? (
              <GlassCard hover={false}>
                <p className="text-muted-foreground text-center py-8">No grievances submitted yet.</p>
              </GlassCard>
            ) : (
              grievances.map((g) => (
                <GlassCard key={g._id} hover={false}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{g.subject}</h3>
                      <p className="text-xs text-muted-foreground">
                        {g.userName} ({g.userEmail}) • {new Date(g.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{g.message}</p>
                </GlassCard>
              ))
            )}
          </motion.div>
        )} */}

        {/* GRIEVANCES */}
        {tab === "grievances" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="font-display text-xl font-bold mb-4">User Grievances</h2>

            {grievances.length === 0 ? (
              <GlassCard hover={false}>
                <p className="text-muted-foreground text-center py-8">
                  No grievances submitted yet.
                </p>
              </GlassCard>
            ) : (
              grievances.map((g) => (
                <GlassCard key={g._id} hover={false}>
                  {editingGrievanceId === g._id ? (
                    <>
                      {/* EDIT MODE */}
                      <input
                        value={editGrievanceForm.subject || ""}
                        onChange={(e) =>
                          setEditGrievanceForm({
                            ...editGrievanceForm,
                            subject: e.target.value,
                          })
                        }
                        className="bg-input border border-border rounded px-3 py-2 text-sm w-full mb-3"
                        placeholder="Subject"
                      />

                      <textarea
                        value={editGrievanceForm.message || ""}
                        onChange={(e) =>
                          setEditGrievanceForm({
                            ...editGrievanceForm,
                            message: e.target.value,
                          })
                        }
                        className="bg-input border border-border rounded px-3 py-2 text-sm w-full mb-3"
                        rows={4}
                        placeholder="Message"
                      />

                      <div className="flex gap-4">
                        <button
                          onClick={() => handleUpdateGrievance(g._id)}
                          className="text-emerald-400 hover:text-emerald-300 text-xs uppercase tracking-wider"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingGrievanceId(null)}
                          className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* VIEW MODE */}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {g.subject}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {g.userName} ({g.userEmail}) •{" "}
                            {new Date(g.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setEditingGrievanceId(g._id);
                              setEditGrievanceForm(g);
                            }}
                            className="text-steel-light hover:text-foreground text-xs uppercase tracking-wider"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteGrievance(g._id)}
                            className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm mt-2">
                        {g.message}
                      </p>
                    </>
                  )}
                </GlassCard>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
