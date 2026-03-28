import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import DocumentsPage from "./pages/DocumentsPage";
import TasksPage from "./pages/TasksPage";
import Navbar from "./components/Navbar";
import "./index.css";

export default function App() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-blue-100 flex items-center px-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#1E3A5F]">
            DocuTask Vault
          </h3>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}