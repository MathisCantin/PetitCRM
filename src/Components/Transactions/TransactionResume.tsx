import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

// Synthèse financière qui calcule le total des revenus, des dépenses et affiche le solde
export default function TransactionResume({ transactions }) {
  const revenus = transactions
    .filter(t => t.type === 'revenu')
    .reduce((sum, t) => sum + t.montant, 0);

  const depenses = transactions
    .filter(t => t.type === 'depense')
    .reduce((sum, t) => sum + t.montant, 0);

  const solde = revenus - depenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center p-4 gap-4">
          <CardTitle className="text-sm font-medium text-stone-600">Revenus</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{revenus.toFixed(2)}$</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center p-4 gap-4">
          <CardTitle className="text-sm font-medium text-stone-600">Dépenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{depenses.toFixed(2)}$</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center p-4 gap-4">
          <CardTitle className="text-sm font-medium text-stone-600">Solde</CardTitle>
          <Wallet className={`h-4 w-4 ${solde >= 0 ? 'text-green-500' : 'text-red-500'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>{solde.toFixed(2)}$</div>
        </CardContent>
      </Card>
    </div>
  );
}