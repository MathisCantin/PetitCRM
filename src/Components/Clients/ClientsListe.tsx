import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";

// Liste des clients avec filtres et bouton de réinitialisation
export default function ClientList({ clients, onEdit, enChargement }) {
  const [filtreStatut, setFiltreStatut] = useState("__all__");
  const [filtreTexte, setFiltreTexte] = useState("");

  const resetFiltres = () => {
    setFiltreStatut("__all__");
    setFiltreTexte("");
  };

  const clientsFiltres = useMemo(() => {
    return clients.filter((client) => {
      const matchStatut =
        filtreStatut === "__all__" || client.statut === filtreStatut;

      const matchTexte =
        filtreTexte.trim() === "" ||
        `${client.nom} ${client.prenom} ${client.societe || ""}`
          .toLowerCase()
          .includes(filtreTexte.trim().toLowerCase());

      return matchStatut && matchTexte;
    });
  }, [clients, filtreStatut, filtreTexte]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle className="text-stone-800">Liste des clients</CardTitle>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Input
            placeholder="Rechercher par nom ou société"
            className="w-[250px]"
            value={filtreTexte}
            onChange={(e) => setFiltreTexte(e.target.value)}
          />
          <Select value={filtreStatut} onValueChange={setFiltreStatut}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous les statuts</SelectItem>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFiltres}>
            Réinitialiser
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Société</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enChargement ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : clientsFiltres.length > 0 ? (
              clientsFiltres.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    {client.nom} {client.prenom}
                  </TableCell>
                  <TableCell>{client.societe || "-"}</TableCell>
                  <TableCell>{client.email || "-"}</TableCell>
                  <TableCell>{client.telephone || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize",
                        client.statut === "Actif"
                          ? "bg-green-100 text-green-800"
                          : client.statut === "Inactif"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {client.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucun client ne correspond aux filtres.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
