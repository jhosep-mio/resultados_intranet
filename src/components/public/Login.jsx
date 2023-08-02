import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from 'axios';
import bg_video from '../../assets/images/login/bg_resultados.mp4';
import logo from './../../assets/logo/icono.png';
import { useForm } from "react-hook-form";

// Icons
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiEditFill,
  RiUser3Fill,
  RiUser3Line,
} 


from "react-icons/ri";
import { Global } from "../../helper/Global";
import { Errors } from "../shared/Errors";

const Login = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { form, changed } = useForm({});
    const [loged, setLoged] = useState("");
    const {auth,setAuth} = useAuth();

  if(auth.id) {
    navigate("/admin", {replace: true});
  }else{
      const validar = async(form) =>{
          const data = new FormData();
          
          let user = form.user;
          let password = form.password;
          data.append('user', user);
          data.append('password', password);
          data.append('_method', 'POST');

          try {
            let respuesta= await axios.post(`${Global.url}/loginPaciente`, data);
              if(respuesta.data.status === "success"){
                  localStorage.setItem("token", respuesta.data.acces_token);
                  localStorage.setItem("user", JSON.stringify(respuesta.data.user)); 
                  setLoged("login");
                  setAuth(respuesta.data.user);
                  setTimeout(()=>{
                      window.location.reload();
                  }, 1000);

              }else if(respuesta.data.status === "invalid"){
                  setLoged("invalid");
              }else{
                  setLoged("noexiste");
              }

          } catch (error) {
            setLoged("noexiste");
          }
    }
    return (
      <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="bg-secondary-100  p-8 md:px-20  shadow-2xl w-screen lg:w-2/5 h-screen flex flex-col justify-center">
            <button className="flex items-center justify-center w-full rounded-full mb-8 text-gray-100">
                <img
                src={logo}
                className="w-full h-20 object-contain"
                />
            </button>
          <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
            Iniciar <span className="text-main">sesión</span>
          </h1>
          <form className="mb-8" onSubmit={handleSubmit(validar)}>

            <div div className="flex flex-col w-full gap-2 relative ">
                <div className="w-full relative">
                <input
                    type="text"
                    name="user"
                    {...register("user", {
                        required: true,
                    })}
                    className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                    placeholder="Usuario"
                />
                <RiUser3Line className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                </div>
                <Errors error={errors.user} />
            </div>

            <div div className="flex flex-col w-full gap-2 relative">
                <div className="w-full relative">
                <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                        required: true,
                    })}
                    className="py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg"
                    placeholder="Contraseña"
                    name="password"
                />
                {showPassword ? (
                    <RiEyeOffLine
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-main"
                    />
                ) : (
                    <RiEyeLine
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-main"
                    name="password"
                    onChange={changed}
                    />
                )}
                <RiLockLine className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
                </div>
                <Errors error={errors.password} />
            </div>

            <div className="mt-3  mb-8">
                {
                loged === "invalid" ?
                <p className='text-main'>Datos incorrectos</p>
                : loged === "noexiste" ?
                <p className='text-main'>Datos incorrectos</p>
                : loged === "login"? 
                <p className='text-green-500'>Usuario identificado correctamente</p>
                :""
                }

            </div>

            <div className="w-full flex">
              <button
                type="submit"
                className="bg-main text-white uppercase font-bold text-sm  py-3 px-4 rounded-lg w-80 m-auto"
              >
                Ingresar
              </button>
            </div>
         
          </form>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/password"
              className="hover:text-main transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <span className="flex items-center gap-2">
              ¿No tienes cuenta?{" "}
              <Link
                to="/registro"
                className="text-main hover:text-gray-100 transition-colors"
              >
                Regístrate
              </Link>
            </span>
          </div>
        </div>
        <div className="w-screen md:w-3/5  md:h-screen hidden lg:block">
            <video  className="w-full h-full object-cover" autoPlay muted loop>
              <source src={bg_video} type="video/mp4" />
            </video>
        </div>
      </div>
    );
  };
}
export default Login;
