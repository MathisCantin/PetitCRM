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

// Liste pour gérer et consulter les transactions
export default function Transactions({
  transactions,
  clients,
  onEdit,
  enChargement,
}) {
  const [filtreType, setFiltreType] = useState("all");
  const [filtreStatut, setFiltreStatut] = useState("all");
  const [filtreClient, setFiltreClient] = useState("all");
  const [filtreCategorie, setFiltreCategorie] = useState("all");
  const [filtrePeriodeType, setFiltrePeriodeType] = useState("all");
  const [filtrePeriodeValeur, setFiltrePeriodeValeur] = useState("all");

  const navigate = useNavigate();
  const RedirectionCategories = () => navigate("/categories");

  const recupererNomClient = (clientId) => {
    const client = clients.find((c) => c.id === Number(clientId));
    return client ? `${client.prenom} ${client.nom}` : "N/A";
  };

  /*Pour les filtres avec des choix pertinents. Fonctionnalité de filtrage aidée par ChatGPT
  OpenAI. (2025). ChatGPT (version 5 août 2025) [Modèle massif de langage]. https://chat.openai.com/chat*/
  const categoriesSet = new Set<string>();
  const anneesSet = new Set<string>();
  const moisSet = new Set<string>();
  const semainesSet = new Set<string>();

  for (const t of transactions) {
    if (t.categorie) categoriesSet.add(t.categorie);

    const date = new Date(t.date);
    anneesSet.add(String(date.getFullYear()));
    moisSet.add(format(date, "yyyy-MM"));
    semainesSet.add(format(date, "yyyy-'S'II", { locale: fr }));
  }

  const categories = Array.from(categoriesSet);
  const annees = Array.from(anneesSet).sort().reverse();
  const mois = Array.from(moisSet).sort().reverse();
  const semaines = Array.from(semainesSet).sort().reverse();

  const resetFiltres = () => {
    setFiltreType("all");
    setFiltreStatut("all");
    setFiltreClient("all");
    setFiltreCategorie("all");
    setFiltrePeriodeType("all");
    setFiltrePeriodeValeur("all");
  };

  const transactionsFiltrer = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const year = tDate.getFullYear();
      const month = format(tDate, "yyyy-MM");
      const week = format(tDate, "yyyy-'S'II", { locale: fr });

      const periodeMatch =
        filtrePeriodeType === "all" ||
        filtrePeriodeValeur === "all" ||
        (filtrePeriodeType === "annee" &&
          filtrePeriodeValeur === String(year)) ||
        (filtrePeriodeType === "mois" && filtrePeriodeValeur === month) ||
        (filtrePeriodeType === "semaine" && filtrePeriodeValeur === week);

      return (
        (filtreType === "all" || t.type === filtreType) &&
        (filtreStatut === "all" || t.statut === filtreStatut) &&
        (filtreClient === "all" || t.clientId === Number(filtreClient)) &&
        (filtreCategorie === "all" || t.categorie === filtreCategorie) &&
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-stone-800">
          Historique des transactions
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4 items-center">
          <Select value={filtreType} onValueChange={setFiltreType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="revenu">Revenu</SelectItem>
              <SelectItem value="depense">Dépense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtreStatut} onValueChange={setFiltreStatut}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Payé">Payé</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="En retard">En retard</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtreClient} onValueChange={setFiltreClient}>
            <SelectTrigger className="w-[145px]">
              <SelectValue placeholder="Filtrer par client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              {clients.map((c) => (
                <SelectItem key={String(c.id)} value={String(c.id)}>
                  {c.prenom} {c.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtreCategorie} onValueChange={setFiltreCategorie}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
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
              setFiltrePeriodeValeur("all");
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Type de période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="annee">Année</SelectItem>
              <SelectItem value="mois">Mois</SelectItem>
              <SelectItem value="semaine">Semaine</SelectItem>
            </SelectContent>
          </Select>

          {filtrePeriodeType !== "all" && (
            <Select
              value={filtrePeriodeValeur}
              onValueChange={setFiltrePeriodeValeur}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={`Choisir ${filtrePeriodeType}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {(filtrePeriodeType === "annee"
                  ? annees
                  : filtrePeriodeType === "mois"
                  ? mois
                  : semaines
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
            ) : transactionsFiltrer.length > 0 ? (
              transactionsFiltrer.map((t) => (
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
                          : t.statut === "En attente"
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
