import { useLeadStore } from "@/stores/leadStore";
import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export default function Dashboard() {
  const leads = useLeadStore((s) => s.leads);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const stats = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-primary" },
    { label: "New Leads", value: newLeads, icon: UserPlus, color: "text-info" },
    { label: "Contacted", value: contactedLeads, icon: UserCheck, color: "text-warning" },
    { label: "Converted", value: convertedLeads, icon: TrendingUp, color: "text-success" },
  ];

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const sourceCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your lead pipeline</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="gradient-card rounded-xl border border-border p-5 shadow-card hover:shadow-glow transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1 animate-count-up">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conversion Rate + Source Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion */}
          <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Conversion Rate</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-secondary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${conversionRate}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
                  {conversionRate}%
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-success font-semibold">{convertedLeads}</span> of {totalLeads} leads converted
                </p>
                <p className="text-muted-foreground">
                  <span className="text-warning font-semibold">{contactedLeads}</span> in progress
                </p>
              </div>
            </div>
          </div>

          {/* Source Breakdown */}
          <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Lead Sources</h2>
            <div className="space-y-3">
              {Object.entries(sourceCounts).map(([source, count]) => (
                <div key={source} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-28 capitalize">
                    {source.replace("_", " ")}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-primary transition-all duration-500"
                      style={{ width: `${(count / totalLeads) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="gradient-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Leads</h2>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{lead.source.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
