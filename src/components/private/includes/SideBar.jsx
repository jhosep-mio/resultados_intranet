import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
// Icons
import { GiCottonFlower } from "react-icons/gi";
import {
  RiLogoutCircleRLine,
  RiMenu3Line,
  RiCloseLine,
  RiStackFill,
  RiDownload2Fill,
} from "react-icons/ri";
import axios from "axios";
import { Global } from "../../../helper/Global";
import logo from "./../../../assets/logo/icono.png";

const SideBar = () => {
  const { auth, setAuth } = useAuth({});

  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showSubmenu2, setShowSubmenu2] = useState(false);

  const cerrarSession = async () => {
    let token = localStorage.getItem("token");

    const data = new FormData();
    data.append("_method", "POST");

    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.clear();
    setAuth({});
    navigate("/login");
  };

  return (
    <>
      <div
        className={`xl:h-[100vh] overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-white shadow-xl py-3 px-2 flex flex-col justify-between z-50 ${
          showMenu ? "left-0" : "-left-full"
        } transition-all`}
      >
        <div>
          <h1 className="text-center text-2xl font-bold text-black mb-4">
            <img src={logo} alt="" className="m-auto w-12 mx-auto" />
          </h1>
          <hr className="mb-5" />
          <ul className="ml-0 p-0">
            {auth.id_rol == 0 ? (
              <li>
                <Link
                  to="resultados"
                  onClick={()=>{setShowMenu(false)}}
                  className="flex items-center gap-2 font-bold py-2 px-2 text-sm rounded-lg text-main hover:bg-main_2-100 hover:text-main transition-colors text-"
                >
                  <RiStackFill className="text-main text-xl" /> RESULTADOS
                </Link>
              </li>
            ) : auth.id_rol == 1 ? (
              <li>
                <Link
                  to="ordenes"
                  onClick={()=>{setShowMenu(false)}}
                  className="flex items-center gap-2 py-2 px-2 font-bold rounded-lg text-main hover:bg-main_2-100 hover:text-main transition-colors"
                >
                  <RiStackFill className="text-main" onClick={()=>{setShowMenu(false)}}/> RESULTADOS
                </Link>
              </li>
            ) : (
              ""
            )}
            <li>
              <Link
                to="resultados"
                className="flex items-center gap-2 py-2 px-2 rounded-lg font-bold text-sm text-main hover:bg-main_2-100 hover:text-main transition-colors text-"
              >
                <RiDownload2Fill className="text-main font-bold text-xl" /> DESCARGAR NNT VIEWER
              </Link>
            </li>
          </ul>
        </div>
        <nav>
          <Link
            onClick={cerrarSession}
            className="flex items-center gap-4 py-2 px-4  font-bold rounded-lg hover:bg-main_2-100 text-main transition-colors hover:text-main"
          >
            <RiLogoutCircleRLine className="text-main font-bold text-xl" /> Cerrar sesión
          </Link>
        </nav>
      </div>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden fixed bottom-4 right-4 bg-main text-white p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  );
};

export default SideBar;
