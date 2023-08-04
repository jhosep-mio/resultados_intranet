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
    let token = localStorage.getItem("token");
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
          // Check if progressEvent.total is available, otherwise use estimated value
          const totalSize = progressEvent.total || /* Estimado de tamaño */ 1000000;
          const progress = Math.round((progressEvent.loaded / totalSize) * 100);
          setDownloadProgress(progress);
          console.log(progress);
        },
      });
  
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
    } catch (error) {
      console.log(error);
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
