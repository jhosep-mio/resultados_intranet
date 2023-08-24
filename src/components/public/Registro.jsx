import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import axios from "axios";
import bg_video from "../../assets/images/login/bg_resultados.mp4";
// Icons
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiEditFill,
} from "react-icons/ri";
import { Global } from "../../helper/Global";
import Swal from "sweetalert2";
import { Errors } from "../shared/Errors";

const Registro = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [datas, setDataForm] = useState({});
  // const onSubmit = (data) => setDataForm(data);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loged, setLoged] = useState("");
  const { auth, setAuth } = useAuth();
  const [validarEdad, setValidarEdad] = useState(true);

  const [fecha, setFecha] = useState(0);

  const [generoPaciente, setGeneroPaciente] = useState(0);
  const [genero, setGenero] = useState(false);
  const [codigo, setCodigo] = useState("");

  const [modal, setModal] = useState(false);

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
    setGeneroPaciente(event.target.value);
    setGenero(event.target.value == 1 ? true : false);
  };

  if (auth.id) {
    navigate("/dashboard", { replace: true });
  } else {
    const validar2 = async (data) => {
      setLoading(true);
      setDataForm(data);
      const data2 = new FormData();
      data2.append("id_rol", 1);
      data2.append("clinica", 0);
      data2.append("cop", data.cop);
      data2.append("c_bancaria", null);
      data2.append("cci", null);
      data2.append("nombre_banco", null);
      data2.append("nombres", data.nombres);
      data2.append("apellido_p", data.apellido_p);
      data2.append("apellido_m", data.apellido_m);
      data2.append("f_nacimiento", data.fecha);
      data2.append(
        "tipo_documento_paciente_odontologo",
        data.tipo_documento_paciente_odontologo
      );
      data2.append(
        "numero_documento_paciente_odontologo",
        data.numero_documento_paciente_odontologo
      );
      data2.append("celular", data.celular);
      data2.append("correo", data.correo);
      data2.append("genero", 2);
      try {
        let respuesta = await axios.post(`${Global.url}/valasdad`, data2);
        if (respuesta.data.status === "success") {
          validarEnvio(data);
        } else if (respuesta.data.status == "dni_ya_registrado") {
          Swal.fire(
            "DOCUMENTO YA REGISTRADO.",
            "Si necesitas ayuda para el registro, por favor comunicate al whatsapp: 998 301 073.",
            "error"
          );
          setLoading(false);
        } else if (respuesta.data.status == "celular_ya_registro") {
          Swal.fire(
            "CELULAR YA REGISTRADO.",
            "Si necesitas ayuda para el registro, por favor comunicate al whatsapp: 998 301 073.",
            "error"
          );
          setLoading(false);
        } else if (respuesta.data.status == "correo_ya_registrado") {
          Swal.fire(
            "CORREO YA REGISTRADO.",
            "Si necesitas ayuda para el registro, por favor comunicate al whatsapp: 998 301 073.",
            "error"
          );
          setLoading(false);
        } else if (respuesta.data.status == "cop_ya_registrado") {
          Swal.fire(
            "COP YA REGISTRADO.",
            "Si necesitas ayuda para el registro, por favor comunicate al whatsapp: 998 301 073.",
            "error"
          );
          setLoading(false);
        } else {
          Swal.fire("Error", "", "error");
          setLoading(false);
        }
      } catch (error) {
        if (
          error.request.response.includes(
            "El tipo de documento y numero de documento ya estan registrados para otro cliente"
          )
        ) {
          Swal.fire(
            "DOCUMENTO YA REGISTRADO.",
            "Si necesitas ayuda para el registro, por favor comunicate al whatsapp: 998 301 073.",
            "error"
          );
        }
        setLoading(false);
      }
    };
    const validarEnvio = async (datas) => {
      const data = new FormData();
      data.append("correo", datas.correo);
      try {
        let respuesta = await axios.post(
          `${Global.url}/enviarCorreosPacietnes`,
          data
        );

        if (respuesta.data.status === "success") {
          Swal.fire(
            "Se envió un código de verificación a su correo.",
            " ",
            "success"
          );
          setModal(true);
        } else {  
          Swal.fire("Error al enviar el correo", "", "error");
        }
      } catch (error) {
        Swal.fire("Error al enviar el correo", "", "error");
      }
      setLoading(false);
    };

    const validarCodigo = async (e) => {
      setLoading(true);
      e.preventDefault();
      const data = new FormData();
      data.append("correo", datas.correo);
      data.append("codigo", codigo);
      try {
        let respuesta = await axios.post(`${Global.url}/validarCodigo`, data);
        if (respuesta.data.status === "success") {
          validar();
        } else {
          Swal.fire("El código no es valido", "", "error");
          setLoading(false);
        }
      } catch (error) {
        Swal.fire("Error", "", "error");
        setLoading(false);
      }
    };
    const validar = async (e) => {
      const data2 = new FormData();
      data2.append("id_rol", 1);
      data2.append("clinica", 0);
      data2.append("cop", datas.cop);
      data2.append("c_bancaria", null);
      data2.append("cci", null);
      data2.append("nombre_banco", null);
      data2.append("nombres", datas.nombres);
      data2.append("apellido_p", datas.apellido_p);
      data2.append("apellido_m", datas.apellido_m);
      data2.append("f_nacimiento", datas.fecha);
      data2.append(
        "tipo_documento_paciente_odontologo",
        datas.tipo_documento_paciente_odontologo
      );
      data2.append(
        "numero_documento_paciente_odontologo",
        datas.numero_documento_paciente_odontologo
      );
      data2.append("celular", datas.celular);
      data2.append("correo", datas.correo);
      data2.append("genero", 2);

      try {
        let respuesta = await axios.post(`${Global.url}/saveOdontologo`, data2);
        if (respuesta.data.status === "success") {
          setLoading(false);
          Swal.fire(
            "Usuario creado correctamente.",
            "Se envió un correo con sus credenciales para iniciar sesión.",
            "success"
          );
          const data3 = new FormData();
          data3.append("correo", datas.correo);
          data3.append("cop", datas.cop);
          data3.append(
            "numero_documento_paciente_odontologo",
            datas.numero_documento_paciente_odontologo
          );
          navigate("/login");
          let respuesta = await axios.post(
              `${Global.url}/enviarCorreoFinal`,
              data3
              );
        } else {
          Swal.fire("error", "", "error");
        }
      } catch (error) {
        Swal.fire("error", "", "error");
      }
      setLoading(false);
    };

    useEffect(() => {
      if (calcularEdad(fecha) >= 18) {
        setValidarEdad(true);
      } else {
        setValidarEdad(false);
      }
    }, [fecha]);

    useEffect(() => {
      setDataForm({});
    }, []);
    const currentDate = new Date().toISOString().split('T')[0]; 

    return (
      <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="w-screen md:w-2/4  md:h-screen hidden lg:block">
          <video className="w-full h-full object-cover" autoPlay muted loop>
            <source src={bg_video} type="video/mp4" />
          </video>
        </div>

        {modal ? (
          <div className="bg-secondary-100  p-8 md:px-20  shadow-2xl w-screen lg:w-2/4 h-screen flex flex-col justify-center">
            <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
              Validar <span className="text-main">Registro</span>
            </h1>
            {loading ? (
              <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-100">
                <p className="text-main text-2xl">Validando ...</p>
              </div>
            ) : (
              <form className="mb-8 relative" onSubmit={validarCodigo}>
                {loading ? (
                  <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-100">
                    <p className="text-main text-2xl">Validando ...</p>
                  </div>
                ) : (
                  ""
                )}
                <div className="relative mb-4 flex gap-2">
                  <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
                  <input
                    type="text"
                    name="nombres"
                    value={codigo}
                    onChange={(e) => {
                      setCodigo(e.target.value);
                    }}
                    className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                    placeholder="Código"
                  />
                  {modal == true ? (
                    <button
                      type="submit"
                      className="bg-main text-white uppercase font-bold text-sm  py-3 px-4 rounded-lg w-80 m-auto"
                    >
                      Validar
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="mt-3">
                  {loged === "invalid" ? (
                    <p className="login-main__error_datos">
                      Contraseña incorrecta
                    </p>
                  ) : loged === "noexiste" ? (
                    <p className="login-main__error_datos">
                      El usuario no existe
                    </p>
                  ) : loged === "login" ? (
                    <p className="login-main__error_datos">
                      Usuario identificado correctamente
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            )}

            <div className="flex flex-col items-center gap-4">
              <span className="flex items-center gap-2">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-main hover:text-gray-100 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-secondary-100  p-8 md:px-20 shadow-2xl w-screen lg:w-2/4 h-screen flex flex-col justify-center">
            <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
              Regís<span className="text-main">trate</span>
            </h1>
            <form className="mb-8 relative" onSubmit={handleSubmit(validar2)}>
              {loading ? (
                <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-100">
                  <p className="text-main text-2xl">Validando ...</p>
                </div>
              ) : (
                ""
              )}
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
                          message: "Nombre inválido",
                        },
                      })}
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
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
                          message: "Apellido paterno inválido",
                        },
                      })}
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
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
              <div className="relative mb-2 flex flex-row gap-2 items-start">
                <div className="flex flex-col w-full gap-2 relative">
                  <div className="w-full relative">
                    <input
                      type="text"
                      name="apellido_m"
                      {...register("apellido_m", {
                        required: "Campo requerido",
                        pattern: {
                          value: /^[^0-9]+$/i,
                          message: "Apellido materno inválido",
                        },
                      })}
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
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
                          message: "Celular inválido",
                        },
                      })}
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
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
              <div className="relative mb-2 flex flex-row gap-2 items-start">
                <div className="flex flex-col w-full gap-2 relative">
                  <div className="w-full relative">
                    <select
                      type="text"
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                      autoFocus
                      required
                      {...register("tipo_documento_paciente_odontologo", {
                        required: true,
                      })}
                    >
                      <option value="0">DNI</option>
                      <option value="1">RUC</option>
                      <option value="2">Pasaporte</option>
                      <option value="3">Carnet de Extranjería</option>
                    </select>
                    <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                  </div>
                  <Errors error={errors.tipo_documento_paciente_odontologo} />
                </div>
                <div className="flex flex-col w-full gap-2 relative">
                  <div className="w-full relative">
                    <input
                      type="text"
                      {...register("numero_documento_paciente_odontologo")}
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                      placeholder="Número de documento"
                    />
                    <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                  </div>
                  <Errors error={errors.numero_documento_paciente_odontologo} />
                </div>
              </div>
              <div className="relative mb-2 flex flex-col md:flex-row gap-2 items-start">
                <div className="flex flex-col w-full gap-2 relative">
                  <div className="w-full relative">
                    <input
                      type="date"
                      name="fecha"
                      max={currentDate}
                      {...register("fecha", { required: true })}
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg cambiarfecha"
                      placeholder="Fecha"
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
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                      placeholder="Correo electronico"
                    />
                    <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                  </div>
                  <Errors error={errors.correo} />
                </div>
              </div>
              <div className="relative mb-8 flex flex-col md:flex-row gap-2 items-start">
                <div className="flex flex-col w-full justify-center gap-2 relative">
                  <div className="w-full md:w-1/2 relative ">
                    <input
                      type="number"
                      name="cop"
                      {...register("cop", {
                        required: "Este campo es requerido",
                        pattern: {
                          value: /^[0-9]{0,10}$/,
                          message:
                            "El COP debe tener como maximo 10 digitos",
                        },
                      })}
                      className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                      placeholder="COP"
                    />
                    <RiEditFill className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                  </div>
                  <p className="text-sm p-0 m-0">
                    {errors.cop && (
                      <span className="text-main">{errors.cop.message}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="w-full flex">
                <button
                  type="submit"
                  className="bg-main text-white uppercase font-bold text-sm  py-3 px-4 rounded-lg w-80 m-auto"
                >
                  Registrar
                </button>
              </div>
              <div className="mt-3">
                {loged === "invalid" ? (
                  <p className="login-main__error_datos">
                    Contraseña incorrecta
                  </p>
                ) : loged === "noexiste" ? (
                  <p className="login-main__error_datos">
                    El usuario no existe
                  </p>
                ) : loged === "login" ? (
                  <p className="login-main__error_datos">
                    Usuario identificado correctamente
                  </p>
                ) : (
                  ""
                )}
              </div>
            </form>

            <div className="flex flex-col items-center gap-4">
              <span className="flex items-center gap-2">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-main hover:text-gray-100 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
};
export default Registro;
