import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Edit } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Liste pour gérer et consulter les transactions
export default function Transactions({
  transactions,
  clients,
  onEdit,
  enChargement,
}) {
  // Fonction pour récupérer le nom complet du client à partir de son id
  const recupererNomClient = (idClient) => {
    const client = clients.find((c) => c.id === idClient);
    return client ? `${client.prenom} ${client.nom}` : "N/A";
  };

  const navigate = useNavigate();
  const RedirectionCategories = () => navigate("/categories");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-stone-800">
          Historique des transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[160px]">
                Catégorie
                <Button
                  type="button"
                  variant="outline"
                  onClick={RedirectionCategories}
                  className="whitespace-nowrap ml-2 h-5 mb-1"
                  size="sm"
                >
                  Modifier
                </Button>
              </TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enChargement ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : transactions.length > 0 ? (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    {format(new Date(t.date), "dd MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t.categorie || "N/A"}</Badge>
                  </TableCell>
                  <TableCell
                    className={`font-medium ${
                      t.type === "revenu" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "revenu" ? "+" : "-"}
                    {(t.montant ?? 0).toFixed(2)}$
                  </TableCell>
                  <TableCell>
                    {t.client_id ? recupererNomClient(t.client_id) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize",
                        !t.statut ? "bg-gray-100 text-gray-500" :
                        t.statut === "Payé" ? "bg-green-100 text-green-800" :
                        t.statut === "En_attente" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      )}
                    >
                      {t.statut || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(t)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Aucune transaction.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
