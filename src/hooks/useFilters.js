import { useState, useMemo } from "react";

export function useFilters(assets, currentUser) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    analyst: "Todos",
    vulnName: "",
    minRisk: 0,
  });

  const isAnalyst = currentUser?.role === "Analyst";

  const resetFilters = () => {
    setFilters({ analyst: "Todos", vulnName: "", minRisk: 0 });
    setSearchTerm("");
  };

  const filteredAssets = useMemo(() => {
    if (!currentUser) return [];

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

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
        asset.vulnerabilities.some((v) => {
          const nameMatch = v.name
            .toLowerCase()
            .includes(filters.vulnName.toLowerCase());

          if (filters.todayDate && nameMatch) {
            return v.lastPatched !== todayStr;
          }

          return nameMatch;
        });

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

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    filteredAssets,
    resetFilters,
  };
}
