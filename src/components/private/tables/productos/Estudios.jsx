import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import axios from "axios";
import rar from "./../../../../assets/images/admin/zip.png";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import { Loading } from "../../../shared/Loading";
import logo from "./../../../../assets/logo/logo.png";
import { Collapse, initTE } from "tw-elements";
import { saveAs } from "file-saver";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import { Grid, Navigation } from "swiper";
import { RViewer, RViewerTrigger } from "react-viewerjs";
import { RiDownload2Line } from "react-icons/ri";
import { IoFolderOpen } from "react-icons/io5";
export const Estudios = () => {

  const navigate = useNavigate();
  const { auth, setTitle, loadingDowload, descargarImagenes, setId } = useAuth();
  const { id } = useParams();
  let token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [idOrden, setIdOrden] = useState(0);
  const [servicios, setservicios] = useState([]);
  const [idPaciente, setIdPaciente] = useState(0);
  const [nombres, setNombres] = useState("");
  const [idOdontologo, setIdOdontologo] = useState(0);
  const [elementos, setElementos] = useState([]);
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [edad, setEdad] = useState(0);
  const [dni, setDni] = useState(0);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [fecha, setFecha] = useState(0);
  const [varon, setVaron] = useState(false);
  const [mujer, setMujer] = useState(false);
  const [images, setImages] = useState([]);
  const [idServicio, setIdServicio] = useState(0);
  const [informes, setInformes] = useState([]);
  const [descargas, setDescargas] = useState([]);
  const [fecha_at, setFechaAt] = useState("");

  const getOneOrden = async () => {
    setLoading(true);

    const oneOrden = await axios.get(`${Global.url}/oneOrdenVirtual/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!oneOrden.data.verOrden) {
      navigate("/admin/resultados");
    } else if (oneOrden.data.verOrden.id_paciente != auth.id) {
      navigate("/admin/resultados");
    }
    setIdPaciente(oneOrden.data.verOrden.id_paciente);
    setIdOdontologo(oneOrden.data.verOrden.id_odontologo);
    setIdOrden(oneOrden.data.verOrden.id);
    const fecha_at = new Date(oneOrden.data.verOrden.created_at);

    setFechaCreacion(
      `${fecha_at.toLocaleDateString()}  -  ${fecha_at.toLocaleTimeString()}`
    );

    const fechaObjeto = new Date(fecha_at);
    const year = fechaObjeto.getFullYear().toString().padStart(4, "0");
    const month = (fechaObjeto.getMonth() + 1).toString().padStart(2, "0");
    const day = fechaObjeto.getDate().toString().padStart(2, "0");
    const fechaFormateada = `${year}-${month}-${day}`;
    setFechaAt(fechaFormateada);

    setElementos(JSON.parse(oneOrden.data.verOrden.impresionServicios));
    setIdServicio(JSON.parse(oneOrden.data.verOrden.impresionServicios)[0]);

    setNombres(`${auth.nombres} ${auth.apellido_p} ${auth.apellido_m}`);
    setEdad(calcularEdad(auth.f_nacimiento));
    setDni(auth.numero_documento_paciente_odontologo);
    setEmail(auth.correo);

    const fecha_date = new Date(auth.f_nacimiento);
    setFecha(fecha_date.toLocaleDateString());

    setId({
      id,
      nombres: `${auth.nombres} ${auth.apellido_p} ${auth.apellido_m}`,
      fecha_at: fechaFormateada
    })

    if (auth.genero == 0) {
      setVaron(true);
    } else if (auth.genero == 1) {
      setMujer(true);
    }

    const request = await axios.get(`${Global.url}/allServicios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setservicios(request.data);

    setLoading(false);
  };

  function calcularEdad(fecha_nacimiento) {
    let hoy = new Date();
    let cumpleanos = new Date(fecha_nacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    let m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  }

  const getImages = async () => {
    const request = await axios.get(`${Global.url}/verImagenes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setImages(request.data);
  };

  const getRutas = async () => {
    const request = await axios.get(`${Global.url}/veRutas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDescargas(request.data);
  };

  const preguntarDescargaGroup = async () => {
    const existeImagen = images.some((image) => image.id_orden == id);
    const existeinforme = informes.some((image) => image.id_orden == id);
    if (existeImagen || existeinforme) {
      Swal.fire({
        title: `¿Seguro de descargar los resultados de este estudio ? `,
        showDenyButton: true,
        confirmButtonText: "Descargar",
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          descargarImagenes();
        }
      });
    } else {
      Swal.fire("No hay archivos que descargar", "", "error");
    }
  };


  const getInformes = async () => {
    const request = await axios.get(`${Global.url}/verInformes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setInformes(request.data);
  };

  function formatFileName(fileName) {
    const prefixIndex = fileName.indexOf("_");
    if (prefixIndex !== -1) {
      return fileName.substring(prefixIndex + 1);
    }
    return fileName;
  }

  useEffect(() => {
    initTE({ Collapse });
    getOneOrden();
    getImages();
    getRutas();
    getInformes();
    // descargarImagenes();
  }, []);

  useEffect(() => {
    setTitle("DETALLE DEL ESTUDIO");
  }, []);

  const handleSwiperInit = (swiper) => {
    // La función se ejecutará después de que Swiper se haya inicializado
    const botonPrev = document.querySelector(".swiper-button-prev");
    const botonPrev2 = document.querySelector(".swiper-button-next");
    const contenedor = document.querySelector(".contenedor_Aqui");
    contenedor.appendChild(botonPrev);
    contenedor.appendChild(botonPrev2);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (loadingDowload) {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome
        return ""; // This is required for Firefox
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loadingDowload]);

  return (
    <>
      {auth.id_rol == 0 ? (
        loading ? (
          <Loading />
        ) : (
          <form className="bg-gray-50 p-2 md:p-8 rounded-xl relative">
            {!loadingDowload &&
              <button
                type="button"
                className="hidden md:absolute left-0 top-0 md:m-2 lg:m-4 md:flex items-center justify-center gap-2 md:text-base lg:text-lg text-white bg-cuarto px-4 py-1 rounded-lg animate-bounce"
                onClick={() => {
                  preguntarDescargaGroup();
                }}
              >
                <RiDownload2Line /> Descargar resultados
              </button>
            }
            <div className="w-full md:w-2/3 m-auto mb-8 my-2 ">
              <img src={logo} alt="" className="w-full h-auto object-contain" />
            </div>
            {!loadingDowload &&
              <button
                type="button"
                className="w-fit mx-auto flex md:hidden items-center justify-center gap-2 text-base text-white bg-cuarto px-4 py-1 rounded-lg animate-bounce"
                onClick={() => {
                  preguntarDescargaGroup();
                }}
              >
                <RiDownload2Line /> Descargar resultados
              </button>
            }
            <button
              className="group relative cursor-default flex w-full items-center border-0 bg-cuarto px-5 py-4 text-left text-xs md:text-base text-white transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none  [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-cuarto [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] transition-none my-5"
              type="button"
              data-te-collapse-init
              data-te-collapse-collapsed
              aria-expanded="false"
            >
              INFORMACIÓN DEL PACIENTE
            </button>

            <div className="w-full flex flex-col md:flex-row  gap-2">
              <div className="w-full md:w-3/12 flex flex-col md:items-center gap-y-2 mb-2 md:mb-8">
                <div className="w-full">
                  <p className="text-black">
                    Nombres<span className="text-red-500">*</span>
                  </p>
                </div>
                <div className="w-full flex-1">
                  <input
                    type="text"
                    className="w-full py-2 px-4 outline-none rounded-lg bg-[#E9ECEF] text-black"
                    placeholder="Orden"
                    value={nombres}
                    disabled
                  />
                </div>
              </div>

              <div className="w-full md:w-3/12 flex flex-col md:items-center gap-y-2 mb-2 md:mb-8">
                <div className="w-full">
                  <p className="text-black">
                    Fecha de nacimiento<span className="text-red-500">*</span>
                  </p>
                </div>
                <div className="w-full flex-1">
                  <input
                    type="text"
                    className="w-full py-2 px-4 outline-none rounded-lg bg-[#E9ECEF] text-black"
                    placeholder="Orden"
                    value={fecha}
                    disabled
                  />
                </div>
              </div>

              <div className="w-full md:w-2/12 flex flex-col md:items-center gap-y-2 mb-2 md:mb-8">
                <div className="w-full">
                  <p className="text-black">
                    Edad<span className="text-red-500">*</span>
                  </p>
                </div>
                <div className="w-full flex-1">
                  <input
                    type="text"
                    className="w-full py-2 px-4 outline-none rounded-lg bg-[#E9ECEF] text-black"
                    placeholder="Orden"
                    value={edad}
                    disabled
                  />
                </div>
              </div>
              <div className="w-full md:w-2/12 flex flex-col md:items-center gap-y-2 mb-2 md:mb-8">
                <div className="w-full">
                  <p className="text-black">
                    Género<span className="text-red-500">*</span>
                  </p>
                </div>
                <div className="w-full flex-1">
                  <input
                    type="text"
                    className="w-full py-2 px-4 outline-none rounded-lg bg-[#E9ECEF] text-black"
                    placeholder="Orden"
                    value={auth.genero == 0 ? "Masculino" : "Femenino"}
                    disabled
                  />
                </div>
              </div>

              <div className="w-full md:w-3/12 flex flex-col md:items-center gap-y-2 mb-8">
                <div className="w-full">
                  <p className="text-black">
                    Fecha de creación<span className="text-red-500">*</span>
                  </p>
                </div>
                <div className="w-full flex-1">
                  <input
                    type="text"
                    className="w-full py-2 px-4 outline-none rounded-lg bg-[#E9ECEF] text-black"
                    placeholder="Orden"
                    value={fechaCreacion}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div id="accordionExample">
              <div
                className="rounded-b-lg border-b border-neutral-200 bg-white"
                key="imagenes_adquiridas"
              >
                <h2
                  className="accordion-header mb-5 flex items-center bg-cuarto py-1 px-2"
                  id={`heading2`}
                >
                  <button
                    className="group relative cursor-default flex w-full items-center border-0 bg-cuarto px-5 py-3 text-left text-xs md:text-base text-white transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none  [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-cuarto [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] transition-none"
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    aria-expanded="false"
                  >
                    IMÁGENES ADQUIRIDAS
                  </button>
                </h2>
                <div
                  id={`collapse2`}
                  className="!visible"
                  data-te-collapse-item
                  aria-labelledby={`heading2`}
                  data-te-parent="#accordionExample"
                >
                  <div className="px-5 py-4">
                    <div className="d-flex  justify-content-between contenedor_Aqui relative">
                      <div className="mb-3 col-md-12 relative overflow-hidden modeve_aqui">
                        <Swiper
                          onSwiper={handleSwiperInit}
                          navigation={{
                            clickable: true,
                          }}
                          grid={{
                            rows: 1,
                          }}
                          breakpoints={{
                            0: {
                              slidesPerView: 1,
                              spaceBetween: 0,
                              navigation: { clickable: true },
                              grid: {
                                rows: 1,
                              },
                            },
                            400: {
                              slidesPerView: 2,
                              spaceBetween: 20,
                              navigation: { clickable: true },

                              grid: {
                                rows: 1,
                              },
                            },
                            576: {
                              slidesPerView: 3,
                              spaceBetween: 20,
                              navigation: { clickable: true },

                              grid: {
                                rows: 1,
                              },
                            },
                            768: {
                              slidesPerView: 5,
                              spaceBetween: 20,
                              navigation: { clickable: true },

                              grid: {
                                rows: 1,
                              },
                            },
                            972: {
                              slidesPerView: 7,
                              spaceBetween: 20,
                              navigation: { clickable: true },

                              grid: {
                                rows: 1,
                              },
                            },
                          }}
                          modules={[Grid, Navigation]}
                          className="mySwiper swiper_admin_pacientes mx-12"
                        >
                          {images.length > 0 ? (
                            images.map((img, index) =>
                              img.id_orden == id ? (
                                <>
                                <SwiperSlide key={img.id}>
                                    {img.archivo
                                      .split(",")
                                      .map((linea, index) => (
                                        <RViewer
                                          imageUrls={`${Global.urlImages}/imagenes/${linea}`}
                                          key={index}
                                        >
                                          <RViewerTrigger>
                                            <img
                                              src={`${Global.urlImages}/imagenes/${linea}`}
                                              alt={`${linea}`}
                                              style={{
                                                cursor: "pointer",
                                                height: "100px",
                                                objectFit: "cover",
                                                width: "100%",
                                              }}
                                            />
                                          </RViewerTrigger>
                                        </RViewer>
                                      ))}
                                  </SwiperSlide>
                                </>
                              ) : null
                            )
                          ) : (
                            <div className="h-full w-full py-10 ">
                              <p className="text-xs md:text-base text-gray-400 block text-center">
                                NO HAY ARCHIVOS PARA MOSTRAR
                              </p>
                            </div>
                          )}
                        </Swiper>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="rounded-b-lg border-b border-neutral-200 bg-white"
                key="informes_adquiridos"
              >
                <h2
                  className="accordion-header mb-0 flex items-center"
                  id={`heading2`}
                >
                  <button
                    className="group relative cursor-default flex w-full items-center border-0 bg-cuarto px-5 py-3 text-left text-xs md:text-base text-white transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none  [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-cuarto [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] transition-none"
                    type="button"
                    data-te-collapse-init
                    data-te-collapse-collapsed
                    aria-expanded="true"
                  >
                    DESCARGA DE INFORMES
                  </button>
                </h2>
                <div
                  id={`collapse2`}
                  className="!visible"
                  data-te-collapse-item
                  aria-labelledby={`heading2`}
                  data-te-parent="#accordionExample"
                >
                  <div className="px-0 py-4">
                    <div className="w-full p-4 bg-white">
                      <div className="bg-[#fff] rounded-xl">
                        <div className="hidden md:grid bg-[#DCDCDC] grid-cols-1 md:grid-cols-1 justify-center items-center gap-4 mb-5 p-4 rounded-md border-b-2 border-solid border-black-50">
                          <h5 className="md:text-center text-black">
                            Archivo(s)
                          </h5>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {informes.map((info) =>
                            info.id_orden == id
                              ? info.informe.split(",").map((linea, index) => (
                                  <div
                                    className="grid grid-cols-1 md:grid-cols-1 gap-4 items-center justify-center mb-0 bg-white p-4 rounded-xl shadow-sm border"
                                    key={index}
                                  >
                                    <div className="md:text-center flex justify-center items-center">
                                      <p className=" text-black text-center w-full flex items-center justify-center gap-2">
                                        <IoFolderOpen className="text-cuarto" />
                                        <span className="w-full text-left line-clamp-1">
                                          {formatFileName(linea)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                ))
                              : null
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full justify-start mt-3">
              <Link
                to="/admin/resultados"
                className="bg-cuarto px-4 py-2 rounded-md text-white"
              >
                Regresar
              </Link>
            </div>
          </form>
        )
      ) : (
        <Navigate to="/admin/ordenes" />
      )}
    </>
  );
};
