import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from '../utilities';
import PropertyForm from '../components/PropertyForm';

function PropertyPage() {
    const [properties, setProperties] = useState([]);
    const [editing, setEditing] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProperties();
    }, []);


    const fetchProperties = async () => {
        try {
            const response = await api.get('property/');
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handleEdit = (property) => {
        setEditing(true);
        setCurrentProperty(property);
    };

    const handleSave = async (propertyData) => {
        if (editing) {
            const response = await api.put(`property/${currentProperty.id}/`, propertyData);
            const updatedProperties = properties.map(prop => prop.id === currentProperty.id ? response.data : prop);
            setProperties(updatedProperties);
            setEditing(false);
            setCurrentProperty(null);
        } else {
            const response = await api.post('property/', propertyData);
            setProperties([...properties, response.data]);
        }
    };

    const handleDelete = async (propertyId) => {
        try {
            await api.delete(`property/${propertyId}/`);
            const updatedProperties = properties.filter(property => property.id !== propertyId);
            setProperties(updatedProperties);
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setCurrentProperty(null);
    };

    const handleManageApartments = (propertyId) => {
        navigate(`/manager/properties/${propertyId}/apartments`);
    };

    return (
        <div>
           <h1 className='text-4xl rounded bg-base-200 shadow-xl  p-4 outline flex justify-center font-bold m-9'> 
               MANAGE PROPERTIES
              </h1>
            <PropertyForm 
                initialData={currentProperty} 
                onPropertySaved={handleSave} 
                onCancel={handleCancel}
            />
            <div >
            {properties.map(property => (
                <div className="bg-blue-200 shadow-xl w-80 rounded ml-8 mt-4 p-4" key={property.id}>
                    <div>
                    <div className="">{property.street}, {property.city}, {property.state}, {property.zip}</div>
                    <button className="ml-1 bg-yellow-300 outline outline-black hover:bg-yellow-400 rounded btn-sm " onClick={() => handleEdit(property)}>Edit</button>
                    <button className="bg-red-300 m-2 outline outline-black hover:bg-red-400 rounded btn-sm" onClick={() => handleDelete(property.id)} style={{ marginLeft: '10px' }}>Delete</button>
                    <button className="btn btn-primary w-full rounded outline outline-black btn-sm" onClick={() => handleManageApartments(property.id)}>
                        Manage Apartments
                    </button>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}

export default PropertyPage;