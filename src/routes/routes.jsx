import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home'
import Products from "../pages/Products";
import Ventas from "../pages/Ventas";
import NavBar from "../components/NavBar";
import Login from "../auth/Login";
import ProtectedRoutes from "./protected.routes";
import Cart from "../pages/Cart";
import Admin from "../pages/Admin";
import ProductsForm from "../pages/ProductsForm";
const Routers = () => {
  return (
    <>
    <BrowserRouter>
    <NavBar/>
      <Routes>
      
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoutes />}> {/* Rutas protegidas */}
        <Route path="/productos" element={<Products />} />
        <Route path="/cart" element={<Cart/>}/> 
        <Route path="/ventas" element={<Ventas />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path='/admin' element={<Admin/>}/>
        <Route path="/producto/create/" element={<ProductsForm/>}/>
        <Route path="/producto/edit/:id" element={<ProductsForm/>}/>
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </>
  );
};


export default Routers