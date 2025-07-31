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

// Liste pour gérer et consulter les clients
export default function ClientList({ clients, onEdit, enChargement }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-stone-800">Liste des clients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enChargement ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    {client.prenom} {client.nom}
                  </TableCell>
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
                <TableCell colSpan={5} className="text-center">
                  Aucun client enregistré.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
