import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import axios from 'axios';
import bg_video from '../../assets/images/login/bg_resultados.mp4';

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

const Registro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { form, changed } = useForm({});
  const[loading, setLoading] = useState(false);
  const [loged, setLoged] = useState("");
  const {auth,setAuth} = useAuth();
  const [validarEdad, setValidarEdad] = useState(true);

  const[nombres, setNombres] = useState("");
  const[apellido_p, setApellido_p] = useState("");
  const[apellido_m, setApellido_m] = useState("");
  const[fecha, setFecha] = useState(0);

  const[nombre_poderado, setNombre_poderado] = useState("");
  const[tipo_documento_apoderado, setTipo_documento_apoderado] = useState(0);
  const[documento_apoderado, setDocumento_apoderado] = useState("");

  const[tipo_documento_paciente_odontologo, setTipo_documento_paciente_odontologo] = useState(0);
  const[numero_documento_paciente_odontologo, setNumero_documento_paciente_odontologo] = useState("");
  const[celular, setCelular] = useState("");
  const[correo, setCorreo] = useState("");
  const [generoPaciente, setGeneroPaciente] = useState(0);
  const [embarazada, setEmbarazada] = useState(0);
  const [genero, setGenero] = useState(false);
  const [codigo, setCodigo] = useState("");

  const[modal, setModal] = useState(false);
    

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

    const indentificarGenero = (event) =>{
        setGeneroPaciente(event.target.value);
        setGenero(event.target.value == 1 ? true : false);
    }

  if(auth.id) {
    navigate("/dashboard", {replace: true});
  }else{
    
    const validar2 = async(e) =>{
        setLoading(true);
        e.preventDefault();
        const data = new FormData();
        data.append('id_rol', 1);
        data.append('nombres', nombres);
        data.append('apellido_p', apellido_p);
        data.append('apellido_m', apellido_m);
        data.append('f_nacimiento', fecha);
        data.append('nombre_apoderado', nombre_poderado);
        data.append('tipo_documento_apoderado', tipo_documento_apoderado);
        data.append('documento_apoderado', documento_apoderado);
        data.append('tipo_documento_paciente_odontologo', tipo_documento_paciente_odontologo);
        data.append('numero_documento_paciente_odontologo', numero_documento_paciente_odontologo);
        data.append('celular', celular);
        data.append('correo', correo);
        data.append('genero', generoPaciente);
        data.append('embarazada', embarazada);
        data.append('enfermedades', "");
        data.append('discapacidades', "");
        data.append('paciente_especial', "");
        try {

            let respuesta = await axios.post(`${Global.url}/valasdad`, data);
            if(respuesta.data.status === "success"){
                validarEnvio();
            }else if(respuesta.data.status == "dni_ya_registrado"){
                Swal.fire('Usuario ya registrado', '', 'error');
                setLoading(false);

            }else{
                Swal.fire('Error', '', 'error');
                setLoading(false);
            }
        } catch (error) {
            if(error.request.response.includes("nombres")){
                setLoged("Nombre invalido");
            }else if(error.request.response.includes("apellido_p")){
                setLoged("Apellido paterno invalido");
            }else if(error.request.response.includes("apellido_m")){
                setLoged("Apellido materno invalido");
            }else{
                setLoged("Error no encontrado");
            }
            setLoading(false);

        }
    }
    const validarEnvio = async () => {
        const data = new FormData();
        data.append('correo', correo);
        try {
            let respuesta = await axios.post(`${Global.url}/enviarCorreosPacietnes`, data);

            if(respuesta.data.status === "success"){
                Swal.fire('Se envio un codigo de verificacion a tu correo', '', 'success');
                setModal(true);
            }else{
                Swal.fire('Error', '', 'error');
            }
        } catch (error) {
            Swal.fire('Error', '', 'error');
        }
        setLoading(false);
    }

    const validarCodigo = async (e) => {
        setLoading(true);
            e.preventDefault();
            const data = new FormData();
            data.append('correo', correo);
            data.append('codigo', codigo);

            try {
                let respuesta = await axios.post(`${Global.url}/validarCodigo`, data);
                if(respuesta.data.status === "success"){
                    validar();
                }else{
                    Swal.fire('El codigo no es valido', '', 'error');
                    setLoading(false);
                }
            } catch (error) {
                Swal.fire('Error', '', 'error');
                setLoading(false);
            }
    }

    const validar = async(e) =>{
        const data = new FormData();
        data.append('id_rol', 1);
        data.append('nombres', nombres);
        data.append('apellido_p', apellido_p);
        data.append('apellido_m', apellido_m);
        data.append('f_nacimiento', fecha);
        data.append('nombre_apoderado', nombre_poderado);
        data.append('tipo_documento_apoderado', tipo_documento_apoderado);
        data.append('documento_apoderado', documento_apoderado);
        data.append('tipo_documento_paciente_odontologo', tipo_documento_paciente_odontologo);
        data.append('numero_documento_paciente_odontologo', numero_documento_paciente_odontologo);
        data.append('celular', celular);
        data.append('correo', correo);
        data.append('genero', generoPaciente);
        data.append('embarazada', embarazada);
        data.append('enfermedades', "");
        data.append('discapacidades', "");
        data.append('paciente_especial', "");
        try {

            let respuesta = await axios.post(`${Global.url}/savePaciente`, data);

            if(respuesta.data.status === "success"){
                Swal.fire('Usuario creado correctamente', '', 'success');
                navigate("/login")
            }else{
                Swal.fire('error', '', 'error');
            }

        } catch (error) {
            Swal.fire('error', '', 'error');
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(calcularEdad(fecha) >= 18){
            setValidarEdad(true);
        }else {
            setValidarEdad(false);
        }
    }, [fecha])

    return (
      <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="w-screen md:w-2/4  md:h-screen hidden lg:block">
        <video  className="w-full h-full object-cover" autoPlay muted loop>
            <source src={bg_video} type="video/mp4" />
        </video>
        </div>

        {modal  ?
        <div className="bg-secondary-100  p-8 md:px-20  shadow-2xl w-screen lg:w-2/4 h-screen flex flex-col justify-center">
          <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
            Validar <span className="text-main">Registro</span>
          </h1>
          {
            loading ?
            <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-900">
                <p className="text-main text-2xl">Validando ....</p> 
            </div>
            :
            <form className="mb-8 relative" onSubmit={validarCodigo}>
                {
                    loading  ? 

                    <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-900">
                        <p className="text-main text-2xl">Validando ....</p> 
                    </div>

                    :""
                }
                <div className="relative mb-4 flex gap-2">
                <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
                <input
                    type="text"
                    name="nombres"
                    value={codigo}
                    onChange={(e) => { setCodigo(e.target.value)}}
                    className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                    placeholder="Codigo"
                />
                <button
                    type="submit"
                    className="bg-main text-white uppercase font-bold text-sm  py-3 px-4 rounded-lg w-80 m-auto"
                >
                    Validar
                </button>
                </div>
                <div className="mt-3">
                    {
                    loged === "invalid" ?
                    <p className='login-main__error_datos'>Contraseña incorrecta</p>
                    : loged === "noexiste" ?
                    <p className='login-main__error_datos'>El usuario no existe</p>
                    : loged === "login"? 
                    <p className='login-main__error_datos'>Usuario identificado correctamente</p>
                    :""
                    }

                </div>
            </form>

          }

          <div className="flex flex-col items-center gap-4">
            {/* <Link
              to="/olvide-password"
              className="hover:text-main transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link> */}
            <span className="flex items-center gap-2">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/registro"
                className="text-main hover:text-gray-100 transition-colors"
              >
                Iniciar Sesión
              </Link>
            </span>
          </div>
        </div>

        :<div className="bg-secondary-100  p-8 md:px-20 shadow-2xl w-screen lg:w-2/4 h-screen flex flex-col justify-center">
          <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
            Regis<span className="text-main">trate</span>
          </h1>
          <form className="mb-8 relative" onSubmit={validar2}>
            {
                loading  ? 

                <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-secondary-900">
                    <p className="text-main text-2xl">Validando ....</p> 
                </div>

                :""
            }
            <div className="relative mb-4 flex gap-2">
              <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
              <input
                type="text"
                name="nombres"
                value={nombres}
                onChange={(e) => { setNombres(e.target.value)}}
                className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                placeholder="Nombres"
              />
              <input
                type="text"
                name="apellido_p"
                value={apellido_p}
                onChange={(e) => { setApellido_p(e.target.value)}}
                className="py-3 pl-3 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                placeholder="Apellido Paterno"
              />
            </div>
            <div className="relative mb-4 flex gap-2">
              <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
              <input
                type="text"
                name="apellido_m"
                value={apellido_m}
                onChange={(e) => { setApellido_m(e.target.value)}}
                className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                placeholder="Apellido Materno"
              />
               <input
                type="number"
                value={celular}
                onChange={(e) => { setCelular(e.target.value) }}
                className="py-3 pl-3 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                placeholder="Celular"
              />
            </div>
            <div className="relative mb-4 flex gap-2">
                <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
                <select value={tipo_documento_paciente_odontologo} type="text" className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"  autoFocus required onChange={(e) => { setTipo_documento_paciente_odontologo(e.target.value)}}>
                    <option value="0">DNI</option>
                    <option value="1">RUC</option>
                    <option value="2">Pasaporte</option>
                    <option value="3">Carnet de Extranjería</option>
                </select>
                <input
                    type="text"
                    name="documento"
                    value={numero_documento_paciente_odontologo}
                    onChange={(e) => { setNumero_documento_paciente_odontologo(e.target.value) }}
                    className="py-3 pl-3 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                    placeholder="Número de documento"
                />
            </div>
            <div className="relative mb-4 flex gap-2">
              <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
              <input
                type="date"
                name="fecha"
                value={fecha}
                onChange={(e) => { setFecha(e.target.value) }}
                className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                placeholder="Fecha"
              />
             <input
                type="email"
                name="documento"
                value={correo}
                onChange={(e) => { setCorreo(e.target.value) }}
                className="py-3 pl-3 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                placeholder="Correo electronico"
            />
            </div>
            <div className="relative mb-4 flex gap-2">
                <div className="relative w-full flex flex-col items-center justify-center">
                    <label className="w-full flex items-center pr-12">Género</label>
                    <select value={generoPaciente} type="text" className="py-3 pl-3 pr-4 bg-secondary-900 w-full outline-none rounded-lg"  autoFocus required onChange={indentificarGenero}>
                        <option value="0">Maculino</option>
                        <option value="1">Femenino</option>
                    </select>
                </div>
                {genero ?
                <>
                    <div className="flex flex-col w-full">
                        <label className="w-full flex items-center pr-12">¿Estás embarazada?</label>
                        <select value={embarazada} type="text" className="py-3 pl-2 pr-4 bg-secondary-900 w-full outline-none rounded-lg"  autoFocus required onChange={(e) => { setEmbarazada(e.target.value)}}>
                            <option value="0">No</option>
                            <option value="1">Si</option>
                        </select>
                    </div>
                </>
                :""}
            </div>
            {validarEdad ?  ""  
                :  
                <>
                    <label className="mt-1 bg-main rounded-tr-md rounded-tl-md px-3 py-1 inline-block">Datos del apoderado</label>
                    <div className="relative mb-4 mt-0">
                        <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
                        <input
                            type="text"
                            name="apellido_p"
                            value={nombre_poderado}
                            onChange={(e) => { setNombre_poderado(e.target.value) }}
                            className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg rounded-tl-none"
                            placeholder="Nombres del apoderado"
                        />
                    </div>
                    <div className="relative mb-4 flex gap-2">
                        <RiEditFill className="absolute top-1/2 -translate-y-1/2 left-2 text-main" />
                        <select type="text" value={tipo_documento_apoderado} className="py-3 pl-8 pr-4 bg-secondary-900 w-full outline-none rounded-lg"  autoFocus required onChange={(e) => { setTipo_documento_apoderado(e.target.value)}}>
                            <option value="0">DNI</option>
                            <option value="1">RUC</option>
                            <option value="2">Pasaporte</option>
                            <option value="3">Carnet de Extranjería</option>
                        </select>
                        <input
                            type="text"
                            name="documento"
                            value={documento_apoderado}
                            onChange={(e) => { setDocumento_apoderado(e.target.value) }}
                            className="py-3 pl-3 pr-4 bg-secondary-900 w-full outline-none rounded-lg"
                            placeholder="Número de documento"
                        />
                    </div>
                </>
            }
            <div className="w-full flex">
              <button
                type="submit"
                className="bg-main text-white uppercase font-bold text-sm  py-3 px-4 rounded-lg w-80 m-auto"
              >
                Registrar
              </button>
            </div>
            <div className="mt-3">
                {
                loged === "invalid" ?
                <p className='login-main__error_datos'>Contraseña incorrecta</p>
                : loged === "noexiste" ?
                <p className='login-main__error_datos'>El usuario no existe</p>
                : loged === "login"? 
                <p className='login-main__error_datos'>Usuario identificado correctamente</p>
                :""
                }

            </div>
          </form>

          <div className="flex flex-col items-center gap-4">
            {/* <Link
              to="/olvide-password"
              className="hover:text-main transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link> */}
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
        }


      </div>
    );
  };
}
export default Registro;
