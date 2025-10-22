import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  TextField,
  ImageField,
  useNotify,
  useRedirect,
  useRecordContext,
} from 'react-admin';
import { useState } from 'react';
import axios from 'axios';
import { ADMIN_URL } from '../constant';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddtdsd5ws/image/upload';
const UPLOAD_PRESET = 'carouselImage';

const CloudinaryUploader = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (file) => {
    if (!file || uploading || !record?.id) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const uploadedUrl = res.data.secure_url;
      setImageUrl(uploadedUrl);

      await axios.put(`${ADMIN_URL}projects.php`, {
        id: record.id,
        image_url: uploadedUrl,
      });

      notify('✅ Image uploaded');
      redirect('/admin-dashboard/projects');
    } catch (err) {
      console.error('Upload failed:', err);
      notify('❌ Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label className="block text-sm font-medium text-black mb-1">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleUpload(file);
        }}
      />
      {uploading && <p className="mt-2 text-sm text-gray-600">Uploading...</p>}
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

export const ProjectEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextField source="id" disabled />
      <TextInput source="type" />
      <TextInput source="title" />
      <TextInput source="category" />
      <TextInput source="location" />
      <TextInput source="capacity" />
      <NumberInput source="year" />
      <TextInput source="description" multiline />
      <TextInput source="src" />
      {/* <TextInput source="thumbnail" /> */}
      <TextInput source="image_url" />
      <ImageField source="image_url" title="title" />
      <CloudinaryUploader />
    </SimpleForm>
  </Edit>
);
