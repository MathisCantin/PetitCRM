import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";
import { Save, X, Trash2 } from "lucide-react";

// Formulaire pour les clients (CRUD)
export default function ClientForm({ client, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({
    id: client?.id,
    nom: client?.nom || "",
    prenom: client?.prenom || "",
    email: client?.email || "",
    telephone: client?.telephone || "",
    adresse: client?.adresse || "",
    ville: client?.ville || "",
    code_postal: client?.code_postal || "",
    pays: client?.pays || "",
    societe: client?.societe || "",
    statut: client?.statut || "Prospect",
  });

  const gereChangement = (champ, valeur) => {
    setForm({ ...form, [champ]: valeur });
  };

  const validateEmail = (email) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  };

  const gereEnvoi = async (e) => {
    e.preventDefault();

    if (form.email && !validateEmail(form.email)) {
      return toast.error("L'email est invalide");
    }

    try {
      await toast.promise(onSave(form), {
        loading: "Enregistrement...",
        success: "Client enregistré avec succès",
        error: "Erreur lors de l'enregistrement",
      });
    } catch (err) {
      toast.error("Erreur inattendue");
    }
  };

  const gereSuppression = async () => {
    if (!client?.id) return;
    const confirmation = window.confirm(
      "Supprimer ce client ? Cette action est irréversible et les transactions liées resteront sans référence au client."
    );
    if (!confirmation) return;

    try {
      await toast.promise(onDelete(client.id), {
        loading: "Suppression...",
        success: "Client supprimé",
        error: "Erreur lors de la suppression",
      });
    } catch {
      toast.error("Erreur inattendue");
    }
  };

  return (
    <form onSubmit={gereEnvoi} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Nom *</Label>
          <Input
            value={form.nom}
            onChange={(e) => gereChangement("nom", e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Prénom *</Label>
          <Input
            value={form.prenom}
            onChange={(e) => gereChangement("prenom", e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => gereChangement("email", e.target.value)}
          />
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input
            value={form.telephone}
            onChange={(e) => gereChangement("telephone", e.target.value)}
          />
        </div>
        <div>
          <Label>Adresse</Label>
          <Input
            value={form.adresse}
            onChange={(e) => gereChangement("adresse", e.target.value)}
          />
        </div>
        <div>
          <Label>Ville</Label>
          <Input
            value={form.ville}
            onChange={(e) => gereChangement("ville", e.target.value)}
          />
        </div>
        <div>
          <Label>Code postal</Label>
          <Input
            value={form.code_postal}
            onChange={(e) => gereChangement("code_postal", e.target.value)}
          />
        </div>
        <div>
          <Label>Pays</Label>
          <Input
            value={form.pays}
            onChange={(e) => gereChangement("pays", e.target.value)}
          />
        </div>
        <div>
          <Label>Société</Label>
          <Input
            value={form.societe}
            onChange={(e) => gereChangement("societe", e.target.value)}
          />
        </div>
        <div>
          <Label>Statut</Label>
          <Select
            value={form.statut}
            onValueChange={(v) => gereChangement("statut", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Actif">Actif</SelectItem>
              <SelectItem value="Inactif">Inactif</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
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
