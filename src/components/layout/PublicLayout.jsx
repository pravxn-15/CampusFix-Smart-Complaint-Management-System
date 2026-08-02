import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import PageTransition from "./PageTransition";

export default function PublicLayout() {
  const location = useLocation();
  return (
    <div>
      <PublicNavbar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
      <PublicFooter />
    </div>
  );
}
