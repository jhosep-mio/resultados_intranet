import { Navigate, Outlet } from 'react-router-dom';
import Header from './includes/Header';
import SideBar from './includes/SideBar';
import useAuth from '../../hooks/useAuth';

export const PrivateLayout = () => {

const { auth, loading } = useAuth({});

  if(loading === true && auth){
    return <div className='centrarclase_do_spinner'>
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
  }else{
      return (
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-7">
          <SideBar />
          <div className="xl:col-span-6">
            <Header />
            <div className="h-[90vh] overflow-y-scroll py-2 px-4 md:px-8 relative">
            {
              auth.id ?
              <Outlet />
              :<Navigate to="/login"/>
            }
            </div>
          </div>

        </div>
      )
  }
}