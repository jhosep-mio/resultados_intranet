import React from 'react'

export const Errors = (props) => {
  return (
    <p className="text-sm p-0 m-0">{props.error && <span className="text-main">Campo requerido</span>}</p>
  )
}
