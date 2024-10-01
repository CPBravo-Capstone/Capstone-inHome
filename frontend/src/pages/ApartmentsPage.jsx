import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utilities';
import ApartmentForm from '../components/ApartmentForm';
import { toast } from 'react-hot-toast';

function ApartmentListPage() {
    const { propertyId } = useParams();
    const [apartments, setApartments] = useState([]);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [editingApartment, setEditingApartment] = useState(false);
    const [currentApartment, setCurrentApartment] = useState(null);
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 10000,
        bedrooms: '',
        bathrooms: '',
    });


    useEffect(() => {
        fetchPropertyDetails();
        fetchApartments();
    }, [propertyId]);
    const fetchPropertyDetails = async () => {
        try {
            const response = await api.get(`property/${propertyId}/`);
            setPropertyDetails(response.data);
        } catch (error) {
            console.error('Error fetching property details:', error);
            toast.error('Failed to fetch property details');
        }
    };

    const fetchApartments = async () => {
        try {
            setLoading(true);
            const response = await api.get(`apartment/?propertyId=${propertyId}`);
            setApartments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching apartments:', error);
            toast.error('Failed to fetch apartments');
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [apartments, filters]);

    const applyFilters = () => {
        const filtered = apartments.filter((apt) => {
            return (
                apt.monthly_rent >= filters.minPrice &&
                apt.monthly_rent <= filters.maxPrice &&
                (filters.bedrooms === '' || apt.bedroom === parseInt(filters.bedrooms)) &&
                (filters.bathrooms === '' || apt.bathroom === parseInt(filters.bathrooms))
            );
        });
        setFilteredApartments(filtered);
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (apartment) => {
        setEditingApartment(true);
        setCurrentApartment(apartment);
    };

    const handleSave = async (apartmentData) => {
        try {
            let response;
            if (editingApartment && currentApartment) {
                response = await api.put(`apartment/${currentApartment.id}/`, apartmentData);
                setApartments((prev) =>
                    prev.map((apt) => (apt.id === currentApartment.id ? response.data : apt))
                );
                toast.success('Apartment updated successfully');
            } else {
                response = await api.post('apartment/', { ...apartmentData, propertyId });
                setApartments((prev) => [...prev, response.data]);
                toast.success('Apartment added successfully');
            }
            setEditingApartment(false);
            setCurrentApartment(null);
        } catch (error) {
            console.error('Error saving apartment:', error);
            toast.error('Failed to save apartment');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this apartment?')) {
            try {
                await api.delete(`apartment/${id}/`);
                setApartments((prev) => prev.filter((ap) => ap.id !== id));
                toast.success('Apartment deleted successfully');
            } catch (error) {
                console.error('Error deleting apartment:', error);
                toast.error('Failed to delete apartment');
            }
        }
    };

    const handleCancel = () => {
        setEditingApartment(false);
        setCurrentApartment(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">
                {propertyDetails ? `Apartments for ${propertyDetails.street}, ${propertyDetails.city}` : 'Loading property details...'}
            </h1>

            <div className="mb-8 p-4 bg-base-200 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-4">
                    {editingApartment ? 'Edit Apartment' : 'Add Apartment'}
                </h2>
                <ApartmentForm
                    apartment={currentApartment}
                    onSave={handleSave}
                    propertyId={propertyId}
                    onCancel={handleCancel}
                />
            </div>

            <div className="mb-8 p-4 bg-base-200 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Price Range</span>
                        </label>
                        <input 
                            type="range" 
                            min="0" 
                            max="10000" 
                            value={filters.maxPrice} 
                            className="range" 
                            step="100"
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        />
                        <div className="flex justify-between">
                            <span>${filters.minPrice}</span>
                            <span>${filters.maxPrice}</span>
                        </div>
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Bedrooms</span>
                        </label>
                        <select 
                            className="select select-bordered w-full"
                            value={filters.bedrooms}
                            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Bathrooms</span>
                        </label>
                        <select 
                            className="select select-bordered w-full"
                            value={filters.bathrooms}
                            onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                        >
                            <option value="">Any</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Search</span>
                        </label>
                        <input type="text" placeholder="Search by location..." className="input input-bordered w-full" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : apartments.length === 0 ? (
                <div className="text-center mt-8">
                    <p className="text-lg">No apartments found for this property.</p>
                    <p className="text-gray-500">Add a new apartment to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {filteredApartments.map((apartment) => (
                        <div key={apartment.id} className="card bg-base-100 shadow-xl">
                            <figure className="relative">
                                <img
                                    src="https://via.placeholder.com/300"
                                    alt={`Apartment ${apartment.unit_number}`}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="absolute top-4 left-4 bg-white text-black rounded-full px-3 py-1 font-bold">
                                    ${apartment.monthly_rent}/mo
                                </div>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-lg">
                                    Unit {apartment.unit_number}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {apartment.bedroom} Bed, {apartment.bathroom} Bath
                                </p>
                                <p className="text-sm">
                                    Lease Length: {apartment.lease_length} months
                                </p>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleEdit(apartment)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-error"
                                        onClick={() => handleDelete(apartment.id)}
                                    >
                                        Delete
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

export default ApartmentListPage;
