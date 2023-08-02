import React from "react";
import {
  RiNotification3Line,
  RiArrowDownSLine,
  RiSettings3Line,
  RiLogoutCircleRLine,
  RiThumbUpLine,
  RiChat3Line,
  RiAddFill
} from "react-icons/ri";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import icono  from './../../../assets/logo/icono_white.png'
import axios from "axios";
import { Global } from "../../../helper/Global";


const Header = () => {

  const {auth,setAuth,title} = useAuth({});

  const cerrarSession = async() =>{
    let token = localStorage.getItem("token");

    const data = new FormData();
    data.append('_method', "POST");

    await axios.post(`${Global.url}/logout`, data ,{
        headers:{
            'Authorization': `Bearer ${token}`
        }
    });
    localStorage.clear();
        setAuth({});
        navigate("/login");
}

  return (
    <header className="h-[7vh] md:h-[10vh] border-b border-gray-100 shadow-sm p-8 flex items-center justify-between z-10 bg-cuarto">
      <div className="flex gap-3 md:gap-5">
        <p className="font-bold text-white text-sm md:text-lg">{title}</p>
      </div>
      <nav className="flex items-center gap-2">
        <Menu
          menuButton={
            <MenuButton className="flex items-center gap-x-2 hover:bg-[#f1f1f1] group p-2 rounded-lg transition-colors">
              <img
                src={icono}
                className="w-6 h-6 object-contain rounded-full"
              />
              <span className="text-white group-hover:text-main line-clamp-1">{auth.nombres} {auth.apellido_p} {auth.apellido_m}</span>
              <RiArrowDownSLine />
            </MenuButton>
          }
          align="end"
          arrow
          arrowClassName="bg-secondary-100"
          transition
          menuClassName="bg-secondary-100 p-4"
        >
          <MenuItem className="p-0 hover:bg-transparent group">
            <Link
              to="/perfil"
              className="rounded-lg transition-colors text-gray-300 hover:bg-main_2-100 flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <img
                src={icono}
                className="w-8 h-8 object-contain rounded-full"
              />
              <div className="flex flex-col text-sm ">
                <span className="text-sm group-hover:text-black">{auth.nombres} {auth.apellido_p} {auth.apellido_m}</span>
                <span className="text-xs group-hover:text-black">{auth.correo}</span>
              </div>
            </Link>
          </MenuItem>
          <hr className="my-4 border-gray-500" />
          <MenuItem className="p-0 hover:bg-transparent group">
            <Link
              onClick={cerrarSession}
              className="rounded-lg transition-colors text-gray-300 group-hover:text-black hover:bg-main_2-100 flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <RiLogoutCircleRLine /> Cerrar sesión
            </Link>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  );
};

export default Header;
