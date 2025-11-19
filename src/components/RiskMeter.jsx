import React from "react";

export const RiskMeter = ({ score }) => {
  let color = "bg-green-500";
  if (score > 30) color = "bg-yellow-500";
  if (score > 70) color = "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{score}</span>
    </div>
  );
};
