import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  BooleanInput,
  useNotify,
  useRedirect,
} from 'react-admin';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddtdsd5ws/image/upload';
const UPLOAD_PRESET = 'articles';

const CloudinaryUploader = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const { setValue } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (file) => {
    if (!file || uploading) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const uploadedUrl = res.data.secure_url;
      setImageUrl(uploadedUrl);
      setValue('image_url', uploadedUrl);
      notify('✅ Image uploaded');

      // Optional: redirect immediately after upload
      // redirect('/articles');
    } catch (err) {
      console.error('Upload failed:', err.response?.data || err.message);
      notify(`❌ Upload failed: ${err.response?.data?.error?.message || err.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label htmlFor="upload-button" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Upload Image
      </label>
      <input
        id="upload-button"
        type="file"
        accept="image/*"
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleUpload(file);
        }}
      />
      {uploading && <p style={{ marginTop: '10px', color: '#555' }}>Uploading...</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          style={{ maxWidth: '300px', marginTop: '10px', borderRadius: '8px' }}
        />
      )}
    </div>
  );
};

export const ArticleCreate = (props) => (
  <Create {...props}>
    <SimpleForm redirect="list">
      <TextInput source="title" />
      <TextInput source="excerpt" multiline />
      <TextInput source="category" />
      <TextInput source="author" />
      <DateInput source="date" />
      <TextInput source="reading_time" />
      <TextInput source="views" />
      <BooleanInput source="featured" />
      <TextInput source="tags" />
      <TextInput source="image_url" style={{ display: 'none' }} />
      <CloudinaryUploader />
    </SimpleForm>
  </Create>
);
