import { useState, useEffect } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { api } from "../utilities";
import { useAuth } from '../contexts/AuthContext';


export default function Register() {

    const { login } = useAuth();

    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: ''
    });

    const navigate = useNavigate()

    const handleChange = (event) => {
        setUserData({ ...userData, [event.target.id]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('user/register/', userData);
            console.log('User registered:', response.data);
            localStorage.setItem('token', response.data.token);
            api.defaults.headers.common["Authorization"] = `Token ${response.data.token}`
            console.log(response.data.role)
            login({
                user: response.data.user,
                token: response.data.token
            });
            
            navigate(response.data.role === 'landlord' ? '/manager/' : '/tenant/')
            window.location.reload()
        } catch (error) {
            console.error('Registration error:', error.response);
        }
    };


  return (
    <>
      <form onSubmit={handleSubmit} className=' p-10 m-10'>
        <h1 className=' h-max card-title font-bold text-7xl  mb-10'>
          Get started with inHome today!
        </h1>
        <div className=''>
          <div className='w-max'>
            <label
             
              className='block mb-4 text-sm font-medium text-gray-900 dark:text-white'
            >
              <div className='label'>
                <span className='label-text'>Choose Account Type</span>
              </div>
              <select
                required
                id='role'
                value={userData.role}
                onChange={handleChange}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              >
                <option></option>
                <option value='landlord'>Property Manager</option>
                <option value='tenant'>Tenant</option>
              </select>
            </label>
          </div>

          <div className='grid gap-6 mb-6 md:grid-cols-2 w-max'>
            <div>
              <label
                
                className='block mb-2 text-sm font-medium dark:text-auto'
              >
                First Name
              </label>
              <input
                type='text'
                id='first_name' 
                value={userData.first_name}
                onChange={handleChange}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='John'
                required
              />
            </div>
            <div>
              <label
                
                className='block mb-2 text-sm font-medium dark:text-auto'
              >
                Last Name
              </label>
              <input
                type='text'
                id='last_name'
                value={userData.last_name}
                onChange={handleChange}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Doe'
                required
              />
            </div>
          </div>
          <div className='mb-6 w-max'>
            <label
             
              className='block mb-2 text-sm font-medium dark:text-auto '
            >
              Email Address
            </label>
            <input
                type='email'
                id='email'
                value={userData.email}
                onChange={handleChange}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='john.doe@email.com'
              autoComplete="username"
              required
            />
          </div>
          <div className='mb-6 w-max'>
            <label
              
              className='block mb-2 text-sm font-medium '
            >
              Password
            </label>
            <input
                type='password'
                id='password'
                value={userData.password}
                onChange={handleChange}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='•••••••••'
              autoComplete="new-password"
              required
            />
          </div>
          <div className='flex items-start mb-6'>
           
            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                 Already registered?{" "}
                  <a
                    href='/login/'
                    className='font-medium text-blue-600 hover:underline'
                  >
                   Go to Login
                  </a>
                </p>
          </div>
          <button
            type='submit'
            className='text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
