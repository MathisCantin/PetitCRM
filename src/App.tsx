// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Clients from "./Pages/Clients";
import Transactions from "./Pages/Transactions";
import Categories from "./Pages/Categories";
import { Toaster } from "@/Components/ui/sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h1 className="text-3xl font-bold">Bienvenue !</h1>}/>
          <Route path="clients" element={<Clients />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
