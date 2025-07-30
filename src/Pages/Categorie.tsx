import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

import CategoriesListe from "@/Components/Transactions/CategorieListe";
import CategorieForm from "@/Components/Transactions/CategorieForm";

// Page pour gérer les catégories
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [categorieEnEdition, setCategorieEnEdition] = useState(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    chargerCategories();
  }, []);

  const chargerCategories = async () => {
    setChargement(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur de chargement des catégories :", err);
      throw new Error("Erreur lors du chargement des catégories");
    }
    setChargement(false);
  };

  const gererEdition = (categorie) => {
    setCategorieEnEdition(categorie);
    setAfficherFormulaire(true);
  };

  const gererAjout = (type) => {
    setCategorieEnEdition({ nom: "", type });
    setAfficherFormulaire(true);
  };

  const gererSauvegarde = async (categorie) => {
    try {
      const method = categorie.id ? "PUT" : "POST";
      const url = categorie.id
        ? `/api/categories/${categorie.id}`
        : "/api/categories";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categorie),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      await chargerCategories();
      setAfficherFormulaire(false);
      setCategorieEnEdition(null);
    } catch (err) {
      console.error(err);
      throw new Error("Erreur lors de la sauvegarde");
    }
  };

  const gererSuppression = async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await chargerCategories();
      setAfficherFormulaire(false);
      setCategorieEnEdition(null);
    } catch (err) {
      console.error(err);
      throw new Error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-stone-600">
            Organisez vos revenus et dépenses par catégories.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CategoriesListe
          categories={categories.filter((c) => c.type === "depense")}
          type="depense"
          onEdit={gererEdition}
          onAdd={gererAjout}
          enChargement={chargement}
        />
        <CategoriesListe
          categories={categories.filter((c) => c.type === "revenu")}
          type="revenu"
          onEdit={gererEdition}
          onAdd={gererAjout}
          enChargement={chargement}
        />
      </div>

      <Dialog open={afficherFormulaire} onOpenChange={setAfficherFormulaire}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categorieEnEdition?.id
                ? "Modifier la catégorie"
                : "Nouvelle catégorie"}
            </DialogTitle>
          </DialogHeader>

          <CategorieForm
            categorie={categorieEnEdition}
            onSave={gererSauvegarde}
            onCancel={() => setAfficherFormulaire(false)}
            onDelete={gererSuppression}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
