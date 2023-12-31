import React from "react";
import { useState, useEffect, createContext } from "react";
import { Global } from "./../helper/Global";
import axios from "axios";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [loadingDowload, setLoadingDowload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [array, setId] = useState({});
  let token = localStorage.getItem("token");

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    //SACAR DATOS DEL USUARIO IDENTIFICADO DEL LOCALSTORAGE
    let token = localStorage.getItem("token");
    let user = localStorage.getItem("user");

    //COMPROBRAR SI TENGO EL TOKEN Y EL USER
    if (!token || !user) {
      setLoading(false);
      return false;
    }
    //PETICION AJAX AL BACKEND QUE COMPRUEBE EL TOKEN Y QUE RETORNE DATOS DEL USER
    let respuesta = await axios.get(`${Global.url}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    //SETEAR LOS DATOS
    setAuth(respuesta.data.user);
    setLoading(false);
  };

  const descargarImagenes = async () => {
    try {
      setLoadingDowload(true);
      const response = await axios({
        method: "get",
        url: `${Global.url}/dowloads/${array.id}`,
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          console.log(progressEvent);
          setDownloadProgress(progress);
        },
      });
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${array.nombres}_${array.fecha_at}_${array.id}.zip`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Swal.fire(
        "Archivos descargados, por favor revise sus descargas.",
        "",
        "success"
      );
    } catch (error) {
      Swal.fire("Error al descargar el archivo ZIP", "", "error");
    }
    setLoadingDowload(false);
    setDownloadProgress(0);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        title,
        setTitle,
        descargarImagenes,
        loadingDowload,
        downloadProgress,
        setId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
