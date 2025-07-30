import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CalendarIcon, Save, X, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

// Formulaire pour les transactions (CRUD)
export default function TransactionForm({
  transaction,
  clients,
  onSave,
  onCancel,
  onDelete,
}) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    id: transaction?.id || undefined,
    type: transaction?.type || "revenu",
    categorie: transaction?.categorie || undefined,
    description: transaction?.description || "",
    montant: transaction?.montant || "",
    date: transaction?.date || new Date().toISOString().split("T")[0],
    statut: transaction?.statut || "",
    client_id: transaction?.client_id || "none",
    facture_numero: transaction?.facture_numero || "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories?type=${form.type}`);
        if (!response.ok)
          throw new Error("Erreur lors du chargement des catégories.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [form.type]);

  const gereChangement = (champ, valeur) => {
    setForm({ ...form, [champ]: valeur });
  };

  const gereEnvoie = (e) => {
    e.preventDefault();
    const donneesEnvoyees = {
      ...form,
      montant: parseFloat(form.montant),
      client_id: form.client_id === "none" ? null : form.client_id,
    };
    onSave(donneesEnvoyees);
  };

  const gereSuppression = () => {
    if (transaction?.id && onDelete) {
      const confirmation = window.confirm(
        "Êtes-vous sûr·e de vouloir supprimer cette transaction ?"
      );
      if (confirmation) {
        onDelete(transaction.id);
      }
    }
  };

  const navigate = useNavigate();
  const RedirectionCategories = () => navigate("/categories");

  return (
    <form onSubmit={gereEnvoie} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) => gereChangement("type", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenu">Revenu</SelectItem>
              <SelectItem value="depense">Dépense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center">
            <Label>Catégorie</Label>
            <Button
              type="button"
              variant="outline"
              onClick={RedirectionCategories}
              className="ml-2 h-5 mb-1"
              size="sm"
            >
              Modifier
            </Button>
          </div>
          <div className="mt-1">
            <Select
              value={form.categorie}
              onValueChange={(v) => gereChangement("categorie", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie..." />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nom}>
                      {cat.nom.charAt(0).toUpperCase() + cat.nom.slice(1)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    Aucune catégorie disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={form.description}
          onChange={(e) => gereChangement("description", e.target.value)}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Montant ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.montant}
            onChange={(e) => gereChangement("montant", e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Date</Label>
          <div className="relative w-full">
            <input
              type="date"
              value={form.date}
              onChange={(e) => gereChangement("date", e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-white px-3 text-black text-base shadow-sm focus-visible:outline-none focus-visible:ring-1"
            />
            <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-black pointer-events-none mr-[7px]" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Statut</Label>
          <Select
            value={form.statut}
            onValueChange={(v) => gereChangement("statut", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Payé">Payé</SelectItem>
              <SelectItem value="En_attente">En attente</SelectItem>
              <SelectItem value="En_retard">En retard</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Client (optionnel)</Label>
          <Select
            value={form.client_id || "none"}
            onValueChange={(v) => gereChangement("client_id", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.prenom} {c.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>

        {form.id && (
          <Button type="button" variant="destructive" onClick={gereSuppression}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        )}

        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
