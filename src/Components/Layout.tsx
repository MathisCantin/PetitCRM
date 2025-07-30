import { Link, Outlet, useLocation } from "react-router-dom";
import { FileText, Home } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-100 p-6 space-y-4 shadow-md">
        <h2 className="text-lg font-bold text-stone-700 mb-6">
          Mon entreprise
        </h2>
        <nav className="flex flex-col gap-2 text-stone-700">
          <Link
            to="/"
            className={`flex items-center gap-2 p-2 rounded hover:bg-stone-200 ${
              location.pathname === "/" ? "bg-stone-300 font-semibold" : ""
            }`}
          >
            <Home className="w-4 h-4 text-stone-700" />
            Accueil
          </Link>
          <Link
            to="/transactions"
            className={`flex items-center gap-2 p-2 rounded hover:bg-stone-200 ${
              location.pathname.startsWith("/transactions")
                ? "bg-stone-300 font-semibold"
                : ""
            }`}
          >
            <FileText className="w-4 h-4 text-stone-700" />
            Transactions
          </Link>
        </nav>
      </aside>

      {/* Page content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
