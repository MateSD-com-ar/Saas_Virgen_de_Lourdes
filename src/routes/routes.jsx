import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home'
import Products from "../pages/Products";
import Ventas from "../pages/Ventas";
import NavBar from "../components/NavBar";
import Login from "../auth/Login";
import ProtectedRoutes from "./protected.routes";
const Routers = () => {
  return (
    <>
    <BrowserRouter>
    <NavBar/>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoutes />}> {/* Rutas protegidas */}
        <Route path="/productos" element={<Products />} />
        <Route path="/ventas" element={<Ventas />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};


export default Routers