import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { UserCheck, UserX, UserPlus } from "lucide-react";

// Synthèse du nombre de clients
export default function ClientResume({ clients }) {
  const totalActifs = clients.filter((c) => c.statut === "Actif").length;
  const totalInactifs = clients.filter((c) => c.statut === "Inactif").length;
  const totalProspects = clients.filter((c) => c.statut === "Prospect").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center p-4 gap-4">
          <CardTitle className="text-sm font-semibold text-stone-800">Actifs</CardTitle>
          <UserCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalActifs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center p-4 gap-4">
          <CardTitle className="text-sm font-semibold text-stone-800">Inactifs</CardTitle>
          <UserX className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{totalInactifs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center p-4 gap-4">
          <CardTitle className="text-sm font-semibold text-stone-800">Prospects</CardTitle>
          <UserPlus className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{totalProspects}</div>
        </CardContent>
      </Card>
    </div>
  );
}
