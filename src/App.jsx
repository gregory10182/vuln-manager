import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Monitor,
  ShieldAlert,
  Search,
  User,
  ChevronRight,
  Filter,
  X,
  Upload,
  LogOut,
  AppWindow,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Laptop,
  Menu,
  Loader2, // Icono de carga
} from "lucide-react";

// ==========================================
// 1. CONFIGURACIÓN Y UTILS
// ==========================================

// Ajusta esto a la URL de tu backend
const API_URL = "http://localhost:3000/equipos";

// Función auxiliar para calcular riesgo basado en vulnerabilidades reales
const calculateRiskScore = (vulns) => {
  if (!vulns || vulns.length === 0) return 0;

  let score = vulns.reduce((acc, v) => {
    // Solo sumamos riesgo si la vulnerabilidad está abierta
    const estado = v.EquipoVulnerabilidad?.estado || "Active";
    if (estado === "Fixed" || estado === "Closed") return acc;

    switch (v.severity?.toLowerCase()) {
      case "critical":
        return acc + 35;
      case "high":
        return acc + 20;
      case "medium":
        return acc + 10;
      case "low":
        return acc + 2;
      default:
        return acc + 1;
    }
  }, 0);

  return Math.min(score, 100); // Cap en 100
};

// Importaciones de nuestros archivos nuevos
import { INITIAL_ASSETS, ANALYSTS } from "./data/mockData";
import { LoginScreen } from "./components/LoginScreen";
import { StatusBadge } from "./components/StatusBadge";
import { RiskMeter } from "./components/RiskMeter";
import { Notification } from "./components/Notification";
import { Sidebar } from "./components/Sidebar.jsx";
import { Dashboard } from "./views/dashboard.jsx";
import { Inventory } from "./views/inventory.jsx";
import { Details } from "./views/details.jsx";
import { Parchados } from "./views/parchados.jsx";

import api from "./data/api.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Estado de datos
  const [assets, setAssets] = useState([]);
  const [analystsList, setAnalystsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: "success",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    analyst: "Todos",
    vulnName: "",
    minRisk: 0,
  });

  const setTimedNotification = ({ message, type }) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type });
    }, 3000);
  };

  const updateAssets = async () => {
      try {
        let data;
        if (currentUser.role === "Admin") {
          data = await api.getEquipos();
        } else {
          data = await api.getEquiposAnalista(currentUser.id);
        }
        console.log(data)
        const formattedAssets = data.map((equipo) => ({
          id: equipo.id,
          name: equipo.assetName, // Mapeo de assetName -> name
          ip: equipo.IP,
          os: equipo.SO,
          user: equipo.UserID,
          type: equipo.type,
          // Acceso seguro a la relación 'analista' (puede venir null)
          analyst: equipo.analista ? equipo.analista.name : "Sin Asignar",
          status: "Operational", // <--- CAMBIO AQUÍ: Usamos 'Operational' para evitar conflicto con vulnerabilidad 'Active'

          // Transformar vulnerabilidades y datos de la tabla intermedia
          vulnerabilities: equipo.vulnerabilidades
            ? equipo.vulnerabilidades.map((v) => ({
                id: v.id,
                cve: `Plugin ${v.pluginId}`, // Usamos pluginId como identificador visual
                name: v.vulnName,
                severity: v.severity,
                // Datos de la tabla intermedia (EquipoVulnerabilidad)
                status: v.EquipoVulnerabilidad?.estado || "Unknown",
                date: v.EquipoVulnerabilidad?.fechaDetectada
                  ? new Date(
                      v.EquipoVulnerabilidad.fechaDetectada
                    ).toLocaleDateString()
                  : "N/A",
                lastPatched: v.EquipoVulnerabilidad?.fechaParchado
                  ? new Date(
                      v.EquipoVulnerabilidad.fechaParchado
                    ).toLocaleDateString()
                  : null,
              }))
            : [],

          // Calcular riesgo en el cliente
          riskScore: calculateRiskScore(equipo.vulnerabilidades),
        }));

        setAssets(formattedAssets);
      } catch (err) {
        console.error("Error fetching assets:", err);
        setError(
          "No se pudo conectar con el servidor. Asegúrate que el backend esté corriendo."
        );
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    try {
      api.getAnalistas().then((analysts) => {
        setAnalystsList(analysts);
      });
    } catch (err) {
      console.error("Error fetching analysts:", err);
      setError(
        "No se pudo conectar con el servidor. Asegúrate que el backend esté corriendo."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    updateAssets();
  }, [currentUser, updateAssets]);

  const isAnalyst = currentUser?.role === "Analyst";

  // --- Lógica de Filtrado ---
  const filteredAssets = useMemo(() => {
    if (!currentUser) return [];

    return assets.filter((asset) => {
      const matchesSession = isAnalyst
        ? asset.analyst === currentUser.name
        : true;

      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip.includes(searchTerm) ||
        asset.user.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAnalystFilter = isAnalyst
        ? true
        : filters.analyst === "Todos" || asset.analyst === filters.analyst;

      const matchesVulnName =
        filters.vulnName === "" ||
        asset.vulnerabilities.some((v) =>
          v.name.toLowerCase().includes(filters.vulnName.toLowerCase())
        ); // Nota: Aquí filtramos por estado 'Open' en búsqueda rápida, ajustable según necesidad

      const matchesRisk = asset.riskScore >= filters.minRisk;

      return (
        matchesSession &&
        matchesSearch &&
        matchesAnalystFilter &&
        matchesVulnName &&
        matchesRisk
      );
    });
  }, [assets, searchTerm, filters, currentUser, isAnalyst]);

  // --- Stats ---
  const stats = useMemo(() => {
    if (!currentUser)
      return { totalAssets: 0, criticalAssets: 0, appVulns: 0, avgRisk: 0 };

    const targetAssets = filteredAssets;
    const totalAssets = targetAssets.length;
    const criticalAssets = targetAssets.filter((a) => a.riskScore > 70).length;

    const appVulns = targetAssets.reduce(
      (acc, curr) =>
        acc +
        curr.vulnerabilities.filter(
          (v) =>
            (v.name.toLowerCase().includes("chrome") ||
              v.name.toLowerCase().includes("edge") ||
              v.name.toLowerCase().includes("office")) &&
            (v.status === "Open" ||
              v.status === "New" ||
              v.status === "Active" ||
              v.status === "Resurfaced")
        ).length,
      0
    );

    const avgRisk =
      totalAssets > 0
        ? Math.round(
            targetAssets.reduce((acc, curr) => acc + curr.riskScore, 0) /
              totalAssets
          )
        : 0;

    return { totalAssets, criticalAssets, appVulns, avgRisk };
  }, [filteredAssets, currentUser]);

  const resetFilters = () => {
    setFilters({ analyst: "Todos", vulnName: "", minRisk: 0 });
    setSearchTerm("");
  };

  // Manejador de carga de archivo (Simulado por ahora en frontend, idealmente POST al backend)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Aquí iría la lógica para enviar el CSV a tu backend:
    // const formData = new FormData(); formData.append('file', file);
    // await fetch('/api/upload-csv', { method: 'POST', body: formData });

    setTimedNotification({
      message: `Archivo seleccionado. Implementar endpoint de carga para procesar ${file.name}.`,
      type: "info",
    });
  };

  // --- RENDERIZADO ---

  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={setCurrentUser}
        analysts={analystsList}
        loading={isLoading}
      />
    );
  }

  if (error && !assets.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-4 text-center">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-xl font-bold mb-2">Error de Conexión</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: null })}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedAsset={setSelectedAsset}
        setCurrentUser={setCurrentUser}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isAnalyst={isAnalyst}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[200px] md:max-w-none">
              {selectedAsset
                ? `Detalle: ${selectedAsset.name}`
                : activeTab === "dashboard"
                ? "Dashboard"
                : "Inventario"}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">
                {currentUser.name}
              </span>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                isAnalyst ? "bg-blue-500" : "bg-purple-600"
              }`}
            >
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Loading Overlay Global */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center flex-col">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={48} />
            <p className="text-gray-500 font-medium">
              Sincronizando con Base de Datos...
            </p>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* VIEW: DASHBOARD */}
          {activeTab === "dashboard" && !selectedAsset && (
            <Dashboard stats={stats} fileInputRef={fileInputRef} />
          )}

          {/* VIEW: INVENTORY */}
          {activeTab === "inventory" && !selectedAsset && (
            <Inventory
              filteredAssets={filteredAssets}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              setTimedNotification={setTimedNotification}
              resetFilters={resetFilters}
              setSelectedAsset={setSelectedAsset}
              isAnalyst={isAnalyst}
            />
          )}

          {/* VIEW: INVENTORY */}
          {activeTab === "vulnerabilities" && !selectedAsset && (
            <Parchados currentUser={currentUser} updateAssets={updateAssets}/>
          )}

          {/* VIEW: DETAIL */}
          {selectedAsset && (
            <Details
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
            />
          )}
        </div>
      </main>
    </div>
  );
}
