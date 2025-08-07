// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import TableauBord from "./Pages/TableauBord";
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
          <Route index element={<TableauBord/>}/>
          <Route path="clients" element={<Clients/>} />
          <Route path="transactions" element={<Transactions/>} />
          <Route path="categories" element={<Categories/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
