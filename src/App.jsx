import { useEffect, useLayoutEffect } from "react";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Explore from "./pages/Explore";
import Author from "./pages/Author";
import ItemDetails from "./pages/ItemDetails";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      offset: 200,
      once: false,
    });

    const resetScroll = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("load", resetScroll);

    return () => {
      window.removeEventListener("load", resetScroll);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/author" element={<Author />} />
        <Route path="/item-details" element={<ItemDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;