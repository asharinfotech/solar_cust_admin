import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  useNotify,
  useRedirect,
} from 'react-admin';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddtdsd5ws/image/upload';
const UPLOAD_PRESET = 'projects';

export const ProjectCreate = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const { setValue } = useFormContext(); // ✅ bind image_url to form
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const uploadedUrl = res.data.secure_url;
      setImageUrl(uploadedUrl);
      setValue('image_url', uploadedUrl); // ✅ update form field
      notify('✅ Image uploaded');
    } catch (err) {
      console.error('Upload failed:', err);
      notify('❌ Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Create {...props}>
      <SimpleForm redirect="list">
        <TextInput source="type" />
        <TextInput source="title" />
        <TextInput source="category" />
        <TextInput source="location" />
        <TextInput source="capacity" />
        <NumberInput source="year" />
        <TextInput source="description" multiline />
        <TextInput source="src" />
        <TextInput source="image_url" style={{ display: 'none' }} />

        {/* ✅ Image Upload Input */}
        <label className="block text-sm font-medium text-black mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {/* ✅ Live Preview */}
        {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Preview"
              style={{ maxWidth: '300px', borderRadius: '8px' }}
            />
            <button
              type="button"
              onClick={() => {
                setImageUrl('');
                setValue('image_url', '');
              }}
              className="mt-2 text-sm text-red-600"
            >
              Remove Image
            </button>
          </div>
        )}
      </SimpleForm>
    </Create>
  );
};
