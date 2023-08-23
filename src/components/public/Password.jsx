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
import logo from './../../assets/logo/icono.png';

const Password = () => {
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
  const [codigo, setCodigo] = useState("");

  const [modal, setModal] = useState(false);


  if (auth.id) {
    navigate("/dashboard", { replace: true });
  } else {
    const validarEnvio = async (datas) => {
      setLoading(true);
        const data = new FormData();
        data.append("tipo", datas.tipo);
        data.append("correo", datas.correo);
        try {
          let respuesta = await axios.post(`${Global.url}/enviarCorreoRecuperacion`,data);
          if (respuesta.data.status === "success") {
            Swal.fire("Se enviaron los accesos a su correo.", " ", "success");
            navigate("/login")
          }else if(respuesta.data.status === "no_exise") {
            Swal.fire("No existe un usuario registrado con este correo", "", "error");
          }
           else {
            Swal.fire("Error al enviar el correo", "", "error");
          }
        } catch (error) {
          Swal.fire("Error al enviar el correo", "", "error");
        }
      setLoading(false);
    };

    useEffect(()=>{
      setDataForm({})
    },[])

    return (
      <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="w-screen md:w-2/4  md:h-screen hidden lg:block">
          <video className="w-full h-full object-cover" autoPlay muted loop>
            <source src={bg_video} type="video/mp4" />
          </video>
        </div>
          <div className="bg-secondary-100  p-8 md:px-20  shadow-2xl w-screen lg:w-2/4 h-screen flex flex-col justify-center">
            <button className="flex items-center justify-center w-full rounded-full mb-8 text-gray-100">
                <img
                src={logo}
                className="w-full h-20 object-contain"
                />
            </button>
            <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
              Recuperar <span className="text-main">Cuenta</span>
            </h1>
            {loading ? (
              <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-100">
                <p className="text-main text-2xl">Validando ....</p>
              </div>
            ) : (
              <form className="mb-8 relative" onSubmit={handleSubmit(validarEnvio)}>
                {loading ? (
                  <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-100">
                    <p className="text-main text-2xl">Validando ....</p>
                  </div>
                ) : (
                  ""
                )}
                <div className="relative flex flex-row gap-3 mb-8">
                    <div className="w-1/3 flex flex-col justify-start">
                        <label htmlFor="">Tipo de usuario</label>
                        <div className="w-full relative flex flex-col">
                          <select
                              type="text"
                              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                              {...register("tipo", {
                                required: "Campo requerido",
                              })}
                            >
                              <option value="">Seleccionar</option>
                              <option value="0">Paciente</option>
                              <option value="1">Odontólogo</option>
                          </select>
                          <RiMailLine className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                        </div>
                        <p className="text-sm p-0 m-0">{errors.tipo && <span className="text-main">{errors.tipo.message}</span>}</p>
                    </div>
                    <div className="w-2/3 flex flex-col justify-start">
                        <label htmlFor="">Correo</label>
                        <div className="w-full relative flex flex-col">
                          <input
                              type="email"
                              name="user"
                              {...register("correo", {
                                  required: true,
                              })}
                              className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                              placeholder="Correo Electronico"
                          />
                          <RiMailLine className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                        </div>
                        <Errors error={errors.correo} />
                    </div>
                </div>
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    className="bg-main text-white uppercase font-bold text-sm  py-3 px-4 rounded-lg w-80 mx-auto top-0"
                  >
                    Enviar
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
      </div>
    );
  }
};
export default Password;
