import { Link } from "react-router-dom";
import rent from "../assets/rent.svg";


export default function HomePage() {

  return (
    <>
      <div className='w-fit card lg:card-side m-6 p-2 mt-12 mx-auto'>
        <figure className=' '>
          <img src="https://st.depositphotos.com/1000128/4607/i/450/depositphotos_46077129-stock-photo-modern-real-estate.jpg" alt='houses' className="rounded-l-full size-max" />
        </figure>
        <div className='card-body'>
          <h1 className='mt-8 text-6xl text-slate-800 tracking-tight font-extrabold'>
            The <span className="uppercase text-yellow-500">premier</span> property management solution
          </h1>
          <ul>
            <li className='w-max p-3 font-bold text-2xl rounded-full flex '>
          <svg className="w-[36px] h-[36px] text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd"/>
</svg>

            <span className="ml-4">Manage all of your rental units in one place </span>  

            </li>
            <li className='w-max p-3 mt-4 rounded-full font-bold text-2xl flex '>
            <svg className="w-[36px] h-[36px] text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd"/>
</svg>
<span className="ml-4">Find the perfect tenant with personalized invitations </span>
            </li>
            <li className='w-max p-3 mb-6 mt-4 rounded-full font-bold text-2xl flex'>
            <svg className="w-[36px] h-[36px] text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clipRule="evenodd"/>
</svg>
<span className="ml-4">   Find out more with no fees involved and no commitments required </span>
            </li>
          </ul>
          <div className='card-actions justify-end'>
            <Link to='/about/'>
              <button className='btn btn-primary mt-8 mr-48'>Learn More</button>
            </Link>
          </div>
        </div>
      </div>

      <div className='w-fit rounded-full card mx-auto lg:card-side m-6 p-8 mt-12 '>
        <div className=' rounded-full bg-sky-50 border-b-8 border-sky-200 -outline-offset-8 outline-dotted outline-yellow-300 border z-10 '>
          <h1 className='font-semibold text-6xl ml-8 mt-8 tracking-tight '>
            An intuitive tenant <span className="font-extrabold text-6xl uppercase text-cyan-600">experience</span>
          </h1>
          <h1 className='card-title text-6xl'></h1>
          <ul className="p-2 ml-12">
            <li className='bg-base-100 w-max p-3 mt-12 rounded-full'>
              Seamlessly apply in one place
            </li>
            <li className='bg-base-100 w-max p-3 mt-4 rounded-full ml-4'>
              View records, leases, and make repair requests any time
            </li>
            <li className='bg-base-100 w-max p-3 mb-6 mt-4 rounded-full ml-8'>
              Find out more with no fees involved and no commitments required
            </li>
          <div className='card-actions justify-end p-2'>
            <Link to='/about/'>
              <button className='btn btn-secondary mt-8 mr-44'>Learn More</button>
            </Link>
          </div>
          </ul>
        </div>
        <figure className=''>
          <img src={rent} alt='rent' />
        </figure>
      </div>
    </>
  );
}
