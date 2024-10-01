import { useState, useEffect } from 'react';
import { api } from '../utilities';


function PropertyForm({ initialData, onPropertySaved, onCancel }) {
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip: ''
    });
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                street: initialData.street || '',
                city: initialData.city || '',
                state: initialData.state || '',
                zip: initialData.zip || ''
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
            onPropertySaved(response.data);
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
        <form onSubmit={handleSubmit}>
            <input type="text" name="street" value={formData.street} onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    );
}

export default PropertyForm;