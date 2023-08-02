import {Outlet } from 'react-router-dom';
import Header from './includes/Header';
export const PublicLayout = () => {
    return (
      <>
        <Header/>
        <Outlet/>
      </>
    )
}