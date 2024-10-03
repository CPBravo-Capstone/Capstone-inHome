import { useState, useEffect } from 'react';
import { api } from '../utilities';


function PropertyForm({ initialData, onPropertySaved, onCancel }) {
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip: ''
    });


    useEffect(() => {
        if (initialData) {
            setFormData({
                street: initialData.street || '',
                city: initialData.city || '',
                state: initialData.state || '',
                zip: initialData.zip || ''
            });
        } else {
            setFormData({
                street: '',
                city: '',
                state: '',
                zip: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (initialData) {
                response = await api.put(`property/${initialData.id}/`, formData);
            } else {
                response = await api.post('property/', formData);
            }
            // onPropertySaved(response.data);
            console.log(response.data)
            window.location.reload()
            
            setFormData({
                street: '',
                city: '',
                state: '',
                zip: ''
            });
            if (onCancel) onCancel();
        } catch (error) {
            console.error('Error saving property:', error);
        }
    };

    return (
        <form className="m-6" onSubmit={handleSubmit}>
            <input className='bg-base-200 p-2 outline outline-black rounded m-2' type="text" name="street" placeholder="Street" value={formData.street} onChange={handleChange} />
            <input className='bg-base-200 p-2 outline outline-black rounded m-2' type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
            <input className='bg-base-200 p-2 outline outline-black rounded m-2' type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
            <input className='bg-base-200 p-2 outline outline-black rounded m-2' type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} />
            <button className='btn bg-blue-300 hover:bg-blue-400' type="submit">{initialData ? 'Update Property' : 'Add Property'}</button>
            {initialData && <button className='btn bg-red-300' onClick={onCancel} type="button">Cancel</button>}
        </form>
    );
}

export default PropertyForm;