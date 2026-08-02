import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import PageTransition from "./PageTransition";
import "./DashboardLayout.css";

export default function DashboardLayout({ role, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-shell">
      <DashboardSidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-shell__main">
        <DashboardTopbar role={role} title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="dashboard-shell__content">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
