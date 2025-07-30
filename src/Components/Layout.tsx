import { Link, Outlet, useLocation } from "react-router-dom";
import { DollarSign, Home } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside
        className="
          fixed bottom-0 left-0 right-0 h-14 bg-stone-100 p-2 flex flex-row items-center justify-center space-x-8 shadow-md
          sm:static sm:h-auto sm:w-60 sm:flex-col sm:items-start sm:justify-start sm:space-x-0 sm:space-y-4 sm:p-6 sm:shadow-r-lg
          transition-all duration-300
          z-20
        "
      >
        <h2 className="hidden sm:block text-lg font-bold text-stone-700 mb-6 whitespace-nowrap">
          Mon entreprise
        </h2>
        <nav className="flex flex-row sm:flex-col gap-6 sm:gap-2 text-stone-700 w-full justify-center sm:justify-start">
          <Link
            to="/"
            className={`flex items-center gap-2 p-2 rounded hover:bg-stone-200 ${
              location.pathname === "/" ? "bg-stone-300 font-semibold" : ""
            }`}
          >
            <Home className="w-5 h-5 text-stone-700" />
            <span className="hidden sm:inline">Accueil</span>
          </Link>
          <Link
            to="/transactions"
            className={`flex items-center gap-2 p-2 rounded hover:bg-stone-200 ${
              location.pathname.startsWith("/transactions")
                ? "bg-stone-300 font-semibold"
                : ""
            }`}
          >
            <DollarSign className="w-5 h-5 text-stone-700" />
            <span className="hidden sm:inline">Transactions</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-1 sm:p-1 overflow-auto pb-16 sm:pb-2">
        <Outlet />
      </main>
    </div>
  );
}
