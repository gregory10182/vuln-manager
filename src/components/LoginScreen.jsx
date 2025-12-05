import React from "react";
import { ShieldAlert, Loader2 } from "lucide-react";

export const LoginScreen = ({ onLogin, analysts, loading }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-fade-in-up">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldAlert size={32} />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">SecAssets Login</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Selecciona tu usuario para gestionar tus workstations asignadas.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => onLogin({ name: "Admin", role: "Admin" })}
          className="w-full p-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <ShieldAlert size={16} />
          Administrador Global
        </button>

        <div className="h-px bg-gray-200 my-4 relative">
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-400">
            ANALISTAS
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-4 text-blue-600">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {analysts.length > 0 ? (
              analysts?.map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    onLogin({ id: a.id, name: a.name, role: "Analyst" })
                  }
                  className="w-full p-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-left flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold group-hover:bg-blue-100 group-hover:text-blue-600">
                    {a.name
                      .split(" ")
                      ?.map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="text-sm font-medium">{a.name}</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">
                No se encontraron analistas en la BD.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
