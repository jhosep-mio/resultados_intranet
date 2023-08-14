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
import logo from "./../../../assets/logo/logo.png";

const SideBar = () => {
  const { auth, setAuth, loadingDowload, downloadProgress } = useAuth({});

  const [showMenu, setShowMenu] = useState(false);

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
        className={`xl:h-[100vh] overflow-y-hidden fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-white shadow-xl py-3 px-2 flex flex-col justify-between z-50 ${
          showMenu ? "left-0" : "-left-full"
        } transition-all`}
      >
        <div>
          <h1 className="text-center text-2xl font-bold text-black mb-4">
            <img
              src={logo}
              alt=""
              className="m-auto w-full object-contain mx-auto"
            />
          </h1>
          <hr className="mb-5" />
          <ul className="ml-0 p-0">
            {auth.id_rol == 0 ? (
              <li>
                <Link
                  to="resultados"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 font-bold py-2 px-2 text-sm rounded-lg text-main hover:bg-[#f1f1f1] hover:text-main transition-colors ml-3"
                >
                  <RiStackFill className="text-main text-xl text-center" />{" "}
                  RESULTADOS
                </Link>
              </li>
            ) : auth.id_rol == 1 ? (
              <li>
                <Link
                  to="ordenes"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 py-2 px-2 font-bold rounded-lg text-center text-main hover:bg-[#f1f1f1] hover:text-main transition-colors ml-3"
                >
                  <RiStackFill
                    className="text-main"
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  />{" "}
                  RESULTADOS
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
        <nav>
          <Link
            onClick={cerrarSession}
            className="flex items-center gap-4 py-2 px-4  font-bold rounded-lg hover:bg-main_2-100 text-main transition-colors hover:text-main"
          >
            <RiLogoutCircleRLine className="text-main font-bold text-xl" />{" "}
            Cerrar sesión
          </Link>
        </nav>
      </div>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden fixed bottom-4 right-4 bg-main text-white p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>

      {loadingDowload && (
        <div className="w-full md:w-96  absolute right-0 px-3 md:px-0 md:right-3 bottom-3 z-[60]">
          <div className="relative flex items-center justify-center">
            <p className="text-black absolute inset-0 text-center">
              Preparando descarga {downloadProgress} %
            </p>
            <div
              style={{ width: "100%", background: "red" }}
              className="rounded-lg"
            >
              <div
                className="rounded-lg"
                style={{
                  width: `${downloadProgress}%`,
                  height: "25px",
                  background: "#4caf50",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
