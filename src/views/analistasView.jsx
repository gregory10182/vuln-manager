import { Users, Loader2 } from "lucide-react";

export const AnalistasView = ({ analysts, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!analysts.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        <Users size={48} className="mx-auto mb-4 text-gray-200" />
        <p>No hay analistas registrados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Analistas Registrados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {a.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                <p className="text-xs text-gray-500">ID: {a.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
