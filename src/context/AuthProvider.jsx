import React from 'react';
import { useState,useEffect, createContext } from 'react';
import { Global } from './../helper/Global';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("")

    useEffect(()=>{
        authUser();
    }, []);

    const authUser = async() =>{
        //SACAR DATOS DEL USUARIO IDENTIFICADO DEL LOCALSTORAGE
        let token = localStorage.getItem("token");
        let user = localStorage.getItem("user");

        //COMPROBRAR SI TENGO EL TOKEN Y EL USER
        if(!token || !user){
            setLoading(false);
            return false;
        }
        //PETICION AJAX AL BACKEND QUE COMPRUEBE EL TOKEN Y QUE RETORNE DATOS DEL USER
        let respuesta= await axios.get(`${Global.url}/user-profile`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        
        //SETEAR LOS DATOS
        setAuth(respuesta.data.user);
        setLoading(false);
    }

  return (
        <AuthContext.Provider value={{
                auth,
                setAuth,
                loading,
                title,
                setTitle
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
