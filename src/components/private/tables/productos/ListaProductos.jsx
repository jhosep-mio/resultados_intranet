import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import { RiFilter2Fill } from "react-icons/ri";
import { Loading } from "../../../shared/Loading";
import { Paginacion } from "../../../shared/Paginacion";

export const ListaProductos = () => {
  const { auth } = useAuth({});
  let token = localStorage.getItem("token");

  const [productos, setProductos] = useState([]);
  const { title, setTitle } = useAuth({});
  const [loading, setLoading] = useState(true);
  const [itemPagination, setItemPagination] = useState([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaActual, setpaginaActual] = useState(1);
  const [search, setSearch] = useState("");
  const [cantidadRegistros] = useState(5);
  const [servicios, setservicios] = useState([]);

  const navigate = useNavigate();

  const getAllProductos = async () => {
    const request = await axios.get(
      `${Global.url}/allOrdenVirtualesPacientes/${auth.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProductos(request.data);
    setTotalRegistros(request.data.length);
  };

  const getAllservicios = async () => {
    const request = await axios.get(`${Global.url}/allServicios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setservicios(request.data);
    setLoading(false);
  };

  useEffect(() => {
    setTitle("LISTADO DE RESULTADOS");
    getAllProductos();
    getAllservicios();
  }, []);

  const indexOfLastPost = paginaActual * cantidadRegistros;
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros;
  let totalPosts = productos.length;

  function quitarAcentos(cadena) {
    const acentos = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",
      Á: "A",
      É: "E",
      Í: "I",
      Ó: "O",
      Ú: "U",
    };
    return cadena
      .split("")
      .map((letra) => acentos[letra] || letra)
      .join("")
      .toString();
  }

  const filterDate = () => {
    if (search.length === 0) {
      let orden = productos.slice(indexOfFirstPost, indexOfLastPost);
      return orden;
    }

    const filter = productos.filter((odo) => {
      return (
        quitarAcentos(
          `${odo.paciente} ${odo.paciente_apellido_p} ${odo.paciente_apellido_m}`.toLowerCase()
        ).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(new Date(odo.created_at).toLocaleDateString()).includes(
          quitarAcentos(search.toLowerCase())
        ) ||
        odo.id.toString().includes(search)
      );
    });
    totalPosts = filter.length;
    return filter.slice(indexOfFirstPost, indexOfLastPost);
  };

  const onSeachChange = ({ target }) => {
    setpaginaActual(1);
    setSearch(target.value);
  };

  useEffect(() => {
    const filter = productos.filter((odo) => {
      return (
        quitarAcentos(
          `${odo.paciente} ${odo.paciente_apellido_p} ${odo.paciente_apellido_m}`.toLowerCase()
        ).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(new Date(odo.created_at).toLocaleDateString()).includes(
          quitarAcentos(search.toLowerCase())
        ) ||
        odo.id.toString().includes(search)
      );
    });
    setTotalRegistros(filter.length);
  }, [search]);

  return (
    <>
      {auth.id_rol == 0 ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5">
            <div>
              {/* <h1 className="font-bold text-gray-100 text-xl">Lista de Productos</h1> */}
            </div>
           
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="bg-[#fff] p-8 rounded-xl">
                
              <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-4 rounded-md border-b-2 border-solid border-black-50 bg-cuarto ">
                <h5 className="md:text-center text-white">PACIENTE</h5>
                <h5 className="md:text-center text-white">
                  DESCRIPCIÓN DEL ESTUDIO
                </h5>
                <h5 className="md:text-center text-white">FECHA DE CREACIÓN</h5>
              </div>

              {filterDate().map((orden) =>
                orden.id_paciente == auth.id ? (
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 bg-tercer p-4 rounded-xl shadow-sm cursor-pointer"
                    key={orden.id}
                    onClick={(e) => {
                      navigate(`/admin/resultado/${orden.id}`);
                    }}
                  >
                    <div className="md:text-center ">
                      <h5 className="text-black  md:hidden font-bold mb-2 ">
                        Paciente
                      </h5>
                      <p className="line-clamp-2 text-black">
                        {orden.paciente} {orden.paciente_apellido_p}{" "}
                        {orden.paciente_apellido_m}
                      </p>
                    </div>
                    <div className="md:text-center md:flex md:justify-center ">
                      <h5 className="md:hidden text-black font-bold mb-2">
                        Tipo de estudio
                      </h5>
                      <ul style={{ listStyle: "none" }}>
                        {servicios.map((serv, indexserv) =>
                          JSON.parse(orden.impresionServicios).map(
                            (elementos, indexElementos) =>
                              elementos.estado === true &&
                              serv.id === elementos.id_servicio &&
                              orden.id_paciente == auth.id ? (
                                <li key={indexserv} className="text-black">
                                  {serv.nombre}
                                </li>
                              ) : (
                                ""
                              )
                          )
                        )}
                      </ul>
                    </div>
                    <div className="md:text-center">
                      <h5 className="md:hidden text-black font-bold mb-2">
                        Fecha de Creacion
                      </h5>
                      <span className="text-black">
                        {new Date(orden.created_at).toLocaleDateString()} &nbsp;{" "}
                        {new Date(orden.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}

              <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center items-center  md:justify-between content_buttons ">
                <p className="text-md ml-1 text-black flex flex-row">
                  {`${totalRegistros} Registros`} 
                </p>
                  <Paginacion
                    totalPosts={totalPosts}
                    cantidadRegistros={cantidadRegistros}
                    paginaActual={paginaActual}
                    setpaginaActual={setpaginaActual}
                  />
              </div>
            </div>
          )}
        </>
      ) : (
        <Navigate to="/admin/ordenes" />
      )}
    </>
  );
};
