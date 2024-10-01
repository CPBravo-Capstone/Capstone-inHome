import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utilities';
import PropertyForm from '../components/PropertyForm';
import { toast } from 'react-hot-toast';

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('property/');
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
      setLoading(false);
    }
  };

  const handleSave = async (propertyData) => {
    try {
      let response;
      if (editing && currentProperty) {
        response = await api.put(`property/${currentProperty.id}/`, propertyData);
        setProperties(prevProperties => 
          prevProperties.map(prop => prop.id === currentProperty.id ? response.data : prop)
        );
        toast.success('Property updated successfully');
      } else {
        response = await api.post('property/', propertyData);
        setProperties(prevProperties => [...prevProperties, response.data]);
        toast.success('Property added successfully');
      }
      setEditing(false);
      setCurrentProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
      if (error.response) {
        toast.error(`Failed to save property: ${error.response.data.detail || 'Unknown error'}`);
      } else if (error.request) {
        toast.error('No response received from server. Please try again.');
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    }
  };

  const handleEdit = (property) => {
    setEditing(true);
    setCurrentProperty(property);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`property/${propertyId}/`);
        setProperties(prevProperties => prevProperties.filter(property => property.id !== propertyId));
        toast.success('Property deleted successfully');
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Manage Properties</h1>
      
      <PropertyForm
        initialData={currentProperty}
        onPropertySaved={handleSave}
        onCancel={handleCancel}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {properties.map(property => (
            <div key={property.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{property.street}</h2>
                <p>{property.city}, {property.state} {property.zip}</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(property)}>
                    Edit
                  </button>
                  <button className="btn btn-error btn-sm" onClick={() => handleDelete(property.id)}>
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleManageApartments(property.id)}
                  >
                    Manage Apartments
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertiesPage;
