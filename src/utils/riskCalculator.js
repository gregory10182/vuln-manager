import { SEVERITY_WEIGHT, MAX_RISK_SCORE, CLOSED_STATUSES } from "../data/constants.js";

export function calculateRiskScore(vulns) {
  if (!vulns || vulns.length === 0) return 0;

  const score = vulns.reduce((acc, v) => {
    const estado = v.EquipoVulnerabilidad?.estado || "Active";
    if (CLOSED_STATUSES.includes(estado)) return acc;

    const weight = SEVERITY_WEIGHT[v.severity] || 1;
    return acc + weight;
  }, 0);

  return Math.min(score, MAX_RISK_SCORE);
}
