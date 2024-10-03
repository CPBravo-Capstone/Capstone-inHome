import { useState, useEffect } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../utilities";


export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, setUser } = useAuth();
    // const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await api.post("user/login/", {
          email,
          password
        });
  
        if (response.status === 200) {
            login({ token: response.data.token });
            api.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;
            const userDetailsResponse = await api.get("user/"); 
            if (userDetailsResponse.status === 200) {
                // console.log(userDetailsResponse.data);
                window.location.reload()
                userDetailsResponse.data.role === "landlord" ? window.location.href = '/manager/' : window.location.href = '/tenant/';
                
            }
        } else {
            console.error('Login failed', response);
        }
      } catch (error) {
        // console.log(email, password)
        console.error('Login error:', error.response || error);
      }
    };

  return (
<>
      <section className='bg-gray-50 dark:bg-gray-900'>
        <div className='flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <div className='w-full bg-white rounded-lg shadow dark:border mt-10 md:mt-20 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                Sign in to your account
              </h1>
              <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Your email
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='email@mail.com'
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='••••••••'
                    autoComplete="current-password"
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                >
                  Sign in
                </button>
                <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                  Don’t have an account yet?{" "}
                  <Link
                    to='/register/'
                    className='font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
