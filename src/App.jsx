import React, { useState, useMemo, useRef } from "react";
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

// Importaciones de nuestros archivos nuevos
import { INITIAL_ASSETS, ANALYSTS } from "./data/mockData";
import { LoginScreen } from "./components/LoginScreen";
import { StatusBadge } from "./components/StatusBadge";
import { RiskMeter } from "./components/RiskMeter";
import { Notification } from "./components/Notification";
import { Sidebar } from "./pages/Sidebar.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // State para la sesión
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: "success",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    analyst: "Todos", // Para admins
    vulnName: "",
    minRisk: 0,
  });

  // Función para mostrar notificaciones temporales
  const setTimedNotification = ({ message, type }) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type });
    }, 3000);
  };
  // Safe check for role
  const isAnalyst = currentUser?.role === "Analyst";

  // Lógica de filtrado Principal
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
        asset.vulnerabilities.some(
          (v) =>
            v.name.toLowerCase().includes(filters.vulnName.toLowerCase()) &&
            v.status === "Open"
        );
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

  // Stats calculados dinámicamente
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
            v.status === "Open"
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setTimeout(() => {
      setNotification({
        message: `CSV importado. Equipos actualizados para ${currentUser.name}.`,
        type: "success",
      });
    }, 1000);
  };

  // --- RENDERIZADO ---

  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: null })}
      />

      {/* Mobile Overlay (Fondo oscuro cuando abres menú) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        isAnalyst={isAnalyst}
        setCurrentUser={setCurrentUser}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Header Responsive */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button (Mobile Only) */}
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

        {/* Content Scrollable */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {/* VIEW: DASHBOARD */}
          {activeTab === "dashboard" && !selectedAsset && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <span className="text-gray-500 text-sm font-medium">
                    Total Asignado
                  </span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {stats.totalAssets}
                    </span>
                    <Monitor className="text-blue-500 opacity-20" size={32} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <span
                    className="text-gray-500 text-sm font-medium"
                    title="Vulns en Chrome, Edge, Office, Teams"
                  >
                    Apps Críticas
                  </span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {stats.appVulns}
                    </span>
                    <AppWindow
                      className="text-orange-500 opacity-20"
                      size={32}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm flex flex-col relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-red-500 opacity-5 rounded-bl-full"></div>
                  <span className="text-red-600 text-sm font-medium">
                    Equipos Críticos
                  </span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-bold text-red-600">
                      {stats.criticalAssets}
                    </span>
                    <AlertTriangle
                      className="text-red-500 opacity-20"
                      size={32}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                  <span className="text-gray-500 text-sm font-medium">
                    Score Promedio
                  </span>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {stats.avgRisk}
                    </span>
                    <div className="text-xs text-gray-400 mb-1">
                      / 100 Riesgo
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${stats.avgRisk}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-blue-800 font-semibold text-lg">
                    Actualizar Inventario
                  </h3>
                  <p className="text-blue-600 text-sm mt-1">
                    Carga un reporte CSV para actualizar el estado de seguridad.
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm font-medium flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  Cargar Reporte
                </button>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* VIEW: INVENTORY LIST */}
          {activeTab === "inventory" && !selectedAsset && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {/* --- FILTER TOOLBAR --- */}
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
                <div className="relative w-full sm:w-96">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Buscar usuario, IP..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* make the buttons full witdh in small screens */}
                <div className="flex gap-2 relative flex-wrap">
                  <button
                    onClick={() => {
                      const assetNames = filteredAssets
                        .map((a) => a.name)
                        .join("\n");
                      navigator.clipboard.writeText(assetNames);
                      setTimedNotification({
                        message:
                          "Lista de workstations copiada al portapapeles.",
                        type: "success",
                      });
                    }}
                    className="flex-1 sm:flex-none justify-center px-3 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    title="Copiar lista de workstations"
                  >
                    Copiar Equipos
                  </button>

                  <button
                    onClick={() => {
                      const assetIPs = filteredAssets
                        .map((a) => a.ip)
                        .join("\n");
                      navigator.clipboard.writeText(assetIPs);
                      setTimedNotification({
                        message: "Lista de IPs copiada al portapapeles.",
                        type: "success",
                      });
                    }}
                    className="flex-1 sm:flex-none justify-center px-3 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    title="Copiar lista de workstations"
                  >
                    Copiar IPs
                  </button>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex-1 sm:flex-none justify-center px-3 py-2 border rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      showFilters ||
                      filters.analyst !== "Todos" ||
                      filters.vulnName !== "" ||
                      filters.minRisk > 0
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Filter size={16} />
                    Filtros
                    {(filters.analyst !== "Todos" ||
                      filters.vulnName !== "" ||
                      filters.minRisk > 0) && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}
                  </button>

                  {/* --- FILTER POPOVER --- */}
                  {showFilters && (
                    <div className="absolute right-0 top-12 w-full sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Filtros</h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {!isAnalyst && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Analista
                            </label>
                            <select
                              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                              value={filters.analyst}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  analyst: e.target.value,
                                })
                              }
                            >
                              <option value="Todos">Todos</option>
                              {ANALYSTS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Software
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej: Chrome"
                            value={filters.vulnName}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                vulnName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1 flex justify-between">
                            <span>Riesgo Mínimo</span>
                            <span className="text-blue-600">
                              {filters.minRisk}%
                            </span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            value={filters.minRisk}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                minRisk: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex gap-2">
                          <button
                            onClick={resetFilters}
                            className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-lg"
                          >
                            Limpiar
                          </button>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="flex-1 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                          >
                            Listo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Table with Horizontal Scroll for Mobile */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">Workstation</th>
                      {!isAnalyst && <th className="px-6 py-3">Analista</th>}
                      <th className="px-6 py-3">Usuario</th>
                      <th className="px-6 py-3">IP</th>
                      <th className="px-6 py-3">Riesgo</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <tr
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          className="hover:bg-blue-50 cursor-pointer transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <Laptop size={18} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {asset.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {asset.os}
                                </div>
                              </div>
                            </div>
                          </td>
                          {!isAnalyst && (
                            <td className="px-6 py-4 text-gray-700">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                {asset.analyst}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 text-gray-600">
                            {asset.user}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-500">
                            {asset.ip}
                          </td>
                          <td className="px-6 py-4">
                            <RiskMeter score={asset.riskScore} />
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={asset.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <ChevronRight
                              className="inline-block text-gray-300 group-hover:text-blue-500"
                              size={20}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-12 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Search size={48} className="text-gray-200 mb-4" />
                            <p>No se encontraron resultados.</p>
                            <button
                              onClick={resetFilters}
                              className="text-blue-600 text-sm mt-2 hover:underline"
                            >
                              Limpiar filtros
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: ASSET DETAIL */}
          {selectedAsset && (
            <div className="animate-fade-in pb-8">
              <button
                onClick={() => setSelectedAsset(null)}
                className="mb-4 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                ← Volver
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Laptop size={32} />
                      </div>
                      <div className="text-right">
                        <StatusBadge status={selectedAsset.status} />
                        <div className="mt-2 text-sm text-gray-400">
                          ID: #{selectedAsset.id}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1 truncate">
                      {selectedAsset.name}
                    </h2>
                    <p className="text-gray-500 mb-6">{selectedAsset.os}</p>

                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">Analista</span>
                        <span className="text-sm text-purple-700 font-medium">
                          {selectedAsset.analyst}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">Usuario</span>
                        <span className="text-sm text-gray-900 font-medium">
                          {selectedAsset.user}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500 text-sm">
                          IP Address
                        </span>
                        <span className="font-mono text-sm text-gray-900">
                          {selectedAsset.ip}
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="text-gray-500 text-sm block mb-2">
                          Nivel de Riesgo
                        </span>
                        <RiskMeter score={selectedAsset.riskScore} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Acciones</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <button className="bg-blue-700 hover:bg-blue-800 py-2 rounded-lg text-sm font-medium transition-colors">
                        Registrar Parche
                      </button>
                      <button className="bg-white text-blue-700 hover:bg-gray-100 py-2 rounded-lg text-sm font-medium transition-colors">
                        Contactar Usuario
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vulnerabilities List */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">
                        Vulnerabilidades
                      </h3>
                      <button className="text-blue-600 text-sm hover:underline">
                        + Nota
                      </button>
                    </div>

                    {selectedAsset.vulnerabilities.length === 0 ? (
                      <div className="p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-20" />
                        <h4 className="text-lg font-medium text-gray-900">
                          Sin Riesgos
                        </h4>
                        <p className="text-gray-500">Equipo limpio.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {selectedAsset.vulnerabilities.map((vuln) => {
                          const isOffice =
                            vuln.name.toLowerCase().includes("office") ||
                            vuln.name.toLowerCase().includes("outlook");
                          const isBrowser =
                            vuln.name.toLowerCase().includes("chrome") ||
                            vuln.name.toLowerCase().includes("edge");
                          const isAdobe = vuln.name
                            .toLowerCase()
                            .includes("adobe");

                          return (
                            <div
                              key={vuln.id}
                              className={`p-4 hover:bg-gray-50 flex flex-col sm:flex-row gap-4 sm:items-center border-l-4 ${
                                isOffice
                                  ? "border-orange-400 bg-orange-50"
                                  : isBrowser
                                  ? "border-blue-400 bg-blue-50"
                                  : "border-transparent"
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <StatusBadge status={vuln.severity} />
                                  <span className="font-mono text-sm text-gray-500 font-medium">
                                    {vuln.cve}
                                  </span>
                                  {isOffice && (
                                    <span className="text-[10px] font-bold text-orange-600 bg-white px-2 rounded border border-orange-200">
                                      OFFICE
                                    </span>
                                  )}
                                  {isBrowser && (
                                    <span className="text-[10px] font-bold text-blue-600 bg-white px-2 rounded border border-blue-200">
                                      WEB
                                    </span>
                                  )}
                                  {isAdobe && (
                                    <span className="text-[10px] font-bold text-red-600 bg-white px-2 rounded border border-red-200">
                                      PDF
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-800 font-medium text-sm sm:text-base">
                                  {vuln.name}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Detectado: {vuln.date}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 self-end sm:self-auto">
                                <StatusBadge status={vuln.status} />
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreVertical size={18} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
