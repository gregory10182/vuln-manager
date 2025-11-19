// src/data/mockData.js

export const ANALYSTS = [
  "Enmanuel Vasquez",
  "Jorge Venti",
  "Mariangela Soto",
  "Javier Caceres",
  "Arturo Medina",
  "Gregory Perez",
];

export const DEPARTMENTS = [
  "FIN",
  "RRHH",
  "DEV",
  "MKT",
  "OPS",
  "LOG",
  "VTS",
  "ADM",
  "LEG",
];

export const OS_TYPES = [
  "Windows 10 Pro",
  "Windows 10 Enterprise",
  "Windows 11 Pro",
  "Windows 11 Enterprise",
];

const VULN_POOL = [
  {
    cve: "CVE-2023-36884",
    name: "Microsoft Office Remote Code Execution",
    severity: "Critical",
    target: "Office",
  },
  {
    cve: "CVE-2023-4863",
    name: "Google Chrome Heap Buffer Overflow",
    severity: "High",
    target: "Chrome",
  },
  {
    cve: "CVE-2023-29325",
    name: "Windows OLE Remote Code Execution",
    severity: "High",
    target: "Windows",
  },
  {
    cve: "CVE-2023-23397",
    name: "Microsoft Outlook Elevation of Privilege",
    severity: "Critical",
    target: "Outlook",
  },
  {
    cve: "CVE-2023-38180",
    name: "Microsoft Teams Denial of Service",
    severity: "Medium",
    target: "Teams",
  },
  {
    cve: "CVE-2023-41999",
    name: "Adobe Reader Out of Bounds Write",
    severity: "Medium",
    target: "Adobe",
  },
  {
    cve: "CVE-2023-24932",
    name: "Secure Boot Bypass (BlackLotus)",
    severity: "High",
    target: "System",
  },
  {
    cve: "CVE-2023-1234",
    name: "7-Zip Untrusted Initialization",
    severity: "Low",
    target: "App",
  },
  {
    cve: "CVE-2023-38166",
    name: "Microsoft Edge Elevation of Privilege",
    severity: "Medium",
    target: "Edge",
  },
];

export const generateMockAssets = () => {
  const assets = [];
  let idCounter = 1;

  ANALYSTS.forEach((analyst, index) => {
    for (let i = 0; i < 20; i++) {
      const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
      const os = OS_TYPES[Math.floor(Math.random() * OS_TYPES.length)];
      const isVuln = Math.random() > 0.2;

      let vulnerabilities = [];
      let riskScore = 0;

      if (isVuln) {
        const numVulns = Math.floor(Math.random() * 4) + 1;
        const shuffledVulns = [...VULN_POOL].sort(() => 0.5 - Math.random());

        vulnerabilities = shuffledVulns.slice(0, numVulns).map((v, idx) => ({
          id: idCounter * 1000 + idx,
          cve: v.cve,
          name: v.name,
          severity: v.severity,
          status: "Open",
          date: `2023-${Math.floor(Math.random() * 3) + 9}-${
            Math.floor(Math.random() * 28) + 1
          }`,
        }));

        riskScore = vulnerabilities.reduce((acc, v) => {
          if (v.severity === "Critical") return acc + 35;
          if (v.severity === "High") return acc + 20;
          if (v.severity === "Medium") return acc + 10;
          return acc + 2;
        }, 0);
        if (riskScore > 100) riskScore = 100;
      }

      assets.push({
        id: idCounter++,
        name: `WKS-${dept}-${String(Math.floor(Math.random() * 900) + 100)}`,
        ip: `10.20.${index + 1}.${Math.floor(Math.random() * 253) + 1}`,
        os: os,
        type: "Workstation",
        user: `${dept.toLowerCase()}.${Math.random()
          .toString(36)
          .substring(7)}`,
        analyst: analyst,
        status: "Active",
        riskScore: riskScore,
        vulnerabilities: vulnerabilities,
      });
    }
  });

  return assets;
};

export const INITIAL_ASSETS = generateMockAssets();
