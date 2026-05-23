import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { LoginScreen } from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar.jsx";
import { Dashboard } from "./views/dashboard.jsx";
import { Inventory } from "./views/inventory.jsx";
import { Details } from "./views/details.jsx";
import { Parchados } from "./views/parchados.jsx";
import { Historial } from "./views/historial.jsx";
import { Notification } from "./components/Notification";
import { useNotification } from "./hooks/useNotification.js";
import { useAssets } from "./hooks/useAssets.js";
import { useFilters } from "./hooks/useFilters.js";
import { useStats } from "./hooks/useStats.js";
import api from "./data/api.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [analystsList, setAnalystsList] = useState([]);
  const [analystsLoading, setAnalystsLoading] = useState(true);
  const [analystsError, setAnalystsError] = useState(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedAssetIds, setSelectedAssetIds] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [initialMachines, setInitialMachines] = useState("");

  const fileInputRef = useRef(null);

  const { notification, showNotification, clearNotification } =
    useNotification();

  const { assets, isLoading, error, refetch } = useAssets(currentUser);

  const { searchTerm, setSearchTerm, filters, setFilters, showFilters, setShowFilters, filteredAssets, resetFilters } =
    useFilters(assets, currentUser);

  const stats = useStats(filteredAssets, currentUser);

  const isAnalyst = currentUser?.role === "Analyst";

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    api
      .getAnalistas(controller.signal)
      .then((analysts) => {
        if (!cancelled) {
          setAnalystsList(analysts);
          setAnalystsError(null);
        }
      })
      .catch((err) => {
        if (!cancelled && err.name !== "CanceledError") {
          setAnalystsError(
            "No se pudo conectar con el servidor. Asegúrate que el backend esté corriendo."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAnalystsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const fetchHistorial = () => {
    setHistorialLoading(true);
    api
      .getHistorial(isAnalyst ? currentUser.id : null)
      .then((data) => setHistorial(data))
      .catch(() => setHistorial([]))
      .finally(() => setHistorialLoading(false));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAsset(null);
    setSelectedAssetIds(new Set());
    if (tab === "historial") {
      fetchHistorial();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    showNotification({
      message: `Archivo seleccionado. Implementar endpoint de carga para procesar ${file.name}.`,
      type: "info",
    });
  };

  const handleOperationComplete = () => {
    refetch();
    showNotification({
      message: "Datos actualizados correctamente.",
      type: "success",
    });
  };

  const handleBulkPatch = () => {
    const machines = filteredAssets
      .filter((a) => selectedAssetIds.has(a.id))
      .map((a) => a.name)
      .join("\n");
    setInitialMachines(machines);
    setSelectedAssetIds(new Set());
    setActiveTab("vulnerabilities");
  };

  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={setCurrentUser}
        analysts={analystsList}
        loading={analystsLoading}
      />
    );
  }

  if ((error || analystsError) && !assets.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-4 text-center">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-xl font-bold mb-2">Error de Conexión</h2>
        <p>{error || analystsError}</p>
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
        onClose={clearNotification}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        setCurrentUser={setCurrentUser}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isAnalyst={isAnalyst}
      />

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg font-semibold text-gray-800 truncate max-w-[200px] md:max-w-none">
              {selectedAsset
                ? `Detalle: ${selectedAsset.name}`
                : activeTab === "dashboard"
                ? "Dashboard"
                : activeTab === "historial"
                ? "Historial"
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

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center flex-col">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={48} />
            <p className="text-gray-500 font-medium">
              Sincronizando con Base de Datos...
            </p>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === "dashboard" && !selectedAsset && (
            <Dashboard
              stats={stats}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
            />
          )}

          {activeTab === "inventory" && !selectedAsset && (
            <Inventory
              filteredAssets={filteredAssets}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              setFilters={setFilters}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              setTimedNotification={showNotification}
              resetFilters={resetFilters}
              setSelectedAsset={setSelectedAsset}
              isAnalyst={isAnalyst}
              analystsList={analystsList}
              selectedAssetIds={selectedAssetIds}
              setSelectedAssetIds={setSelectedAssetIds}
              onBulkPatch={handleBulkPatch}
            />
          )}

          {activeTab === "vulnerabilities" && !selectedAsset && (
            <Parchados
              currentUser={currentUser}
              activeTab={activeTab}
              onComplete={handleOperationComplete}
              initialMachines={initialMachines}
              onMachinesConsumed={() => setInitialMachines("")}
            />
          )}

          {activeTab === "errores" && !selectedAsset && (
            <Parchados
              currentUser={currentUser}
              activeTab={activeTab}
              onComplete={handleOperationComplete}
              initialMachines={initialMachines}
              onMachinesConsumed={() => setInitialMachines("")}
            />
          )}

          {activeTab === "historial" && !selectedAsset && (
            <Historial
              historial={historial}
              loading={historialLoading}
              isAnalyst={isAnalyst}
            />
          )}

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
