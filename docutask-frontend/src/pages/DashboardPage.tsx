import { FileText, CheckSquare, Users, Clock3 } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "128",
      icon: <Users size={26} />,
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
    {
      title: "Documents",
      value: "342",
      icon: <FileText size={26} />,
      bg: "bg-sky-100",
      text: "text-sky-700",
    },
    {
      title: "Tasks",
      value: "89",
      icon: <CheckSquare size={26} />,
      bg: "bg-indigo-100",
      text: "text-indigo-700",
    },
    {
      title: "Pending Reviews",
      value: "17",
      icon: <Clock3 size={26} />,
      bg: "bg-cyan-100",
      text: "text-cyan-700",
    },
  ];

  const recentActivities = [
    "New user account created",
    "Document uploaded successfully",
    "Task assigned to reviewer",
    "Document status updated",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Welcome to DocuTask Vault management dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-white p-5 shadow-sm border border-blue-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.title}</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {item.value}
                </h2>
              </div>

              <div
                className={`h-14 w-14 rounded-xl flex items-center justify-center ${item.bg} ${item.text}`}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-blue-100">
          <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4">
            System Overview
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
              <p className="text-sm text-slate-500">Active Users</p>
              <h3 className="mt-2 text-2xl font-bold text-blue-700">96</h3>
            </div>

            <div className="rounded-xl bg-sky-50 p-4 border border-sky-100">
              <p className="text-sm text-slate-500">Uploaded Docs</p>
              <h3 className="mt-2 text-2xl font-bold text-sky-700">214</h3>
            </div>

            <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
              <p className="text-sm text-slate-500">Completed Tasks</p>
              <h3 className="mt-2 text-2xl font-bold text-indigo-700">61</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-blue-100">
          <h2 className="text-lg font-semibold text-[#1E3A5F] mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                {activity}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}