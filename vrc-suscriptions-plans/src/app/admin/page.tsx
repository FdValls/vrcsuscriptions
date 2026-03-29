import { createClient } from "@/lib/supabase/server";
import { logout } from "./login/actions";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: donantes } = await supabase
    .from("donantes")
    .select("*")
    .order("created_at", { ascending: false });

  const activos = donantes?.filter((d) => d.status === "authorized") ?? [];
  const totalActivos = activos.length;
  const montoMensual = activos.reduce((acc, d) => acc + (d.amount ?? 0), 0);

  // Agrupar activos por who_told_you
  const porOrigen = activos.reduce<Record<string, { cantidad: number; monto: number }>>(
    (acc, d) => {
      const origen = d.who_told_you || "Sin especificar";
      if (!acc[origen]) acc[origen] = { cantidad: 0, monto: 0 };
      acc[origen].cantidad += 1;
      acc[origen].monto += d.amount ?? 0;
      return acc;
    },
    {}
  );
  const origenRows = Object.entries(porOrigen).sort((a, b) => b[1].cantidad - a[1].cantidad);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logovrc_fondoblanco.png" alt="VRC" className="h-10" />
          <h1 className="text-lg font-bold text-gray-800">Panel de administración</h1>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            Cerrar sesión
          </button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* Indicadores */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Donantes activos" value={totalActivos} />
          <StatCard
            label="Monto mensual"
            value={`$${montoMensual.toLocaleString("es-AR")}`}
          />
        </div>

        {/* Apertura por origen */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Por canal de llegada</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">¿Quién te contó?</th>
                <th className="px-6 py-3 text-right">Donantes</th>
                <th className="px-6 py-3 text-right">Monto mensual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {origenRows.map(([origen, { cantidad, monto }]) => (
                <tr key={origen} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-800">{origen}</td>
                  <td className="px-6 py-3 text-right text-gray-900 font-medium">{cantidad}</td>
                  <td className="px-6 py-3 text-right text-gray-900">${monto.toLocaleString("es-AR")}</td>
                </tr>
              ))}
              {origenRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-gray-400">
                    No hay donantes activos todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detalle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Detalle de donantes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Teléfono</th>
                  <th className="px-6 py-3 text-left">Monto</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {donantes?.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{d.name}</td>
                    <td className="px-6 py-3 text-gray-600">{d.email}</td>
                    <td className="px-6 py-3 text-gray-600">{d.phone}</td>
                    <td className="px-6 py-3 text-gray-900">${Number(d.amount).toLocaleString("es-AR")}</td>
                    <td className="px-6 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(d.created_at).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
                {(!donantes || donantes.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No hay donantes registrados todavía
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    authorized: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    paused: "bg-orange-100 text-orange-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    authorized: "Activo",
    pending: "Pendiente",
    paused: "Pausado",
    cancelled: "Cancelado",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {labels[status] ?? status}
    </span>
  );
}
