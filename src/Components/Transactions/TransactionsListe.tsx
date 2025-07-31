import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
import { Edit, Pencil } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/Components/ui/select";

export default function Transactions({
  transactions,
  clients,
  onEdit,
  enChargement,
}) {
  const [filtreType, setFiltreType] = useState("__all__");
  const [filtreStatut, setFiltreStatut] = useState("__all__");
  const [filtreClient, setFiltreClient] = useState("__all__");
  const [filtreCategorie, setFiltreCategorie] = useState("__all__");
  const [filtrePeriodeType, setFiltrePeriodeType] = useState("__all__");
  const [filtrePeriodeValeur, setFiltrePeriodeValeur] = useState("__all__");

  const navigate = useNavigate();
  const RedirectionCategories = () => navigate("/categories");

  const recupererNomClient = (clientId) => {
    const client = clients.find((c) => c.id === Number(clientId));
    return client ? `${client.prenom} ${client.nom}` : "N/A";
  };

  const categoriesUniques: string[] = Array.from(
    new Set(transactions.map((t) => t.categorie).filter(Boolean))
  );

  // Typage explicite et tri
  const uniqueYears: string[] = Array.from(
    new Set(transactions.map((t) => new Date(t.date).getFullYear()))
  )
    .map(String)
    .sort((a, b) => b.localeCompare(a));

  const rawMonths: string[] = transactions.map((t) => {
    const d = new Date(t.date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  });
  const uniqueMonths: string[] = Array.from(new Set(rawMonths)).sort((a, b) =>
    b.localeCompare(a)
  );

  // Semaines uniques sous forme yyyy-Sww
  const rawWeeks: string[] = transactions.map((t) => {
    const d = new Date(t.date);
    return format(d, "yyyy-'S'II", { locale: fr });
  });
  const uniqueWeeks: string[] = Array.from(new Set(rawWeeks)).sort((a, b) =>
    b.localeCompare(a)
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const year = tDate.getFullYear();
      const month = `${year}-${(tDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const week = format(tDate, "yyyy-'S'II", { locale: fr });

      const periodeMatch =
        filtrePeriodeType === "__all__" ||
        (filtrePeriodeType === "annee" &&
          filtrePeriodeValeur === String(year)) ||
        (filtrePeriodeType === "mois" && filtrePeriodeValeur === month) ||
        (filtrePeriodeType === "semaine" && filtrePeriodeValeur === week);

      return (
        (filtreType === "__all__" || t.type === filtreType) &&
        (filtreStatut === "__all__" || t.statut === filtreStatut) &&
        (filtreClient === "__all__" || t.clientId === Number(filtreClient)) &&
        (filtreCategorie === "__all__" || t.categorie === filtreCategorie) &&
        periodeMatch
      );
    });
  }, [
    transactions,
    filtreType,
    filtreStatut,
    filtreClient,
    filtreCategorie,
    filtrePeriodeType,
    filtrePeriodeValeur,
  ]);

  const resetFiltres = () => {
    setFiltreType("__all__");
    setFiltreStatut("__all__");
    setFiltreClient("__all__");
    setFiltreCategorie("__all__");
    setFiltrePeriodeType("__all__");
    setFiltrePeriodeValeur("__all__");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-stone-800">
          Historique des transactions
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4 items-center">
          <Select value={filtreType} onValueChange={setFiltreType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous les types</SelectItem>
              <SelectItem value="revenu">Revenu</SelectItem>
              <SelectItem value="depense">Dépense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtreStatut} onValueChange={setFiltreStatut}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous les statuts</SelectItem>
              <SelectItem value="Payé">Payé</SelectItem>
              <SelectItem value="En_attente">En attente</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtreClient} onValueChange={setFiltreClient}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Tous les clients</SelectItem>
              {clients.map((c) => (
                <SelectItem key={String(c.id)} value={String(c.id)}>
                  {c.prenom} {c.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtreCategorie} onValueChange={setFiltreCategorie}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Toutes les catégories</SelectItem>
              {categoriesUniques.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filtrePeriodeType}
            onValueChange={(val) => {
              setFiltrePeriodeType(val);
              setFiltrePeriodeValeur("__all__");
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type de période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Toutes les périodes</SelectItem>
              <SelectItem value="annee">Année</SelectItem>
              <SelectItem value="mois">Mois</SelectItem>
              <SelectItem value="semaine">Semaine</SelectItem>
            </SelectContent>
          </Select>

          {filtrePeriodeType !== "__all__" && (
            <Select
              value={filtrePeriodeValeur}
              onValueChange={setFiltrePeriodeValeur}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={`Choisir ${filtrePeriodeType}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Toutes</SelectItem>
                {(filtrePeriodeType === "annee"
                  ? uniqueYears
                  : filtrePeriodeType === "mois"
                  ? uniqueMonths
                  : uniqueWeeks
                ).map((p) => (
                  <SelectItem key={String(p)} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button variant="outline" onClick={resetFiltres}>
            Réinitialiser
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="flex items-center">
                Catégorie
                <Button
                  type="button"
                  variant="outline"
                  onClick={RedirectionCategories}
                  className="ml-2 w-6 h-6"
                  size="sm"
                >
                  <Pencil />
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
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
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
                    {t.clientId ? recupererNomClient(t.clientId) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "capitalize",
                        !t.statut
                          ? "bg-gray-100 text-gray-500"
                          : t.statut === "Payé"
                          ? "bg-green-100 text-green-800"
                          : t.statut === "En_attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
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
