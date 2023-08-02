import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Global } from '../../../../helper/Global';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/useAuth';
import logo from './../../../../assets/logo/logo.png';
import { BsPlusCircleFill } from "react-icons/bs";
import {
    Accordion,
    AccordionHeader,
  } from "@material-tailwind/react";
import { Loading } from '../../../shared/Loading';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";

export const RegistrarOrden = () => {
    const { auth, title, setTitle } = useAuth({});
    const [loading, setLoading] = useState(true);
    const[serviciosEstate, setServiciosState]= useState([]);
    const[llenarserv, setLlenarServ]= useState([]);
    let token = localStorage.getItem("token");
    const[impresionCheck, setImpresionCheck] = useState([]);
    const[varon, setVaron] = useState(false);
    const[mujer, setMujer] = useState(false);
    const[idServicio, setIdServicio] = useState(0);
    const[odontologos, setOdontologos] = useState([]);
    const[servicios, setServicios] = useState([]);
    const[items, setItems] = useState([]);
    const [elementos, setElementos] = useState([]);
    const[botonDoctor, setBotonDoctor] = useState(false)
    const[correo_paciente, setCorreoPaciente] = useState("");

    const [search, setSearch] = useState('');
    const[nombres, setNombres] = useState("");
    const[edad, setEdad] = useState(0);
    const[celular, setCelular] = useState(0);
    const[genero, setGenero] = useState(0);
    const[fecha, setFecha] = useState(0);
    const[odontologo, setOdontologo] = useState("");
    const[cop, setCop] = useState("");
    const[emailOdon, setEmailOdon] = useState("");

    //ORDEN VIRTUAL
    const[idPaciente,setIdPaciente] = useState(0);
    const[idOdontologo, setIdOdontologo] = useState(0);
    const[consulta, setConsulta] = useState("");
    
    const[box18, setBox18] = useState(false);
    const[box17, setBox17] = useState(false);
    const[box16, setBox16] = useState(false);
    const[box15, setBox15] = useState(false);
    const[box14, setBox14] = useState(false);
    const[box13, setBox13] = useState(false);
    const[box12, setBox12] = useState(false);
    const[box11, setBox11] = useState(false);

    const[box21, setBox21] = useState(false);
    const[box22, setBox22] = useState(false);
    const[box23, setBox23] = useState(false);
    const[box24, setBox24] = useState(false);
    const[box25, setBox25] = useState(false);
    const[box26, setBox26] = useState(false);
    const[box27, setBox27] = useState(false);
    const[box28, setBox28] = useState(false);

    const[box48, setBox48] = useState(false);
    const[box47, setBox47] = useState(false);
    const[box46, setBox46] = useState(false);
    const[box45, setBox45] = useState(false);
    const[box44, setBox44] = useState(false);
    const[box43, setBox43] = useState(false);
    const[box42, setBox42] = useState(false);
    const[box41, setBox41] = useState(false);

    const[box31, setBox31] = useState(false);
    const[box32, setBox32] = useState(false);
    const[box33, setBox33] = useState(false);
    const[box34, setBox34] = useState(false);
    const[box35, setBox35] = useState(false);
    const[box36, setBox36] = useState(false);
    const[box37, setBox37] = useState(false);
    const[box38, setBox38] = useState(false);
    const[celular_Odon, setCelular_Odon] = useState("");

    const[siConGuias, setSiConGuias] = useState(false);
    const[noConGuias, setNoConGuias] = useState(false);


    const[otrosAnalisis, setOtrosAnalisis] = useState("");
    const[totalPrecio, setTotalPrecio] = useState(0);
    const[metodoPago, setMetodoPago] = useState("");
    const[agregarComisiones, setAgregarComisiones] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const navigate = useNavigate();

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

    const onSeachChange = ({target}) =>{
        setSearch(target.value);
    }

    function quitarAcentos(cadena){
        const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
        return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
    } 

    const getCliente = ()=>{
        let paciente = JSON.parse(localStorage.getItem("paciente"));
        setIdPaciente(paciente.id);
        setNombres(`${paciente.nombres} ${paciente.apellido_p} ${paciente.apellido_m}`);
        setEdad(calcularEdad(paciente.f_nacimiento));
        setFecha(paciente.f_nacimiento == null ? "" : new Date(paciente.f_nacimiento));
        setCelular(paciente.celular);
        setGenero(paciente.genero);
        setCorreoPaciente(paciente.correo);

        if(paciente.genero == 0 ){
            setVaron(true);
        }else if (paciente.genero == 1){
            setMujer(true);
        }
    }

    const getAllOdontologos= async () =>{
        setLoading(true);
            setOdontologo(`${auth.nombres} ${auth.apellido_p} ${auth.apellido_m}`);
            setCop(`${auth.cop}`);
            setEmailOdon(`${auth.correo != null ? auth.correo : ''}`);
            setCelular_Odon(`${auth.celular != null ? auth.celular : ''}`);
        setLoading(false);
    };

    const getAllServicios= async () =>{
        setLoading(true);
        const request = await axios.get(`${Global.url}/allServicios`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setServicios(request.data);
        setIdServicio(request.data[0].id);
        setLoading(false);
    };

    const getAllItems= async () =>{
        setLoading(true);
        const request = await axios.get(`${Global.url}/allItemServices`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        setItems(request.data);
        setLoading(false);
    };

    useEffect(()=>{
        filterDate()
    }, [search])

    useEffect(()=>{
        cop.length === 0 ? setBotonDoctor(true) : setBotonDoctor(false)
    }, [cop])

    const filterDate = () =>{
        if(search.length > 4){
            const filter = odontologos.filter(
            odon => odon.cop.toString() === (search)
            );

            if(filter.length === 1) {
                if(filter[0].cop.toString().length === search.length){
                    setOdontologo(`${filter[0].nombres} ${filter[0].apellido_p} ${filter[0].apellido_m}`);
                    setCop(filter[0].cop);
                    setIdOdontologo(filter[0].id);
                    setEmailOdon(filter[0].correo);
                    return filter[0];
                }
            }else{
                const filter = [];
                setIdOdontologo(0);
                setOdontologo("");
                setCop("");
                setEmailOdon("");
                return filter[0];
            }

        }else {
            const filter = [];
            setIdOdontologo(0);
            setOdontologo("");
            setCop("");
            setEmailOdon("");
            return filter[0];
        }
    }
    
    const llenarArray = (orden) => {
         const ordenExisente = elementos.findIndex(
            (ordenExisente) => ordenExisente.id_item === orden.id_item
          );
          if (ordenExisente === -1) {
            setElementos([...elementos, orden]);
          } else {
            const nuevaOrden = [...elementos];
            nuevaOrden[ordenExisente] = orden;
            setElementos(nuevaOrden);
          }

          const ordenExisente2 = llenarserv.findIndex(
            (ordenExisente) => ordenExisente.id_servicio === orden.id_servicio
          );
          if (ordenExisente2 === -1) {
            setLlenarServ([...llenarserv, orden]);
          } else {
            const nuevaOrden2 = [...llenarserv];
            nuevaOrden2[ordenExisente2] = orden;
            setLlenarServ(nuevaOrden2);
          }
    };

    const llenarImpresion = (orden) => {
        setAgregarComisiones(false);
        const ordenExisente = impresionCheck.findIndex((ordenExisente) => (
                ordenExisente.id === orden.id
            )
        );
            
          if (ordenExisente === -1) {
            setImpresionCheck([...impresionCheck, orden]);
          } else {
            const nuevaOrden = [...impresionCheck];
            nuevaOrden[ordenExisente] = orden;
            setImpresionCheck(nuevaOrden);
          }
    };

    const AGREGARPRECIO = () =>{
        let count=0;
        if(agregarComisiones === false){
            for (let i = 0; i < elementos.length; i++) {
                for (let j = 0; j <impresionCheck.length; j++) {
                    if(elementos[i].estado === true && elementos[i].precio === (elementos[i].precio_impresion)-(elementos[i].comision_impreso)){
                        elementos[i].precio = (elementos[i].precio_impresion);
                    }else if(elementos[i].estado === true && elementos[i].precio === (elementos[i].precio_digital)-(elementos[i].comision_digital)){
                        elementos[i].precio = (elementos[i].precio_digital);
                    }
                    if(elementos[i].id_servicio == impresionCheck[j].id && impresionCheck[j].estado === true && elementos[i].estado === true){
                        elementos[i].precio = elementos[i].precio_impresion;
                    }else  if(elementos[i].id_servicio == impresionCheck[j].id && impresionCheck[j].estado === false && elementos[i].estado === true){
                        elementos[i].precio = elementos[i].precio_digital;
                    }
                    count++;
                }
            }
            if(count === 0){
                for (let i = 0; i < elementos.length; i++) {
                    count=0;
                    elementos[i].precio = elementos[i].precio_digital;
                }
            }    
        }else{
            for (let i = 0; i < elementos.length; i++) {
                for (let j = 0; j <impresionCheck.length; j++) {
                    if(elementos[i].estado === true && elementos[i].precio === elementos[i].precio_impresion){
                        elementos[i].precio = (elementos[i].precio_impresion)-(elementos[i].comision_impreso);
                    }else if(elementos[i].estado === true && elementos[i].precio === elementos[i].precio_digital){
                        elementos[i].precio = (elementos[i].precio_digital)-(elementos[i].comision_digital);
                    }
                    count++;
                }
            }

            if(count === 0){
                for (let i = 0; i < elementos.length; i++) {
                    count=0;
                    elementos[i].precio = (elementos[i].precio_digital)-(elementos[i].comision_digital);
                }
            }   

        }  
        setTotalPrecio(elementos.reduce((acumulador, producto) => {
            return acumulador = acumulador + (
                producto.estado === true ? 
                (parseFloat(producto.precio)) 
                : 0
                );
        }, 0))
    }
    useEffect(()=>{
        AGREGARPRECIO();
    },[agregarComisiones])
    
    useEffect(()=>{
        AGREGARPRECIO();
    }, [impresionCheck])

    useEffect(()=>{
        AGREGARPRECIO();
        arreglosyaenviad()
    }, [elementos])

    const saveOrdenVirtual = async (e) => {
        e.preventDefault();
        if(elementos.length == 0 || !elementos.some(elemento => elemento.estado == true)){
            Swal.fire('Debe seleccionar un tipo de examen', '', 'error');
        }else{
        let token = localStorage.getItem("token");

        const data = new FormData();
        data.append('id_creacion', auth.id);
        data.append('id_modificacion', auth.id);

        data.append('id_paciente', idPaciente);
        data.append('id_odontologo', auth.id);


        data.append('id_clinica', auth.clinica);
        data.append('consulta', consulta);

        data.append('box18', box18 === true ? 1 : 0);
        data.append('box17', box17 === true ? 1 : 0);
        data.append('box16', box16 === true ? 1 : 0);
        data.append('box15', box15 === true ? 1 : 0);
        data.append('box14', box14 === true ? 1 : 0);
        data.append('box13', box13 === true ? 1 : 0);
        data.append('box12', box12 === true ? 1 : 0);
        data.append('box11', box11 === true ? 1 : 0);

        data.append('box21', box21 === true ? 1 : 0);
        data.append('box22', box22 === true ? 1 : 0);
        data.append('box23', box23 === true ? 1 : 0);
        data.append('box24', box24 === true ? 1 : 0);
        data.append('box25', box25 === true ? 1 : 0);
        data.append('box26', box26 === true ? 1 : 0);
        data.append('box27', box27 === true ? 1 : 0);
        data.append('box28', box28 === true ? 1 : 0);

        data.append('box48', box48 === true ? 1 : 0);
        data.append('box47', box47 === true ? 1 : 0);
        data.append('box46', box46 === true ? 1 : 0);
        data.append('box45', box45 === true ? 1 : 0);
        data.append('box44', box44 === true ? 1 : 0);
        data.append('box43', box43 === true ? 1 : 0);
        data.append('box42', box42 === true ? 1 : 0);
        data.append('box41', box41 === true ? 1 : 0);

        data.append('box31', box31 === true ? 1 : 0);
        data.append('box32', box32 === true ? 1 : 0);
        data.append('box33', box33 === true ? 1 : 0);
        data.append('box34', box34 === true ? 1 : 0);
        data.append('box35', box35 === true ? 1 : 0);
        data.append('box36', box36 === true ? 1 : 0);
        data.append('box37', box37 === true ? 1 : 0);
        data.append('box38', box38 === true ? 1 : 0);

        data.append('siConGuias', siConGuias == true ? 1 : 0);
        data.append('noConGuias', noConGuias == true ? 1 : 0);

        data.append('listaServicios', JSON.stringify(impresionCheck));
        data.append('impresionServicios', JSON.stringify(serviciosEstate));
        data.append('arryServicios', JSON.stringify(llenarserv));
        data.append('listaItems', JSON.stringify(elementos));
        data.append('precio_final', totalPrecio);
        data.append('metodoPago', metodoPago);

        data.append('otrosAnalisis', otrosAnalisis);
        data.append('estado', 0);
        data.append('activeComision', agregarComisiones === true ? 1 : 0);

        try {
            let respuesta = await axios.post(`${Global.url}/saveOrdenVirtual`, data,{
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(respuesta.data.status === "success"){
                Swal.fire('Orden generada correctamente', '', 'success');
                navigate('/admin/ordenes');
            }else{
                Swal.fire('Error al agregar el registro', '', 'error');
            }
        } catch (error) {
            let doctorcampo = document.querySelector('.disabled_item').value;
            if(doctorcampo.length <=0){
                Swal.fire('Debe registrar el doctor', '', 'error');
            }
            else if((error.request.response).includes("listaItems")){
                Swal.fire('Por lo menos debe seleccionar un servicio', '', 'error');
            }
            else if((error.request.response).includes("consulta")){
                Swal.fire('El campo consulta es obligatorio', '', 'error');
            }
        }
    }

    }

    const arreglosyaenviad =() =>{
        for(let i = 0; i < llenarserv.length; i++){
            const llenos = elementos.some(objeto => objeto.estado === true && objeto.id_servicio ===  llenarserv[i].id_servicio)
            if(llenos === false){
                const index = serviciosEstate.findIndex(item => item.id_servicio === llenarserv[i].id_servicio);
                if (index !== -1) {
                    serviciosEstate.splice(index, 1);
                } 
            }else{
                const existe = serviciosEstate.find(id => id.id_servicio === llenarserv[i].id_servicio);
                if (!existe) {
                    setServiciosState([...serviciosEstate, llenarserv[i]])
                }
            }
        }
    }

    const [open, setOpen] = useState(0);
 
    const handleOpen = (value) => {
      setOpen(open === value ? 0 : value);
    };

    function Icon({ id, open }) {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              id === open ? "rotate-180" : ""
            } h-5 w-5 transition-transform`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        );
    }

    useEffect(() =>{
        getCliente();
        getAllOdontologos();
        getAllServicios();
        getAllItems();
    },[])

    useEffect(() => {
        setTitle("REGISTRAR ORDEN VIRTUAL");
    }, []);

    const handleChangeCheckbox = () => {
        const isChecked = !agregarComisiones; // Invierte el valor actual del checkbox
        setAgregarComisiones(isChecked);
      
        if (isChecked) {
          // Mostrar SweetAlert solo cuando se marque el checkbox
          Swal.fire({
            title: '¿Deseas restar las comisiones?',
            html:
            '<b>Las comisiones seran retiradas</b> y se le descontara en el pago final a su paciente',
            showCancelButton: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            icon: 'question',
          }).then((result) => {
            if (result.isConfirmed) {
              setAgregarComisiones(true);
            } else {
              setAgregarComisiones(false);
            }
          });
        }
    };

  return (
    <>
        {auth.id_rol == 1 ? 
            <>
                <div className="">
                    {loading ?
                        <Loading/>
                    :
                    <div className="card">
                        <form className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10" onSubmit={saveOrdenVirtual}>
                            <img src={logo} alt="" className='mx-auto w-full px-4 md:px-0 md:w-[50%]'/>
                            <div className="flex w-full mt-5 md:mt-0">
                                <div className="w-full flex flex-col text-white">
                                    <label className="bg-main px-4 text-white py-2 w-fit rounded-t-md" >DATOS DEL PACIENTE </label>
                                    <div className='mb-3 w-full bg-[#E1D0E2] rounded-md rounded-tl-none p-3 text-black flex flex-col md:flex-row gap-5 items-center'>
                                        <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-2">
                                            <label className="font-bold text-main text-lg w-fit">Nombres: </label>
                                            <input className="bg-transparent rounded-lg border-b border-main px-4 w-full" disabled  required
                                                value={nombres}
                                                type="text"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 flex gap-2">
                                            <label className="font-bold text-main text-lg w-fit text-left md:text-center">Edad: </label>
                                            <input className="bg-transparent rounded-lg border-b border-main px-4 form-control2 w-full text-center" disabled  required
                                                value={edad}
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                    <div className='mb-3 w-full bg-[#E1D0E2] rounded-md  p-3 text-black flex flex-col md:flex-row gap-4 md:gap-0  items-start md:items-center'>
                                        <div className="w-full md:w-2/5 flex flex-col md:flex-row gap-2">
                                            <label className="font-bold text-main text-lg inline">Fecha de Nacimiento: </label>
                                             <DatePicker
                                                className="bg-transparent rounded-lg border-b border-main px-4 w-auto flex-grow"
                                                selected={fecha}
                                                value={fecha}
                                                disabled
                                                dateFormat="dd/MM/yyyy"
                                                locale={es}
                                            />
                                        </div>
                                        <div className="flex w-full md:w-2/5 items-center md:justify-center gap-2">
                                            <label className="font-bold text-main text-lg w-fit inline">Sexo:</label>
                                            <div className='w-fit flex justify-between items-center gap-2'>
                                                <span className=''>M</span>
                                                <input value={varon} type="checkbox" className='on_active w-6 h-6' disabled onChange={(e) => setVaron(e.target.checked)} checked={varon} />
                                                <span className="">F</span>
                                                <input value={mujer} type="checkbox" className='on_active  w-6 h-6' disabled onChange={(e) => setMujer(e.target.checked)} checked={mujer}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mb-3 w-full bg-[#E1D0E2] rounded-md  p-3 text-black flex flex-col md:flex-row gap-4 md:gap-12  items-start md:items-center'>
                                        <div className="flex w-full md:w-1/2 items-center gap-2">
                                            <label className="font-bold text-main text-lg w-fit inline">Correo: </label>
                                            <input className="bg-transparent rounded-lg border-b border-main px-4 w-full"  disabled  required
                                                value={correo_paciente}
                                                type="text"
                                            />
                                        </div>
                                        <div className="flex w-full md:w-1/2 items-center gap-2">
                                            <label className="font-bold text-main text-lg w-fit inline">Telefono: </label>
                                            <input className="bg-transparent rounded-lg border-b border-main px-4 w-full text-center"  disabled  required
                                                value={celular}
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                    <div className='mb-8 w-full bg-[#E1D0E2] rounded-md  p-3 text-black flex  items-center'>
                                        <div className="w-full flex flex-col md:flex-row flex-start md:items-center gap-3">
                                            <label className="font-bold text-main text-lg inline" >Motivo de consulta: </label>
                                            <input className="bg-transparent rounded-lg border-b border-main px-4 w-auto flex-grow outline-none" autoFocus 
                                                value={consulta}
                                                type="text"
                                                onChange={(e) => setConsulta(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full mb-8'>
                                        <label className="bg-main px-4 text-white py-2 w-fit rounded-t-md">DATOS DEL DOCTOR(A) </label>
                                        <div className='mb-3 w-full bg-[#E1D0E2] rounded-md rounded-tl-none p-3 text-black flex items-center'>
                                            <div className="w-full flex flex-col md:flex-row gap-3">
                                                <label className="font-bold text-main text-lg inline">Doctor(a): </label>
                                                <input className="bg-transparent rounded-lg border-b border-main px-4 w-auto flex-grow" required disabled
                                                    value={odontologo}
                                                    type="text"
                                                    onChange={(e) => setOdontologo(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className='mb-3 w-full bg-[#E1D0E2] rounded-md  p-3 text-black flex flex-col md:flex-row gap-5 items-start md:items-center'>
                                            <div className="w-1/2 flex gap-2">
                                                <label className="font-bold text-main text-lg inline">C.O.P: </label>
                                                <input className="bg-transparent rounded-lg border-b border-main px-4 w-auto flex-grow" required disabled
                                                    value={cop}
                                                    type="text"
                                                    onChange={(e) => setCop(e.target.value)}
                                                />
                                            </div>

                                            <div className="w-1/2 flex gap-2">
                                                <label className="font-bold text-main text-lg inline">Celular: </label>
                                                <input className="bg-transparent rounded-lg border-b border-main px-4 w-auto flex-grow" required disabled
                                                    value={celular_Odon}
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className='mb-3 w-full bg-[#E1D0E2] rounded-md  p-3 text-black flex flex-col md:flex-row gap-5 items-start md:items-center'>
                                            <div className="w-full flex gap-2">
                                                <label className="font-bold text-main text-lg inline">Email: </label>
                                                <input className="bg-transparent rounded-lg border-b border-main px-4 w-auto flex-grow" required disabled
                                                    value={emailOdon}
                                                    type="text"
                                                    onChange={(e) => setCop(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {idServicio != 0 ?
                                    <Fragment>
                                        {servicios.map((servicio) => (
                                        <Accordion open={open === servicio.id} icon={<Icon id={servicio.id} open={open} />} className='mb-3' key={servicio.id}>
                                            <AccordionHeader onClick={() => handleOpen(servicio.id)} className='bg-white text-base text-main shadow-sm shadow-main px-3 rounded-lg'>
                                            {servicio.nombre}
                                            </AccordionHeader>
                                            {open === servicio.id &&
                                            <Accordion.Body className="relative opacity-100 transition-opacity">
                                                {
                                                    servicio.impreso === 1 ?
                                                    <div className='item_impresion w-fit right-0 top-5 flex items-center justify-center bg-[#E1D0E2] px-4 py-2 rounded-md mb-5 ml-4'>
                                                        <span className='text-black text-base   mr-3'>¿Desea los resultados en físico?</span>
                                                        <input type="checkbox" 
                                                            checked={impresionCheck.find(estado => estado.id === servicio.id)?.estado || false}
                                                            id={"checkboxi"+servicio.id} className='on_active p-2'  
                                                            onChange={(e)=>{llenarImpresion({
                                                                id: servicio.id, 
                                                                estado: e.target.checked, 
                                                            })}}
                                                        />
                                                    </div>
                                                    : ""
                                                }
                                                <div  className='w-full'>
                                                    <ul className="w-full md:columns-2 px-4">
                                                        {items.map((item) => (
                                                        item.id_servicio === servicio.id ?   
                                                        <li key={item.id} className='flex gap-3 mb-4 items-center'>
                                                            <input type="checkbox" 
                                                            checked={elementos.find(estado => estado.id_item === item.id)?.estado || false}
                                                            id={"checkboxi"+item.id} className='on_active p-2'  
                                                            onChange={
                                                                (e)=>{llenarArray({
                                                                id_item: item.id, 
                                                                id_servicio: servicio.id, 
                                                                estado: e.target.checked, 
                                                                precio: item.precio_digital,
                                                                precio_impresion: item.precio_impresion,
                                                                precio_digital: item.precio_digital,
                                                                comision_impreso: item.comision_impreso,
                                                                comision_digital: item.comision_digital,
                                                                })}
                                                            }
                                                            />
                                                            <span className='text-main'>{item.nombre}</span>
                                                        </li>
                                                        : ""
                                                        ))}
                                                    </ul>
                                                </div>

                                                {servicio.id === 1 ?
                                                <div className='flex flex-col justify-center items-center mt-10'>
                                                    <label className="bg-main px-4 text-white py-2 w-fit rounded-t-md">IMPLANTES / ENDODONCIA</label>
                                                    <div className='flex h-fit'>
                                                        <div className='h-auto bg-black flex items-center w-8 justify-center'>
                                                            <p className='w-full text-3xl text-center'>D</p>
                                                        </div>
                                                        <div>
                                                            <div className='h-auto'>
                                                                <ul className="w-full columns-3 md:flex flex-row">
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box18} onChange={(e) => setBox18(e.target.checked)} checked={box18}/>
                                                                        <span className=''>1.8</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box17} onChange={(e) => setBox17(e.target.checked)} checked={box17}/>
                                                                        <span className="">1.7</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box16} onChange={(e) => setBox16(e.target.checked)} checked={box16}/>
                                                                        <span className="">1.6</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box15} onChange={(e) => setBox15(e.target.checked)} checked={box15}/>
                                                                        <span className="">1.5</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box14} onChange={(e) => setBox14(e.target.checked)} checked={box14}/>
                                                                        <span className="">1.4</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box13} onChange={(e) => setBox13(e.target.checked)} checked={box13}/>
                                                                        <span className="">1.3</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box12} onChange={(e) => setBox12(e.target.checked)} checked={box12}/>
                                                                        <span className="">1.2</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box11} onChange={(e) => setBox11(e.target.checked)} checked={box11}/>
                                                                        <span className="">1.1</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box21} onChange={(e) => setBox21(e.target.checked)} checked={box21}/>
                                                                        <span className="">2.1</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box22} onChange={(e) => setBox22(e.target.checked)} checked={box22}/>
                                                                        <span className="">2.2</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box23} onChange={(e) => setBox23(e.target.checked)} checked={box23}/>
                                                                        <span className="">2.3</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box24} onChange={(e) => setBox24(e.target.checked)} checked={box24}/>
                                                                        <span className="">2.4</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box25} onChange={(e) => setBox25(e.target.checked)} checked={box25}/>
                                                                        <span className="">2.5</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box26} onChange={(e) => setBox26(e.target.checked)} checked={box26}/>
                                                                        <span className="">2.6</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box27} onChange={(e) => setBox27(e.target.checked)} checked={box27}/>
                                                                        <span className="">2.7</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box28} onChange={(e) => setBox28(e.target.checked)} checked={box28}/>
                                                                        <span className="">2.8</span>
                                                                    </div>
                                                                </ul>
                                                            </div>
                                                            <div className='mt-5 md:mt-0'>
                                                                <div className="w-full columns-3 md:flex flex-row">
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box48} onChange={(e) => setBox48(e.target.checked)} checked={box48} />
                                                                        <span className=''>4.8</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box47} onChange={(e) => setBox47(e.target.checked)} checked={box47}/>
                                                                        <span className="">4.7</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box46} onChange={(e) => setBox46(e.target.checked)} checked={box46}/>
                                                                        <span className="">4.6</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box45} onChange={(e) => setBox45(e.target.checked)} checked={box45}/>
                                                                        <span className="">4.5</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box44} onChange={(e) => setBox44(e.target.checked)} checked={box44}/>
                                                                        <span className="">4.4</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box43} onChange={(e) => setBox43(e.target.checked)} checked={box43}/>
                                                                        <span className="">4.3</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box42} onChange={(e) => setBox42(e.target.checked)} checked={box42}/>
                                                                        <span className="">4.2</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box41} onChange={(e) => setBox41(e.target.checked)} checked={box41}/>
                                                                        <span className="">4.1</span>
                                                                    </div>

                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box31} onChange={(e) => setBox31(e.target.checked)} checked={box31}/>
                                                                        <span className="">3.1</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box32} onChange={(e) => setBox32(e.target.checked)} checked={box32}/>
                                                                        <span className="">3.2</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box33} onChange={(e) => setBox33(e.target.checked)} checked={box33}/>
                                                                        <span className="">3.3</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box34} onChange={(e) => setBox34(e.target.checked)} checked={box34}/>
                                                                        <span className="">3.4</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box35} onChange={(e) => setBox35(e.target.checked)} checked={box35}/>
                                                                        <span className="">3.5</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box36} onChange={(e) => setBox36(e.target.checked)} checked={box36}/>
                                                                        <span className="">3.6</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box37} onChange={(e) => setBox37(e.target.checked)} checked={box37}/>
                                                                        <span className="">3.7</span>
                                                                    </div>
                                                                    <div className='content_cuadrados'>
                                                                        <input type="checkbox" className='' value={box38} onChange={(e) => setBox38(e.target.checked)} checked={box38}/>
                                                                        <span className="">3.8</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='h-auto bg-black flex items-center w-8 justify-center'>
                                                            <p className='w-full text-3xl text-center'>I</p>
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-row'>
                                                        <span className='text-main md:text-lg mr-3 mt-4 md:mt-0'>MUY IMPORTANTE: ¿El paciente es enviado con guias?</span> 
                                                        <div className='flex gap-3 items-center'>
                                                            <span className="text-black">Si</span>
                                                            <input type="checkbox" className='on_active p-2 h-0 w-0' checked={siConGuias}  value={siConGuias} onChange={(e) =>{
                                                                setSiConGuias(e.target.checked)
                                                                setNoConGuias(false)
                                                            }
                                                            } />
                                                        </div>
                                                        <div className='flex gap-3 items-center ml-3'>
                                                            <span className="text-black">No</span>
                                                            <input type="checkbox" className='on_active p-2 h-0 w-0'  value={noConGuias} onChange={(e) => {setNoConGuias(e.target.checked) , setSiConGuias(false)}} checked={noConGuias} />
                                                        </div>
                                                    </div>
                                                </div>
                                                : ""}
                                            </Accordion.Body>}
                                        </Accordion>
                                        ))}
                                    </Fragment>
                                    : ""} 

                                    <label className="bg-main px-4 text-white py-2 w-fit rounded-t-md mt-8 ">OTROS: </label>

                                    <div className='mb-3 col-md-12 div_general_box div_general_box2'>
                                        <div className="">
                                            <textarea type="text" className="bg-transparent resize-none rounded-lg border text-black outline-none py-2 rounded-t-none border-main px-4 w-full" rows="4"  value={otrosAnalisis} onChange={(e) => setOtrosAnalisis(e.target.value)}></textarea>
                                        </div>
                                    </div>

                            </div>
                            </div>
                            <div className="flex w-full justify-end gap-3 rounded-md text-black">
                                <Link to="/admin/registrar" className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer">Cancelar</Link>
                                <input type="submit" className="bg-main px-3 py-2 text-white rounded-md cursor-pointer" value="Registrar" />
                            </div>
                        </form>
                    </div>}
                </div>
            </>
            :""
        }
    </>
  )
}
