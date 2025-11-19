import React from "react";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

export const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce-in z-50`}
    >
      {type === "success" ? (
        <CheckCircle size={20} />
      ) : (
        <AlertTriangle size={20} />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose}>
        <X size={16} className="opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
};
