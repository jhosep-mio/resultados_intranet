import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Global } from "../../../../helper/Global";
import Swal from "sweetalert2";
import { RiEditFill } from "react-icons/ri";
import { Errors } from "../../../shared/Errors";
import { Loading } from "../../../shared/Loading";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const RegistrarPaciente = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { auth, setTitle } = useAuth({});
  const [fecha, setFecha] = useState("");
  let token = localStorage.getItem("token");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loged, setLoged] = useState("");
  const [tipo_documento, setTipo_documento] = useState("");
  const [numero_documento, setNumero_documento] = useState("");
  const [genero, setGenero] = useState(false);
  const [validarEdad, setValidarEdad] = useState(true);

  const [open, setOpen] = React.useState(false);

  const minYear = 1900;
  const maxYear = new Date().getFullYear();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validarPaciente = async (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append("tipo_documento_paciente_odontologo", tipo_documento);
    data.append("numero_documento_paciente_odontologo", numero_documento);
    data.append("_method", "POST");

    try {
      let respuesta = await axios.post(`${Global.url}/validarPaciente`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (respuesta.data.status === "success") {
        localStorage.removeItem("paciente");
        localStorage.setItem(
          "paciente",
          JSON.stringify(respuesta.data.paciente)
        );
        const data2 = new FormData();
        data2.append("id_paciente", 1);
        data2.append("id_odontologo", 1);
        data2.append("_method", "POST");

        let verificacion = await axios.post(
          `${Global.url}/verificarOrden`,
          data2,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          verificacion.data.status == "succes" &&
          verificacion.data.message == "orden_creada"
        ) {
          Swal.fire({
            title: "Ya existe una orden creada para este paciente",
            showDenyButton: true,
            denyButtonText: `Cerrar`,
            confirmButtonText: "Editar Orden",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              navigate(`/admin/ordenVirtual/editar/${verificacion.data.npx}`);
            }
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Paciente Encontrado",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/admin/ordenVirtual/agregar");
          }, 1500);
        }
      } else if (respuesta.data.status === "invalid") {
        Swal.fire({
          title: "EL PACIENTE NO EXISTE",
          showDenyButton: true,
          denyButtonText: `Volver a Intentarlo`,
          confirmButtonText: "Agregar Paciente",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            setOpen(true);
          }
        });
      } else {
        Swal.fire({
          title: "EL PACIENTE NO EXISTE",
          showDenyButton: true,
          denyButtonText: `Volver a Intentarlo`,
          confirmButtonText: "Agregar Paciente",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            setOpen(true);
          }
        });
        setLoged("noexiste");
      }
    } catch (error) {}
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

  const indentificarGenero = (event) => {
    setGenero(event.target.value == 1 ? true : false);
  };

  const identificarmenor = (event) => {
    if (calcularEdad(event.target.value) >= 18) {
      setValidarEdad(true);
    } else {
      setValidarEdad(false);
    }
  };

  const savePaciente = async (datas) => {
    if (fecha) {
      setLoading(true);
      const data = new FormData();
      data.append("id_rol", 0);
      data.append("nombres", datas.nombres);
      data.append("apellido_p", datas.apellido_p);
      data.append("apellido_m", datas.apellido_m);
      data.append("f_nacimiento", fecha);

      data.append(
        "nombre_apoderado",
        datas.nombre_apoderado == null ? "" : datas.nombre_apoderado
      );
      data.append(
        "tipo_documento_apoderado",
        datas.tipo_documento_apoderado == null
          ? 0
          : datas.tipo_documento_apoderado
      );
      data.append(
        "documento_apoderado",
        datas.documento_apoderado == null ? "" : datas.documento_apoderado
      );

      data.append(
        "tipo_documento_paciente_odontologo",
        datas.tipo_documento_paciente_odontologo
      );
      data.append(
        "numero_documento_paciente_odontologo",
        datas.numero_documento_paciente_odontologo
      );
      data.append("celular", datas.celular);
      data.append("correo", datas.correo);
      data.append("genero", datas.genero);
      datas.embarazada
        ? data.append("embarazada", datas.embarazada)
        : data.append("embarazada", 0);
      data.append("enfermedades", datas.enfermedades);
      data.append("discapacidades", datas.discapacidades);
      data.append("paciente_especial", datas.paciente_especial);

      try {
        let respuesta = await axios.post(`${Global.url}/savePaciente`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (respuesta.data.status === "success") {
          localStorage.removeItem("paciente");
          localStorage.setItem(
            "paciente",
            JSON.stringify(respuesta.data.paciente)
          );
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Paciente Agregado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            navigate("/admin/ordenVirtual/agregar");
          }, 1500);
        } else {
          Swal.fire("Error al agregar el registro", "", "error");
        }
      } catch (error) {
        if (
          error.request.response.includes(
            "El tipo de documento y numero de documento ya estan registrados para otro cliente"
          )
        ) {
          Swal.fire("Documento ya registrado.", "", "error");
        } else if (
          error.request.response.includes(
            `Duplicate entry '${watch("celular")}' for key 'celular'`
          )
        ) {
          Swal.fire("Celular ya registrado.", "", "error");
        } else if (
          error.request.response.includes(
            `Duplicate entry '${watch("cop")}' for key 'odontologos_cop_unique'`
          )
        ) {
          Swal.fire("COP ya registrado.", "", "error");
        } else if (
          error.request.response.includes(
            `Duplicate entry '${watch("correo")}' for key 'correo'`
          )
        ) {
          Swal.fire("Correo ya registrado.", "", "error");
        } else if (
          error.request.response.includes("The nombres format is invalid")
        ) {
          Swal.fire("Nombre inválido.", "", "error");
        } else if (
          error.request.response.includes("The apellido p format is invalid")
        ) {
          Swal.fire("Apellido paterno inválido.", "", "error");
        } else if (
          error.request.response.includes("The apellido m format is invalid")
        ) {
          Swal.fire("Apellido materno inválido.", "", "error");
        } else if (error.request.response.includes("The celular must")) {
          Swal.fire("Celular inválido.", "", "error");
        } else if (
          error.request.response.includes("The cop must be at least 10000")
        ) {
          Swal.fire("El cop debe ser mayor a 4 digitos.", "", "error");
        } else {
          Swal.fire("Error no encontrado.", "", "error");
        }
      }
    } else {
      Swal.fire("Debe colocar la fecha de nacimiento.", "", "warning");
    }
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key == "Enter") {
      event.preventDefault(); // Detener la acción predeterminada (enviar el formulario)
      // Aquí puedes realizar cualquier acción que desees al presionar Enter en el input
      validarPaciente(event);
    }
  };

  useEffect(() => {
    setTitle("VALIDAR PACIENTE");
  }, []);

  const handleChange = (selectedDate) => {
    if (selectedDate == null) {
      // Si se ha borrado la fecha, realiza las acciones necesarias
      setFecha(null);
      setValidarEdad(true);
      return;
    }

    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const mon = selectedDate.getMonth().toString();

      // Verificar si el año tiene 4 dígitos
      if (year.toString().length > 4) {
        Swal.fire("Fecha inválida", "", "warning");
        setValidarEdad(true);
        return;
      }

      const today = new Date();
      // Calcular diferencia en años
      const diffInYears = Math.floor(
        (today - selectedDate) / (365.25 * 24 * 60 * 60 * 1000)
      );

      // Verificar si es mayor de edad
      if (diffInYears < 18 && diffInYears >= 0) {
        setValidarEdad(false);
      } else {
        setValidarEdad(true);
      }

      setFecha(selectedDate);
    }
  };

  return (
    <>
      {auth.id_rol == 1 ? (
        <>
          <button
            type="button"
            className="hidden w-1/2 md:w-fit  rounded bg-cuarto px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-main-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-main-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-main-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            data-te-toggle="modal"
            id="clickbuttonpaciente"
            data-te-target="#registerpaciente"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            abrir paciente
          </button>
          {loading ? (
            <Loading />
          ) : (
            <form
              onSubmit={validarPaciente}
              className="w-full md:w-[70%] mx-auto mt-10"
            >
              <div className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                <div className="flex flex-shrink-0 items-center bg-[#675b8a] justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                  <h5 className="text-xl font-medium leading-normal text-white 200 text-center w-full">
                    VERIFICAR REGISTRO
                  </h5>
                </div>

                <div className="relative p-4 bg-white">
                  <div className="flex flex-col w-full gap-2 relative">
                    <div className="w-full relative">
                      <select
                        type="text"
                        className="py-3 pl-4 pr-4 bg-gray-200 text-black w-full outline-none rounded-lg"
                        value={tipo_documento}
                        autoFocus
                        required
                        onChange={(e) => {
                          setTipo_documento(e.target.value);
                        }}
                      >
                        <option value="">Seleccionar</option>
                        <option value="0">DNI</option>
                        <option value="1">RUC</option>
                        <option value="2">Pasaporte</option>
                        <option value="3">Carnet de Extranjería</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-2 relative mt-4">
                    <div className="w-full relative">
                      <input
                        type="text"
                        name="fecha"
                        autoFocus
                        required
                        value={numero_documento}
                        onKeyPress={handleKeyPress}
                        onChange={(e) => {
                          setNumero_documento(e.target.value);
                        }}
                        className="py-3 pl-4 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black"
                        placeholder="Número de documento"
                      />
                    </div>
                  </div>
                </div>
                {loged == "invalid" ? (
                  <p className="text-red-600 bg-white px-4">
                    El tipo de documento es incorrecto
                  </p>
                ) : (
                  ""
                )}
                <div className="flex bg-white flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50 gap-2">
                  <Link
                    to={"/admin/ordenes"}
                    className="inline-block rounded bg-gray-400 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-main-accent-100 focus:bg-main-accent-100 focus:outline-none focus:ring-0 active:bg-main-accent-200"
                  >
                    Regresar
                  </Link>
                  <input
                    type="submit"
                    value={"Validar"}
                    className="cursor-pointer inline-block rounded bg-[#675b8a] px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-main-accent-100 focus:bg-main-accent-100 focus:outline-none focus:ring-0 active:bg-main-accent-200"
                  />
                </div>
              </div>
            </form>
          )}

          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            className="p-0"
          >
            <DialogContent>
              <DialogContentText
                id="alert-dialog-slide-description"
                className="p-0"
              >
                {loading ? (
                  <Loading />
                ) : (
                  <form
                    onSubmit={handleSubmit(savePaciente)}
                    className="pointer-events-auto relative flex w-full items-end-end flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600"
                  >
                    <div className="flex flex-shrink-0 items-center bg-main justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                      <h5
                        className="text-xl font-medium leading-normal text-white 200 text-center w-full"
                        id="exampleModalScrollableLabel"
                      >
                        REGISTRAR PACIENTE
                      </h5>
                      <button
                        type="button"
                        className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                        data-te-modal-dismiss
                        aria-label="Close"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="relative p-4 bg-white max-h-96 md:max-h-max overflow-y-scroll ">
                      <div className="relative mb-2 flex flex-col md:flex-row gap-2 items-start">
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <input
                              type="text"
                              name="nombres"
                              {...register("nombres", {
                                required: "Campo requerido",
                                pattern: {
                                  value: /^[^0-9]+$/i,
                                  message: "Nombre invalido",
                                },
                              })}
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              placeholder="Nombres"
                            />
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <p className="text-sm p-0 m-0">
                            {errors.nombres && (
                              <span className="text-main">
                                {errors.nombres.message}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <input
                              type="text"
                              name="apellido_p"
                              {...register("apellido_p", {
                                required: "Campo requerido",
                                pattern: {
                                  value: /^[^0-9]+$/i,
                                  message: "Apellido paterno invalido",
                                },
                              })}
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              placeholder="Apellido paterno"
                            />
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <p className="text-sm p-0 m-0">
                            {errors.apellido_p && (
                              <span className="text-main">
                                {errors.apellido_p.message}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="relative mb-2 flex flex-col md:flex-row gap-2 items-start">
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <input
                              type="text"
                              name="apellido_m"
                              {...register("apellido_m", {
                                required: "Campo requerido",
                                pattern: {
                                  value: /^[^0-9]+$/i,
                                  message: "Apellido materno invalido",
                                },
                              })}
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              placeholder="Apellido Materno"
                            />
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <p className="text-sm p-0 m-0">
                            {errors.apellido_m && (
                              <span className="text-main">
                                {errors.apellido_m.message}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <input
                              type="number"
                              name="celular"
                              {...register("celular", {
                                required: "Campo requerido",
                                pattern: {
                                  value: /^\d{9}$/i,
                                  message: "Celular invalido",
                                },
                              })}
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              placeholder="Celular"
                            />
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <p className="text-sm p-0 m-0">
                            {errors.celular && (
                              <span className="text-main">
                                {errors.celular.message}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="relative mb-2 flex flex-col md:flex-row gap-2 items-start">
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <select
                              type="text"
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              autoFocus
                              required
                              {...register(
                                "tipo_documento_paciente_odontologo",
                                {
                                  required: true,
                                }
                              )}
                            >
                              <option value="0">DNI</option>
                              <option value="1">RUC</option>
                              <option value="2">Pasaporte</option>
                              <option value="3">Carnet de Extranjería</option>
                            </select>
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <Errors
                            error={errors.tipo_documento_paciente_odontologo}
                          />
                        </div>
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <input
                              type="text"
                              {...register(
                                "numero_documento_paciente_odontologo",
                                {
                                  required: true,
                                }
                              )}
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              placeholder="Número de documento"
                            />
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <Errors
                            error={errors.numero_documento_paciente_odontologo}
                          />
                        </div>
                      </div>

                      <div className="relative mb-2 flex flex-col md:flex-row gap-2 items-start">
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <DatePicker
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              selected={fecha}
                              value={fecha}
                              onChange={handleChange}
                              dateFormat="dd/MM/yyyy"
                              locale={es}
                              showYearDropdown
                              scrollableYearDropdown
                              minDate={new Date(minYear, 0, 1)}
                              maxDate={new Date(maxYear, 11, 31)}
                              yearDropdownItemNumber={100}
                              yearDropdownScrollable
                              isClearable={true}
                            />
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <Errors error={errors.fecha} />
                        </div>
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <input
                              type="text"
                              {...register("correo", {
                                required: true,
                                pattern:
                                  /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
                              })}
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              placeholder="Correo electronico"
                            />
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main " />
                          </div>
                          <Errors error={errors.correo} />
                        </div>
                      </div>
                      <div className="relative mb-2 flex flex-col md:flex-row gap-2 items-start">
                        <div className="flex flex-col w-full gap-2 relative">
                          <label htmlFor="" className="text-black">
                            Género
                          </label>
                          <div className="w-full relative">
                            <select
                              type="text"
                              className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              {...register("genero", {
                                required: true,
                              })}
                              onChange={indentificarGenero}
                            >
                              <option value="0">Masculino</option>
                              <option value="1">Femenino</option>
                            </select>
                            <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                          </div>
                          <Errors error={errors.genero} />
                        </div>
                        {genero ? (
                          <div className="flex flex-col w-full gap-2 relative">
                            <label htmlFor="" className="text-black">
                              ¿Estás embarazada?
                            </label>

                            <div className="w-full relative">
                              <select
                                type="text"
                                {...register("embarazada", {
                                  required: true,
                                })}
                                className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              >
                                <option value="">Seleccionar</option>
                                <option value="1">Si</option>
                                <option value="0">No</option>
                              </select>

                              <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main " />
                            </div>
                            <Errors error={errors.embarazada} />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      {validarEdad ? (
                        ""
                      ) : (
                        <>
                          <label className="mt-1 bg-main rounded-tr-md rounded-tl-md px-3 py-1 inline-block text-white">
                            Datos del apoderado
                          </label>
                          <div className="flex flex-col w-full gap-2 relative">
                            <div className="w-full relative">
                              <input
                                type="text"
                                name="nombres"
                                {...register("nombre_apoderado", {
                                  required: "Campo requerido",
                                  pattern: {
                                    value: /^[^0-9]+$/i,
                                    message: "Nombre invalido",
                                  },
                                })}
                                className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                                placeholder="Nombres del apoderado"
                              />
                              <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                            </div>
                            <p className="text-sm p-0 m-0">
                              {errors.nombre_apoderado && (
                                <span className="text-main">
                                  {errors.nombre_apoderado.message}
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="text-sm p-0 m-0">
                            {errors.apellido_p && (
                              <span className="text-main">
                                {errors.apellido_p.message}
                              </span>
                            )}
                          </p>
                          <div className="relative mb-2 flex flex-col md:flex-row gap-2 items-start">
                            <div className="flex flex-col w-full gap-2 relative">
                              <div className="w-full relative">
                                <select
                                  type="text"
                                  className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                                  autoFocus
                                  required
                                  {...register("tipo_documento_apoderado", {
                                    required: true,
                                  })}
                                >
                                  <option value="0">DNI</option>
                                  <option value="1">RUC</option>
                                  <option value="2">Pasaporte</option>
                                  <option value="3">
                                    Carnet de Extranjería
                                  </option>
                                </select>
                                <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                              </div>
                              <Errors error={errors.tipo_documento_apoderado} />
                            </div>
                            <div className="flex flex-col w-full gap-2 relative">
                              <div className="w-full relative">
                                <input
                                  type="text"
                                  {...register("documento_apoderado", {
                                    required: true,
                                  })}
                                  className="py-3 pl-8 pr-4 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                                  placeholder="Número de documento"
                                />
                                <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                              </div>
                              <Errors error={errors.documento_apoderado} />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="relative mb-0 flex flex-col md:flex-row gap-2 items-start">
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <label htmlFor="" className="text-black">
                              Enfermedades
                            </label>
                            <textarea
                             {...register("enfermedades")}
                              className="py-2 px-2 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              name="enfermedades"
                              id=""
                              cols="5"
                              rows="2"
                            ></textarea>
                          </div>
                          <Errors
                            error={errors.enfermedades}
                          />
                        </div>
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <label htmlFor="" className="text-black">
                              Discapacidades
                            </label>
                            <textarea
                             {...register("discapacidades")}
                              className="py-2 px-2 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              name="discapacidades"
                              id=""
                              cols="5"
                              rows="2"
                            ></textarea>
                          </div>
                          <Errors
                            error={errors.discapacidades}
                          />
                        </div>
                      </div>
                      
                      <div className="relative mb-0 flex flex-col md:flex-row gap-2 items-start">
                        <div className="flex flex-col w-full gap-2 relative">
                          <div className="w-full relative">
                            <label htmlFor="" className="text-black">
                              Paciente especial
                            </label>
                            <textarea
                              {...register("paciente_especial")}
                              className="py-2 px-2 bg-gray-200 w-full outline-none rounded-lg text-black shadow-sm shadow-primary"
                              name="paciente_especial"
                              id=""
                              cols="5"
                              rows="2"
                            ></textarea>
                          </div>
                          <Errors
                            error={errors.paciente_especial}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex bg-white flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50 gap-2">
                      <button
                        type="button"
                        className="inline-block rounded bg-gray-400 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-main-accent-100 focus:bg-main-accent-100 focus:outline-none focus:ring-0 active:bg-main-accent-200"
                        onClick={handleClose}
                      >
                        Cerrar
                      </button>
                      <input
                        type="submit"
                        value={"Registrar"}
                        className="cursor-pointer inline-block rounded bg-main   px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-main-accent-100 focus:bg-main-accent-100 focus:outline-none focus:ring-0 active:bg-main-accent-200"
                        data-te-ripple-color="light"
                      />
                    </div>
                  </form>
                )}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        ""
      )}
    </>
  );
};
