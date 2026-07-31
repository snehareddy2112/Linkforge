import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

type Page = "landing" | "dashboard";

const getPage = (): Page =>
  window.location.pathname.startsWith("/dashboard")
    ? "dashboard"
    : "landing";

export default function App() {
  const [page, setPage] = useState<Page>(getPage);

  useEffect(() => {
    const handleNavigation = () => {
      setPage(getPage());
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  const navigate = (nextPage: Page) => {
    const path = nextPage === "dashboard" ? "/dashboard" : "/";

    window.history.pushState({}, "", path);
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (page === "dashboard") {
    return <Dashboard />;
  }

  return <LandingPage onLaunch={() => navigate("dashboard")} />;
}