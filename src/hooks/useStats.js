import { useMemo } from "react";
import { OPEN_STATUSES } from "../data/constants.js";

export function useStats(filteredAssets, currentUser) {
  return useMemo(() => {
    if (!currentUser)
      return {
        totalAssets: 0,
        criticalAssets: 0,
        appVulns: 0,
        avgRisk: 0,
        criticasMas30Dias: 0,
      };

    const totalAssets = filteredAssets.length;
    const criticalAssets = filteredAssets.filter((a) => a.riskScore > 70).length;

    const appVulns = filteredAssets.reduce(
      (acc, curr) =>
        acc +
        curr.vulnerabilities.filter(
          (v) =>
            (v.name.toLowerCase().includes("chrome") ||
              v.name.toLowerCase().includes("edge") ||
              v.name.toLowerCase().includes("office")) &&
            OPEN_STATUSES.includes(v.status)
        ).length,
      0
    );

    const criticasMas30Dias = filteredAssets.reduce(
      (acc, curr) =>
        acc +
        curr.vulnerabilities.filter(
          (v) =>
            v.severity === "Critical" &&
            OPEN_STATUSES.includes(v.status) &&
            v.diasAbierto !== null &&
            v.diasAbierto > 30
        ).length,
      0
    );

    const avgRisk =
      totalAssets > 0
        ? Math.round(
            filteredAssets.reduce((acc, curr) => acc + curr.riskScore, 0) /
              totalAssets
          )
        : 0;

    return { totalAssets, criticalAssets, appVulns, avgRisk, criticasMas30Dias };
  }, [filteredAssets, currentUser]);
}
