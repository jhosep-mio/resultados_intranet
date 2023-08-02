import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useEffect } from "react";

export const Paginacion = ({
  totalPosts,
  cantidadRegistros,
  paginaActual,
  setpaginaActual,
}) => {
  const [numPaginas, setNumPaginas] = useState(0);

  useEffect(() => {
    const calcularNumPaginas = Math.ceil(totalPosts / cantidadRegistros);
    setNumPaginas(calcularNumPaginas);
  }, [totalPosts, cantidadRegistros]);

  const handleChange = (event, value) => {
    setpaginaActual(value);
  };

  return (
    <Pagination
      count={numPaginas}
      page={paginaActual}
      onChange={handleChange}
      className="cambiar_color"
    />
  );
};
