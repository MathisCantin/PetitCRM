import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";

import ClientForm from "@/Components/Clients/ClientForm";
import ClientList from "@/Components/Clients/ClientsListe";
import ClientResume from "@/Components/Clients/ClientsResume";

// Page pour gérer les clients
export default function ClientPage() {
  const [clients, setClients] = useState([]);
  const [clientEnEdition, setClientEnEdition] = useState(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    chargerClients();
  }, []);

  const chargerClients = async () => {
    setChargement(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
    setChargement(false);
  };

  const gererAjout = () => {
    setClientEnEdition(null);
    setAfficherFormulaire(true);
  };

  const gererEdition = (client) => {
    setClientEnEdition(client);
    setAfficherFormulaire(true);
  };

  const gererSauvegarde = async (client) => {
    try {
      const method = clientEnEdition ? "PUT" : "POST";
      const url = clientEnEdition
        ? `/api/clients/${clientEnEdition.id}`
        : "/api/clients";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });

      console.log(JSON.stringify(client));
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

      await chargerClients();
      setAfficherFormulaire(false);
      setClientEnEdition(null);
    } catch (err) {
      console.error(err);
      throw new Error("Erreur lors de la sauvegarde");
    }
  };

  const gererSuppression = async (id) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      await chargerClients();
      setAfficherFormulaire(false);
      setClientEnEdition(null);
    } catch (err) {
      console.error(err);
      throw new Error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="p-2 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-stone-600">Gérez vos contacts et prospects.</p>
        </div>

        <Button onClick={gererAjout}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <ClientResume clients={clients} />

      <ClientList
        clients={clients}
        enChargement={chargement}
        onEdit={gererEdition}
      />

      <Dialog open={afficherFormulaire} onOpenChange={setAfficherFormulaire}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {clientEnEdition ? "Modifier le client" : "Nouveau client"}
            </DialogTitle>
          </DialogHeader>

          <ClientForm
            client={clientEnEdition}
            onSave={gererSauvegarde}
            onCancel={() => setAfficherFormulaire(false)}
            onDelete={gererSuppression}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}