import { useState, useEffect, useCallback } from "react";
import { calculateRiskScore } from "../utils/riskCalculator.js";
import api from "../data/api.js";

export function useAssets(currentUser) {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssets = useCallback(async (abortController) => {
    if (!currentUser) return;

    try {

      let data;
      if (currentUser.role === "Admin") {
        data = await api.getEquipos();
      } else {
        data = await api.getEquiposAnalista(currentUser.id);
      }

      if (abortController?.signal.aborted) return;

      const formattedAssets = data?.map((equipo) => ({
        id: equipo.id,
        name: equipo.assetName,
        ip: equipo.IP,
        os: equipo.SO,
        user: equipo.UserID,
        type: equipo.type,
        analyst: equipo.analista ? equipo.analista.name : "Sin Asignar",
        status: "Operational",
        vulnerabilities: equipo.vulnerabilidades
          ? equipo.vulnerabilidades?.map((v) => {
              const detectada = v.EquipoVulnerabilidad?.fechaDetectada;
              const diasAbierto = detectada
                ? Math.floor((Date.now() - new Date(detectada).getTime()) / 86400000)
                : null;

              return {
                id: v.id,
                cve: `Plugin ${v.pluginId}`,
                name: v.vulnName,
                severity: v.severity,
                status: v.EquipoVulnerabilidad?.estado || "Unknown",
                date: detectada
                  ? new Date(detectada).toLocaleDateString()
                  : "N/A",
                diasAbierto,
                lastPatched: v.EquipoVulnerabilidad?.fechaParchado
                  ? v.EquipoVulnerabilidad.fechaParchado.substring(0, 10)
                  : null,
                error: v.EquipoVulnerabilidad?.error,
                errorDescription: v.EquipoVulnerabilidad?.errorMsj || null,
              };
            })
          : [],
        riskScore: calculateRiskScore(equipo.vulnerabilidades),
      }));

      if (abortController?.signal.aborted) return;

      setAssets(formattedAssets);
      setError(null);
    } catch {
      if (abortController?.signal.aborted) return;
      setError(
        "No se pudo conectar con el servidor. Asegúrate que el backend esté corriendo."
      );
    } finally {
      if (!abortController?.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchAssets(controller);

    return () => {
      controller.abort();
    };
  }, [fetchAssets]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    return fetchAssets(controller);
  }, [fetchAssets]);

  return { assets, isLoading, error, setAssets, refetch };
}
