import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import houses from "../assets/houses.svg";
import rent from "../assets/rent.svg";

export default function HomePage() {


  return (
    <>
      <div className='w-fit card lg:card-side m-6 p-2 mt-12 rounded-full'>
        <figure className='bg-gray-100 '>
          <img src={houses} alt='houses' />
        </figure>
        <div className='card-body'>
          <h1 className='card-title text-6xl'>
            The premier property management solution
          </h1>
          <h1 className='card-title text-6xl'></h1>
          <ul>
            <li className='bg-base-300 w-max p-3 mt-12 rounded-full'>
              Manage all of your rental units in one place
            </li>
            <li className='bg-base-300 w-max p-3 mt-4 rounded-full'>
              Find the perfect tenant with personalized invitations
            </li>
            <li className='bg-base-300 w-max p-3 mb-6 mt-4 rounded-full'>
              Find out more with no fees involved and no commitments required
            </li>
          </ul>
          <div className='card-actions justify-end'>
            <Link to='/about/'>
              <button className='btn btn-primary mt-8 mr-48'>Learn More</button>
            </Link>
          </div>
        </div>
      </div>

      <div className='w-fit card lg:card-side m-6 p-8 mt-12 shadow-2xl rounded'>
        <div className='card-body rounded  bg-blue-200'>
          <h1 className='card-title text-7xl'>
            Simple and efficient tenant experience
          </h1>
          <h1 className='card-title text-6xl'></h1>
          <ul>
            <li className='bg-base-100 w-max p-3 mt-12 rounded-full'>
              Seamlessly apply in one place
            </li>
            <li className='bg-base-100 w-max p-3 mt-4 rounded-full'>
              View records, leases, and make repair requests any time
            </li>
            <li className='bg-base-100 w-max p-3 mb-6 mt-4 rounded-full'>
              Find out more with no fees involved and no commitments required
            </li>
          </ul>
          <div className='card-actions justify-end'>
            <Link to='/about/'>
              <button className='btn btn-primary mt-8 mr-44'>Learn More</button>
            </Link>
          </div>
        </div>
        <figure className='bg-gray-100'>
          <img src={rent} alt='rent' />
        </figure>
      </div>
    </>
  );
}
