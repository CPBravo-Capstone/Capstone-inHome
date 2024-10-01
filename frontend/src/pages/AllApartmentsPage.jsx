import { useEffect, useState } from "react";
import { api } from "../utilities";
import { useNavigate } from "react-router-dom";

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await api.get("apartment/all/");
      setApartments(response.data);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  return (
    <div className='m-8'>
      <h1 className='text-4xl rounded bg-base-200 shadow-xl  p-4 outline flex justify-center font-bold m-9'>
        View All Apartments
      </h1>
      <div className=' flex '>
        {apartments.map((apartment) => (
          <div
            key={apartment.id}
            className='m-10 p-4 rounded outline-4  outline-double outline-blue-300 shadow-2xl'
          >
            <h3 className='font-bold'>
              Unit: {apartment.unit_number} {apartment.property.street}
            </h3>
            <p>Property: {apartment.property}</p>
            <p>Bathrooms: {apartment.bathroom}</p>
            <p>Bedrooms: {apartment.bedroom}</p>
            <p>Rent: ${apartment.monthly_rent}</p>
            <p>Lease Length : {apartment.lease_length} months</p>
            <button onClick={() => navigate(`/tenant/${apartment.id}/application/`)} className=' mt-2 bg-green-300 outline outline-black hover:bg-green-400 rounded btn-sm '>
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentListPage;
