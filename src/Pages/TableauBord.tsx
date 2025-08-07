import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import TransactionResume from "@/Components/Transactions/TransactionsResume";
import ClientResume from "@/Components/Clients/ClientsResume";

const Couleurs = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#d88884",
  "#888888",
  "#84d888",
];

// Page pour avoir un aperçu de toutes les données de l'entreprise
export default function TableauBord() {
  const [soldeParMois, setSoldeParMois] = useState([]);
  const [transactionsParCategorie, setTransactionsParCategorie] = useState([]);
  const [clients, setClients] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/transactions/solde-par-mois")
      .then((res) => res.json())
      .then(setSoldeParMois)
      .catch((err) => console.error("Erreur solde-par-mois:", err));

    fetch("/api/transactions/par-categorie")
      .then((res) => res.json())
      .then(setTransactionsParCategorie)
      .catch((err) => console.error("Erreur transactions-par-categorie:", err));

    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients)
      .catch((err) => console.error("Erreur clients:", err));

    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions)
      .catch((err) => console.error("Erreur transactions:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-4">
      {/* Solde mensuel. Graphique général a l'aide de ChatGPT 
       OpenAI. (2025). ChatGPT (version 6 août 2025) [Modèle massif de langage]. https://chat.openai.com/chat*/}
      <Card>
        <CardHeader>
          <CardTitle>Solde mensuel</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={soldeParMois}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="solde" radius={[4, 4, 0, 0]}>
                {soldeParMois.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.solde >= 0 ? "#4ade80" : "#f87171"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Répartition des transactions par catégorie. Graphique général a l'aide de ChatGPT 
       OpenAI. (2025). ChatGPT (version 6 août 2025) [Modèle massif de langage]. https://chat.openai.com/chat*/}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des dépenses par catégorie</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={transactionsParCategorie}
                dataKey="total"
                nameKey="categorie"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {transactionsParCategorie.map((_, index) => (
                  <Cell
                    key={`cell-pie-${index}`}
                    fill={Couleurs[index % Couleurs.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Résumé des transactions */}
      <TransactionResume transactions={transactions} />

      {/* Résumé des clients */}
      <ClientResume clients={clients} />
    </div>
  );
}
