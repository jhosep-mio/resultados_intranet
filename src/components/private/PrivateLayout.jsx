import { Navigate, Outlet } from "react-router-dom";
import Header from "./includes/Header";
import SideBar from "./includes/SideBar";
import useAuth from "../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading, loadingDowload } = useAuth({});

  if (loading === true && auth) {
    return (
      <div className="centrarclase_do_spinner">
        <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-7">
          <SideBar />
          <div className="xl:col-span-6">
            <Header />
            <div className="h-[90vh] overflow-y-scroll py-2 px-4 md:px-8 relative">
              {auth.id ? <Outlet /> : <Navigate to="/login" />}
            </div>
          </div>
        </div>

        {loadingDowload && (
          <div className="w-screen h-screen bg-black opacity-70 z-50 absolute inset-0 flex flex-col gap-5 items-center justify-center overflow-hidden">
            <ul className="loadin_ul h-12">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <p className="text-white text-xl md:text-2xl w-full px-5 md:px-0 md:w-[50%] font-bold text-center">
              Preparando la descarga, por favor espere. Recuerde que la
              velocidad de la descarga dependerá de la velocidad de su
              internet, gracias.
            </p>
          </div>
        )}
      </>
    );
  }
};
