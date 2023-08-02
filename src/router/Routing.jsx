import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from '../components/public/Login';
import { PrivateLayout } from '../components/private/PrivateLayout';
import { AuthProvider } from '../context/AuthProvider';
import { ListaProductos } from '../components/private/tables/productos/ListaProductos';
import Registro from '../components/public/Registro';
import { Estudios } from '../components/private/tables/productos/Estudios';
import { ListaOrdenes } from '../components/private/tables/productos/ListaOrdenes';
import { Detalle } from '../components/private/tables/productos/Detalle';
import Password from '../components/public/Password';
import { RegistrarPaciente } from '../components/private/tables/productos/RegistrarPaciente';
import { RegistrarOrden } from '../components/private/tables/productos/RegistrarOrden';
import { EditarOrden } from '../components/private/tables/productos/EditarOrden';

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='login' element={<Login/>}/>
            <Route path='registro' element={<Registro/>}/>
            <Route path='password' element={<Password/>}/>

            <Route path='admin' element={<PrivateLayout/>}>
                <Route index element={<ListaProductos/>}/>
                <Route path='resultados' element={<ListaProductos/>}/>
                <Route path='resultado/:id' element={<Estudios/>}/>

                {/* ODONTOLOGOS */}
                <Route path='ordenes' element={<ListaOrdenes/>}/>
                <Route path='orden/:id' element={<Detalle/>}/>
                <Route path='registrar' element={<RegistrarPaciente/>}/>
                <Route path='ordenVirtual/agregar' element={<RegistrarOrden/>}/>
                <Route path='ordenVirtual/editar/:id' element={<EditarOrden/>}/>

            </Route>
            <Route path='*' element={
                <>
                    <p>
                        <h1>ERROR 404</h1>
                    </p>
                </>
            } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    )
}
