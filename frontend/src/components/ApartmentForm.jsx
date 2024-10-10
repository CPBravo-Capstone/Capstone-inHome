/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { api } from "../utilities";

function ApartmentForm({ propertyId, apartment, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    unit_number: "",
    bedroom: "",
    bathroom: "",
    monthly_rent: "",
    lease_length: "",
    tenant_id: "",
    property_id: ""
  });

  useEffect(() => {
    if (apartment) {
      setFormData({
        unit_number: apartment.unit_number,
        bedroom: apartment.bedroom,
        bathroom: apartment.bathroom,
        monthly_rent: apartment.monthly_rent,
        lease_length: apartment.lease_length,
      });
    } else {
      setFormData({
        unit_number: "",
        bedroom: "",
        bathroom: "",
        monthly_rent: "",
        lease_length: "",
      });
    }
  }, [apartment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const apartmentData = {
      ...formData,
      property: propertyId 
    };
    
    try {
      let response;
      if (apartment) {
        response = await api.put(`apartment/${apartment.id}/`, apartmentData);
      } else {
        response = await api.post("apartment/", apartmentData);
      }
      onSave(response.data); 
      console.log(response.data);
      window.location.reload();
      
      setFormData({
        unit_number: "",
        bedroom: "",
        bathroom: "",
        monthly_rent: "",
        lease_length: "",
        tenant_id: null,
        property_id: propertyId,
      });
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error saving apartment:", error);
    }
  };

  return (
    <form className="m-6" onSubmit={handleSubmit}>
      <input
        className='bg-base-200 p-2 outline outline-black rounded m-2'
        type='text'
        name='unit_number'
        value={formData.unit_number}
        onChange={handleChange}
        placeholder='Unit Number'
        required
      />
      <input
        className='bg-base-200 p-2 outline outline-black rounded m-2'
        type='number'
        name='bedroom'
        value={formData.bedroom}
        onChange={handleChange}
        placeholder='Bedrooms'
        required
      />
      <input
        className='bg-base-200 p-2 outline outline-black rounded m-2'
        type='number'
        name='bathroom'
        value={formData.bathroom}
        onChange={handleChange}
        placeholder='Bathrooms'
        required
      />
      <input
        className='bg-base-200 p-2 outline outline-black rounded m-2'
        type='text'
        name='monthly_rent'
        value={formData.monthly_rent}
        onChange={handleChange}
        placeholder='Monthly Rent'
        required
      />
      <input
        className='bg-base-200 p-2 outline outline-black rounded m-2'
        type='number'
        name='lease_length'
        value={formData.lease_length}
        onChange={handleChange}
        placeholder='Lease Length'
        required
      />
      <button className='btn bg-blue-300 hover:bg-blue-400' type='submit'>
        {apartment ? "Update Apartment" : "Add Apartment"}
      </button>
      {apartment && (
        <button className='btn bg-red-300' type='button' onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default ApartmentForm;
