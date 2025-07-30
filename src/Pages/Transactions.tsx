import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";

import TransactionForm from "@/Components/Transactions/TransactionForm";
import TransactionsListe from "@/Components/Transactions/TransactionsListe";
import TransactionResume from "@/Components/Transactions/TransactionResume";

//Page pour gérer les transactions
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [transactionEnEdition, setTransactionEnEdition] = useState(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const resTransactions = await fetch("/api/transactions");
      const dataTransactions = await resTransactions.json();
      setTransactions(dataTransactions);

      const resClients = await fetch("/api/clients");
      const dataClients = await resClients.json();
      setClients(dataClients);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
    setChargement(false);
  };

  const gererEdition = (transaction) => {
    setTransactionEnEdition(transaction);
    setAfficherFormulaire(true);
  };

  const gererAjout = () => {
    setTransactionEnEdition(null);
    setAfficherFormulaire(true);
  };

  const gererSauvegarde = async (transaction) => {
    try {
      const method = transactionEnEdition ? "PUT" : "POST";
      const url = transactionEnEdition
        ? `/api/transactions/${transactionEnEdition.id}`
        : "/api/transactions";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

      await chargerDonnees();
      setAfficherFormulaire(false);
      setTransactionEnEdition(null);
    } catch (err) {
      console.error(err);
    }
  };

  const gererSuppression = async (id) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      await chargerDonnees();
      setAfficherFormulaire(false);
      setTransactionEnEdition(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-stone-600">Gérez vos revenus et dépenses.</p>
        </div>

        <Button onClick={gererAjout}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle transaction
        </Button>
      </div>

      <TransactionResume transactions={transactions} />

      <TransactionsListe
        transactions={transactions}
        clients={clients}
        enChargement={chargement}
        onEdit={gererEdition}
      />

      <Dialog open={afficherFormulaire} onOpenChange={setAfficherFormulaire}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionEnEdition
                ? "Modifier la transaction"
                : "Nouvelle transaction"}
            </DialogTitle>
          </DialogHeader>

          <TransactionForm
            transaction={transactionEnEdition}
            clients={clients}
            onSave={gererSauvegarde}
            onCancel={() => setAfficherFormulaire(false)}
            onDelete={gererSuppression}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
