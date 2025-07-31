import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/Components/ui/select";
import { Save, X, Trash2 } from "lucide-react";

interface Categorie {
  id?: number;
  type: "revenu" | "depense";
  nom: string;
}

interface Props {
  categorie?: Categorie;
  onSave: (categorie: Categorie) => void;
  onCancel: () => void;
  onDelete?: (id: number) => void;
}

// Formulaire pour les catégorie (CRUD)
export default function CategorieForm({
  categorie,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Categorie>({
    id: categorie?.id,
    type: categorie?.type || "revenu",
    nom: categorie?.nom || "",
  });

  const gereChangement = (champ: keyof Categorie, valeur: string) => {
    setForm({ ...form, [champ]: valeur as any });
  };

  const gereEnvoie = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const gereSuppression = () => {
    if (categorie?.id && onDelete) {
      const confirmation = window.confirm(
        "Êtes-vous sûr·e de vouloir supprimer cette catégorie ?"
      );
      if (confirmation) {
        onDelete(categorie.id);
      }
    }
  };

  return (
    <form onSubmit={gereEnvoie} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) => gereChangement("type", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenu">Revenu</SelectItem>
              <SelectItem value="depense">Dépense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nom de la catégorie</Label>
          <Input
            value={form.nom}
            onChange={(e) => gereChangement("nom", e.target.value)}
            required
            maxLength={55}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>

        {categorie?.id && (
          <Button
            type="button"
            variant="destructive"
            onClick={gereSuppression}
            className="flex items-center"
          >
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Supprimer</span>
          </Button>
        )}

        <Button type="submit">
          <Save className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Enregistrer</span>
        </Button>
      </div>
    </form>
  );
}
