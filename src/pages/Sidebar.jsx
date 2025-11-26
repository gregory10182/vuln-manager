import { useState } from "react";

import {
  LayoutDashboard,
  Monitor,
  ShieldAlert,
  Search,
  Plus,
  MoreVertical,
  Laptop,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  ChevronRight,
  Activity,
  Filter,
  X,
  Upload,
  Briefcase,
  LogOut,
  Chrome,
  AppWindow,
  Menu, // Importamos el icono de menú
} from "lucide-react";
import { SidebarItem } from "../components/SidebarItem.jsx";

export const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  selectedAsset,
  setSelectedAsset,
  isAnalyst,
  setCurrentUser,
}) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:translate-x-0 md:static
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <ShieldAlert className="fill-blue-100" />
          <span>SecAssets</span>
        </div>
        {/* Close Button for Mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
      </div>

      {/* Info User (Visible on sidebar now) */}
      <div className="px-6 pt-4 pb-0">
        <p className="text-xs text-gray-400 truncate font-medium uppercase tracking-wider">
          Sesión de {currentUser.name.split(" ")[0]}
        </p>
      </div>

      <nav className="flex-1 pt-4">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => {
            setActiveTab("dashboard");
            setSelectedAsset(null);
            setSidebarOpen(false);
          }}
        />
        <SidebarItem
          icon={Monitor}
          label="Mis Workstations"
          active={activeTab === "inventory" && !selectedAsset}
          onClick={() => {
            setActiveTab("inventory");
            setSelectedAsset(null);
            setSidebarOpen(false);
          }}
        />
        {!isAnalyst && (
          <>
            <div className="px-4 py-2 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
              Admin
            </div>
            <SidebarItem
              icon={User}
              label="Analistas"
              active={false}
              onClick={() => {}}
            />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => setCurrentUser(null)}
          className="w-full flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
