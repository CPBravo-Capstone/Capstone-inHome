// import { useState } from 'react'
import "./App.css";
import homeLogo from "./assets/ihome.svg";
import navbg from  "./assets/navbg.png";

function App() {

  return (
    <>
      <nav className={`navbar bg-base-100 bg-[url(${homeLogo})] bg-fill bg-center`}>
        <div className='navbar-start'>
          <div className='dropdown ml-9'>
            <div
              tabIndex={0}
              role='button'
              className='btn btn-ghost btn-circle'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h7'
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Services</a>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
        </div>
        <div className='m-2 navbar-end'>
          <div className='w-12 rounded-full'>
            <img alt='Tailwind CSS Navbar component' src={homeLogo} />
          </div>
          <a className='btn btn-ghost text-4xl'>inHome </a>
        </div>

        <div className='navbar-end'>
          {/* <button className="btn btn-ghost btn-circle">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </button> */}
        </div>

        <input
          type='text'
          placeholder='Enter Email'
          className='input input-bordered  max-w-xs '
        />
        <button className='btn btn-accent ml-2 mr-2'>Register Today!</button>

        <div className='dropdown dropdown-end'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost btn-circle avatar mt-1'
          >
            <div className='w-12 rounded-full '>
              <img
                alt='Account'
                src='https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className='m-1 z-[1] p-2 shadow menu menu-m dropdown-content bg-base-100 rounded-box w-52'
          >
            <li>
              {/* <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a> */}
            </li>
            <li>
              <a>Login</a>
            </li>
            <li>
              <a>Register</a>
            </li>
            <li>
              <label className='flex cursor-pointer gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <circle cx='12' cy='12' r='5' />
                  <path d='M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' />
                </svg>
                <input
                  type='checkbox'
                  value='synthwave'
                  className='toggle theme-controller'
                />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
                </svg>
              </label>
            </li>
          </ul>
        </div>
      </nav>

      <div className="h-20 flex-1 fixed-center">        
        <h1>
                Hello
        </h1>
      </div>   

      <footer className='footer footer-center p-10 bg-base-200 text-base-content rounded'>
        <nav className='grid grid-flow-col gap-4'>
          <a className='link link-hover'>About us</a>
          <a className='link link-hover'>Contact</a>
          <a className='link link-hover'>Help</a>
        </nav>
        <aside>
          <p>Copyright © 2024 - All right reserved by inHome Real Estate Solutions</p>
        </aside>
      </footer>
    </>
  );
}

export default App;

// {/*
//     <div  className="navbar bg-base-200 ">
//       <div className="flex-1 m-3">
//         <div className="w-12 rounded-full">
//           <img alt="Tailwind CSS Navbar component" src={homeLogo}/>
//         </div>
//         <a className="btn btn-ghost text-xl">inHome </a>
//         <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
//             <li><a>Home</a></li>
//             <li><a>Services</a></li>
//             <li><a>Resources</a></li>
//             <li><a>Pricing</a></li>
//             <li><a>About</a></li>

//         </ul>
//       <div className='flex-1 flex justify-end '>
//       <input type="text" placeholder="Enter Email" className="input input-bordered w-full max-w-xs " />
//       <button className="btn btn-accent ml-2 mr-2">Register Today!</button>
//     </div>
//       <div className="flex-none gap-2">
//           <div className="dropdown dropdown-end">
//             <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//               <div className="w-12 rounded-full">
//                 <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
//               </div>
//             </div>
//             <ul tabIndex={0} className="mt-4 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">

//               <li>
//                 <a className="justify-between">
//                   Profile
//                   <span className="badge">New</span>
//                 </a>
//               </li>
//               <li><a>Settings</a></li>
//               <li><a>Logout</a></li>
//               <li>
//                 <label className="flex cursor-pointer gap-2">
//                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
//                   <input type="checkbox" value="synthwave" className="toggle theme-controller"/>
//                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
//                 </label>
//               </li>
//             </ul>
//           </div>
//        </div>
//        </div>
//     </div> */}
