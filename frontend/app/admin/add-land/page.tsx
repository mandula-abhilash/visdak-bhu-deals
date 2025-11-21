'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import MapDrawing from '@/components/MapDrawing';
import { landAPI, uploadAPI } from '@/lib/api';
import { Coordinate } from '@/lib/area-calculator';

export default function AddLandPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    district: '',
    location_text: '',
    price_range: '',
    description: '',
    exact_address: '',
    owner_name: '',
    survey_number: '',
    exact_price: '',
    contact_info: '',
  });

  const [boundary, setBoundary] = useState<Coordinate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLandId, setCreatedLandId] = useState<number | null>(null);
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [documentFiles, setDocumentFiles] = useState<FileList | null>(null);

  if (!isAuthenticated || !isAdmin) {
    router.push('/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (boundary.length < 3) {
      setError('Please draw a boundary on the map');
      return;
    }

    setLoading(true);

    try {
      const result = await landAPI.create({
        ...formData,
        boundary_polygon: JSON.stringify(boundary),
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      alert('Land created successfully!');
      setCreatedLandId(result.land.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create land');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFiles || !createdLandId) return;

    try {
      const filesArray = Array.from(photoFiles);
      await uploadAPI.uploadPhotos(createdLandId, filesArray);
      alert('Photos uploaded successfully!');
      setPhotoFiles(null);
    } catch (err) {
      alert('Failed to upload photos');
    }
  };

  const handleDocumentUpload = async () => {
    if (!documentFiles || !createdLandId) return;

    try {
      const filesArray = Array.from(documentFiles);
      await uploadAPI.uploadDocuments(createdLandId, filesArray);
      alert('Documents uploaded successfully!');
      setDocumentFiles(null);
    } catch (err) {
      alert('Failed to upload documents');
    }
  };

  if (createdLandId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-primary mb-6">Upload Files for Land ID: {createdLandId}</h2>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Photos</h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotoFiles(e.target.files)}
                className="mb-4"
              />
              <button onClick={handlePhotoUpload} className="btn-primary">
                Upload Photos
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Documents</h3>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                multiple
                onChange={(e) => setDocumentFiles(e.target.files)}
                className="mb-4"
              />
              <button onClick={handleDocumentUpload} className="btn-primary">
                Upload Documents
              </button>
            </div>

            <button onClick={() => router.push('/')} className="btn-primary w-full">
              Done - Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Add New Land Listing</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="label">Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Price Range *</label>
                <select
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Price Range</option>
                  <option value="0-10L">0 - 10 Lakhs</option>
                  <option value="10L-25L">10 - 25 Lakhs</option>
                  <option value="25L-50L">25 - 50 Lakhs</option>
                  <option value="50L-1Cr">50 Lakhs - 1 Crore</option>
                  <option value="1Cr+">1 Crore+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Location Description *</label>
              <textarea
                name="location_text"
                value={formData.location_text}
                onChange={handleInputChange}
                className="input-field"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="label">Property Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                rows={4}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Draw Boundary on Map *</h2>
          <p className="text-gray-600 mb-4">Use the polygon tool to draw the land boundary. Area will be calculated automatically.</p>
          <MapDrawing onBoundaryChange={setBoundary} />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Private Information</h2>

          <div className="space-y-4">
            <div>
              <label className="label">Exact Address</label>
              <textarea
                name="exact_address"
                value={formData.exact_address}
                onChange={handleInputChange}
                className="input-field"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Owner Name</label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Survey Number</label>
                <input
                  type="text"
                  name="survey_number"
                  value={formData.survey_number}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Exact Price (₹)</label>
                <input
                  type="number"
                  name="exact_price"
                  value={formData.exact_price}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.01"
                />
              </div>

              <div>
                <label className="label">Contact Information</label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Creating...' : 'Create Land Listing'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
