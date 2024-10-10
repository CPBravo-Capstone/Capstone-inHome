/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const propertySchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State must be at least 2 characters').max(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
});

function PropertyForm({ initialData, onPropertySaved, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onPropertySaved(data);
      reset();
      toast.success(initialData ? 'Property updated successfully' : 'Property added successfully');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{initialData ? 'Edit Property' : 'Add New Property'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Street</span>
            </label>
            <input
              type="text"
              placeholder="123 Main St"
              {...register('street')}
              className={`input input-bordered w-full ${errors.street ? 'input-error' : ''}`}
            />
            {errors.street && <p className="text-error text-sm mt-1">{errors.street.message}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              placeholder="New York"
              {...register('city')}
              className={`input input-bordered w-full ${errors.city ? 'input-error' : ''}`}
            />
            {errors.city && <p className="text-error text-sm mt-1">{errors.city.message}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">State</span>
            </label>
            <input
              type="text"
              placeholder="NY"
              maxLength={2}
              {...register('state')}
              className={`input input-bordered w-full ${errors.state ? 'input-error' : ''}`}
            />
            {errors.state && <p className="text-error text-sm mt-1">{errors.state.message}</p>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">ZIP Code</span>
            </label>
            <input
              type="text"
              placeholder="12345"
              {...register('zip')}
              className={`input input-bordered w-full ${errors.zip ? 'input-error' : ''}`}
            />
            {errors.zip && <p className="text-error text-sm mt-1">{errors.zip.message}</p>}
          </div>

          <div className="card-actions justify-end">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PropertyForm;