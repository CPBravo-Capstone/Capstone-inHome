import { useEffect, useState } from "react";
import ApartmentForm from "../components/ApartmentForm";
import { useParams, Link } from "react-router-dom";
import { api } from "../utilities";

function ApartmentList() {
    const { propertyId } = useParams();
    const [apartments, setApartments] = useState([]);
    const [editingApartment, setEditingApartment] = useState(null);
    const [currentApartment, setCurrentApartment] = useState(null);
    const [propertyDetails, setPropertyDetails] = useState(null);

    useEffect(() => {
        fetchPropertyDetails();
        fetchApartments();
    }, [propertyId]);
    
    const fetchPropertyDetails = async () => {
        try {
            const response = await api.get(`property/${propertyId}/`);
            setPropertyDetails(response.data);
        } catch (error) {
            console.error("Error fetching property details:", error);
        }
    };

    useEffect(() => {
        fetchApartments();
    }, [propertyId]);

    const fetchApartments = async () => {
        try {
            const response = await api.get(`apartment/?propertyId=${propertyId}`);
            setApartments(response.data);
        } catch (error) {
            console.error("Error fetching apartments:", error);
        }
    };
    
    const handleEdit= (apartment) => {
        setEditingApartment(true);
        setCurrentApartment(apartment)
        };

    const handleSave = async (apartmentData) => {
        if (editingApartment) {
            const response = await api.put(`apartment/${currentApartment.id}/`, {...apartmentData});
            const updatedApartments= apartments.map(apt => apt.id === currentApartment.id ? response.data : apt);
            setApartments(updatedApartments);
            setEditingApartment(false);
            setCurrentApartment(null);
        } else {
            const response = await api.post('property/', apartmentData);
            setApartments([...apartments, response.data]);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`apartment/${id}/`);
            setApartments(apartments.filter((ap) => ap.id !== id));
            } catch (error) {
            console.error("Error deleting apartment:", error);
            }
        };
    
    const handleCancel = () => {
        setEditingApartment(false);
        setCurrentApartment(null);
        };


  return (
    <div>
      <h1 className='text-4xl rounded bg-base-200 shadow-xl  p-4 outline flex justify-center font-bold m-9'>
          Apartments for Property: {propertyDetails ? `${propertyDetails.street}, ${propertyDetails.city}, ${propertyDetails.state}, ${propertyDetails.zip}` : `Loading...`}</h1>
      <ApartmentForm
        apartment={currentApartment}
        onSave={handleSave}
        propertyId={propertyId}
        onCancel={handleCancel}
      />
      {apartments.map((apartment) => (
        <div className="bg-blue-200 shadow-xl w-80 rounded ml-8 mt-4 p-4" key={apartment.id}>
            <div className="font-bold">Unit: {apartment.unit_number}<br></br> Bedrooms: {apartment.bedroom} <br></br>Bathrooms: {apartment.bathroom}<br></br>Monthly Rent: {apartment.monthly_rent}<br></br>Lease Length (Months) : {apartment.lease_length} </div>
            <button className="ml-1 bg-yellow-300 outline outline-black hover:bg-yellow-400 rounded btn-sm " onClick={() => handleEdit(apartment)}>Edit</button>
            <button className="bg-red-300 m-2 outline outline-black hover:bg-red-400 rounded btn-sm" onClick={() => handleDelete(apartment.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default ApartmentList;
