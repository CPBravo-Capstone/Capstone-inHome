import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import homeLogo from "../assets/ihome.svg";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  return (
    <>
      <nav className={`navbar sticky top-0 z-50   shadow-xl  bg-base-100`}>
        <div className='flex-1'>
          <div className=''>

            <div className='dropdown ml-9 bg-base-100 rounded-full'>
              
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
              >
                <li>
                  <Link to={`/`}> Home </Link>
                </li>
                
                <div className='flex-1'> 
                  {/* Links */}
                  
                  {user ? (
                    <>
                      <button onClick={() => logout()}>Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to='/login/'>Login</Link>
                      <Link to='/register/'>Register</Link>
                    </>
                  )}
                </div>

                <li>
                  <Link to={`/about/`}> About </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link to='/'>
            <div className='btn btn-ghost m-3 h-max w-max flex rounded-full bg-base-200 navbar-center'>
              <div className='w-10  bg-yellow-400 rounded-full'>
                <img src={homeLogo} />
              </div>
              <h1 className=' text-5xl font-bold w-10navbar-center'>inHome </h1>
            </div>
          </Link>
          <div className='navbar'></div>

          {user ? (
            <>
            {user && user.role === 'landlord' && (
                <Link className="btn m-2" to="manager/properties/">Manage Properties</Link>
            )}
                      {user && user.role === 'tenant' && (
                <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/apartments')}
                >
                    View Apartments
                </button>
            )} 
              <Link
                className='btn m-2'
                to={user.role === "landlord" ? "/manager/" : "/tenant/"}
              >
                Profile
              </Link>
              <Link to='/'>
                <button className='btn m-2' onClick={logout}>
                  Logout
                </button>
              </Link>
              
            </>
          ) : (
            <>
              <Link className='btn m-2' to='/login/'>
                Login
              </Link>
              <Link className='btn m-2' to='/register/'>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
