import {
  Edit,
  SimpleForm,
  TextInput,
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

const ImageUploader = () => {
  const record = useRecordContext(); // ✅ now inside form context
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

      await axios.put(`${ADMIN_URL}carousel.php`, {
        id: record.id,
        image_url: uploadedUrl,
      });

      notify('✅ Image updated');
      redirect('/admin-dashboard/carousel');
    } catch (err) {
      console.error('Upload failed:', err);
      notify('❌ Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleUpload(file);
        }}
      />
      {uploading && <p style={{ marginTop: '10px' }}>Uploading...</p>}
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

export const CarouselEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="image_url" />
      <ImageField source="image_url" title="Carousel Image" />
      <ImageUploader />
    </SimpleForm>
  </Edit>
);
