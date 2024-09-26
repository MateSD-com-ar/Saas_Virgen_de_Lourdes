import { BrowserRouter, Routes, Route } from "react-router-dom";
import Ventas from "../pages/Ventas";
import NavBar from "../components/NavBar";
import Login from "../auth/Login";
import ProtectedRoutes from "./protected.routes";
import Cart from "../pages/Cart";
import Admin from "../pages/Admin";
import ProductsForm from "../pages/ProductsForm";
import Employ from "../pages/Employ";
import EmployForm from "../pages/EmployForm";
import Checkout from "../pages/Checkout";
import VentaDetails from "../pages/VentaDetails";
import Gastos from "../pages/Gastos";
import GastosForm from "../pages/GastosForm";
import VentasPdfDetails from "../pages/VentasPdfDetails";
import Resumen from "../pages/Resumen";
const Routers = () => {
  return (
    <>
    <BrowserRouter>
    <NavBar/>
      <Routes>
      
        <Route element={<ProtectedRoutes />}> {/* Rutas protegidas */}
        <Route path="/" element={<Ventas />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/gastos/create" element={<GastosForm />} />
        <Route path="/gastos/edit/:id" element={<GastosForm />} />
        <Route path="/cart" element={<Cart/>}/> 
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path='/venta/:id' element={<VentaDetails/>}/>
        <Route path="/venta/details/:id" element={<VentasPdfDetails />}/>
        <Route path="/ventas/details/:id" element={<Checkout/>}/>
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/resumen' element={<Resumen/>}/>
        <Route path='/empleados' element={<Employ/>}/>
        <Route path='/empleados/create' element={<EmployForm/>}/>
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