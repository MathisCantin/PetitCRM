import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Edit, Plus } from "lucide-react";

type Categorie = {
  id: number;
  nom: string;
  type: "revenu" | "depense";
};

interface Props {
  categories: Categorie[];
  type: "revenu" | "depense";
  enChargement?: boolean;
  onEdit: (categorie: Categorie) => void;
  onAdd: (type: "revenu" | "depense") => void;
}

// Liste pour gérer et consulter les catégories
export default function CategoriesListe({
  categories,
  type,
  onEdit,
  onAdd,
  enChargement,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center text-stone-800 font-semibold">
          {`Catégories de ${type}`}
          <Button className="ml-2" size="sm" onClick={() => onAdd(type)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Nom</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enChargement ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.nom}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(cat)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Aucune catégorie.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
