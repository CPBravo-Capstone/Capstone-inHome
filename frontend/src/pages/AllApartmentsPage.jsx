import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../utilities";

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: '',
    bathrooms: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchApartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [apartments, filters]);

  const fetchApartments = async () => {
    try {
      const response = await api.get("apartment/all/");
      setApartments(response.data);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

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

  const placeholderImages = [
    "https://weburbanist.com/wp-content/uploads/2018/06/signage-960x484.jpg",
    "https://walkthru360.com/wp-content/uploads/2021/09/Apartment-Real-Estate-Photographer-Texas-IMG_2189_web-sized.jpg",
    "https://i2.au.reastatic.net/800x600/0d91489c1216999c824c7bc9710e84bde593ceeb236dd792a2d5b3bcd4abb5a1/image.jpg",
    "https://q4rentals.com/wp-content/uploads/2023/11/01_151GriswaldWay_Unit1_2001_LowRes.jpg",
    "https://q-xx.bstatic.com/xdata/images/hotel/max500/229125044.jpg?k=d53e587109b51f87161cd9302139debe9d26b8aecc94a6ec9ea15040e867bd54&o=",
    "https://a0.muscache.com/im/pictures/5e12f339-a74b-4260-a052-3cba757be774.jpg?im_w=720",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Find Your Perfect Apartment</h1>
      
      <div className="mb-8 p-4 bg-base-200 rounded-lg">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApartments.map((apartment) => (
          <div key={apartment.id} className="card bg-base-100 shadow-xl">
            <figure>
              <div className="carousel w-full">
                {placeholderImages.map((img, index) => (
                  <div key={index} id={`slide${apartment.id}-${index}`} className="carousel-item relative w-full">
                    <img src={img} alt={`Apartment ${apartment.unit_number} - Image ${index + 1}`} className="w-full h-48 object-cover" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href={`#slide${apartment.id}-${index === 0 ? placeholderImages.length - 1 : index - 1}`} className="btn btn-circle">❮</a> 
                      <a href={`#slide${apartment.id}-${index === placeholderImages.length - 1 ? 0 : index + 1}`} className="btn btn-circle">❯</a>
                    </div>
                  </div>
                ))}
              </div>
            </figure>
            <div className="card-body">
              <div className="flex justify-between text-sm">
                <span className='font-extrabold text-xl'><span className='text-orange-500 text-3xl'>{apartment.bedroom}</span> {apartment.bedroom === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                <span className='font-extrabold text-xl'><span className='text-sky-500 text-3xl'>{apartment.bathroom}</span> {apartment.bathroom === 1 ? 'Bathroom' : 'Bathrooms'}</span>
              </div>
              <p className='underline text-slate-700'>{apartment.lease_length} month lease</p>
              <h2 className="card-title flex justify-between">
              <p className='text-sm'> Property: {apartment.property} {apartment.property.city} {apartment.property.state} - Unit: {apartment.unit_number}</p>
                <div className="badge text-slate-400 font-bold">${apartment.monthly_rent}/mo</div>
              </h2>
              <div className="card-actions justify-end">
                <button 
                  className="btn outline outline-yellow-400 bg-yellow-300 hover:bg-yellow-500"
                  onClick={() => navigate(`/tenant/${apartment.id}/application/`)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApartmentListPage;