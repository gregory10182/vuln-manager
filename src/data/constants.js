export const VULN_STATUS = {
  NEW: "New",
  ACTIVE: "Active",
  RESURFACED: "Resurfaced",
  FIXED: "Fixed",
  CLOSED: "Closed",
  UNKNOWN: "Unknown",
};

export const VULN_SEVERITY = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const SEVERITY_WEIGHT = {
  Critical: 35,
  High: 20,
  Medium: 10,
  Low: 2,
};

export const MAX_RISK_SCORE = 100;

export const EQUIPMENT_STATUS = {
  OPERATIONAL: "Operational",
};

export const OPEN_STATUSES = [
  VULN_STATUS.NEW,
  VULN_STATUS.ACTIVE,
  VULN_STATUS.RESURFACED,
];

export const CLOSED_STATUSES = [
  VULN_STATUS.FIXED,
  VULN_STATUS.CLOSED,
];

export const TABS = {
  DASHBOARD: "dashboard",
  INVENTORY: "inventory",
  VULNERABILITIES: "vulnerabilities",
  ERRORES: "errores",
};
