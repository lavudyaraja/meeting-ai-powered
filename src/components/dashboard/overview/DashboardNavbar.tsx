import { Menu } from "lucide-react";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const DashboardNavbar = ({ sidebarOpen, setSidebarOpen }: DashboardNavbarProps) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b-2 border-cyan-400/30 px-6 py-4 flex-shrink-0 relative z-50">
      <div className="flex items-center justify-between">
        {/* Sidebar Toggle */}
        <button
          className="lg:hidden p-2 hover:bg-slate-800/30 rounded-xl transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 text-cyan-300" />
        </button>

        <div className="flex-1 lg:flex-none"></div>
      </div>
    </header>
  );
};

export default DashboardNavbar;