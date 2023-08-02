import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import { RiFilter2Fill } from "react-icons/ri";
import { Loading } from "../../../shared/Loading";
import { Modal, initTE } from "tw-elements";
import { Paginacion } from "../../../shared/Paginacion";

export const ListaOrdenes = () => {
  const { auth } = useAuth({});
  let token = localStorage.getItem("token");
  initTE({ Modal });
  const [productos, setProductos] = useState([]);
  const {  setTitle } = useAuth({});
  const [loading, setLoading] = useState(true);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaActual, setpaginaActual] = useState(1);
  const [search, setSearch] = useState("");
  const [cantidadRegistros] = useState(4);
  const [servicios, setservicios] = useState([]);

  const navigate = useNavigate();

  const getAllProductos = async () => {
    const request = await axios.get(
      `${Global.url}/allOrdenesOdontologos/${auth.id}`,
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
    setTitle("LISTADO DE RESULTADOS DE SUS PACIENTES");
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
        quitarAcentos(
          `${odo.odontologo} ${odo.odontologo_apellido_p} ${odo.odontologo_apellido_m}`.toLowerCase()
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
    const filter2 = productos.filter((pro) => {
      return quitarAcentos(pro.paciente.toLowerCase()).includes(
        quitarAcentos(search.toLowerCase())
      );
    });
    setTotalRegistros(filter2.length);
  }, [search]);

  return (
    <>
      {auth.id_rol == 1 ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-3">
            <div>
              {/* <h1 className="font-bold text-gray-100 text-xl">Lista de Productos</h1> */}
            </div>
            <div className="w-full md:w-fit flex flex-col-reverse md:flex-row items-center gap-4 ">
              <button className="bg-white hover:bg-gray-100 w-full md:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
                <RiFilter2Fill />{" "}
                <input
                  placeholder="Buscar ..."
                  className="bg-transparent outline-none"
                  value={search}
                  onChange={onSeachChange}
                  type="search"
                />
              </button>
              <Link
                to={"/admin/registrar"}
                className="w-full  md:w-fit inline-block rounded bg-[#675b8a] px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-main-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-main-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-main-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              >
                CREAR ORDEN VIRTUAL
              </Link>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="bg-[#fff] p-8 rounded-xl">
              <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-4 rounded-md border-b-2 border-solid border-black-50 bg-[#675b8a] ">
                <h5 className="md:text-center text-white">PACIENTE</h5>
                <h5 className="md:text-center text-white">
                  DESCRIPCIÓN DEL ESTUDIO
                </h5>
                <h5 className="md:text-center text-white">FECHA DE CREACIÓN</h5>
              </div>

              {filterDate().map((orden) =>
                orden.id_odontologo == auth.id ? (
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 bg-tercer p-4 rounded-xl shadow-sm cursor-pointer"
                    key={orden.id}
                    onClick={(e) => {
                      navigate(`/admin/orden/${orden.id}`);
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
                              orden.id_odontologo == auth.id ? (
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
        <Navigate to="/admin/resultados" />
      )}
    </>
  );
};
