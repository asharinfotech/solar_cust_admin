import { Create, SimpleForm, useNotify, useRedirect } from 'react-admin';
import { useState } from 'react';
import axios from 'axios';
import { ADMIN_URL } from '../constant';
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddtdsd5ws/image/upload';
const UPLOAD_PRESET = 'carouselImage';

export const CarouselCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);

    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const res = await axios.post(CLOUDINARY_URL, formData);
        uploaded.push(res.data.secure_url);
        notify(`✅ Uploaded: ${file.name}`);
      } catch (err) {
        notify(`❌ Failed: ${file.name}`, 'error');
      }
    }

    setUploadedImages(uploaded);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!uploadedImages.length) return;

    try {
      for (const url of uploadedImages) {
        await axios.post(`${ADMIN_URL}carousel.php`, {
          image_url: url,
        });
      }
      notify('✅ All images saved');
      redirect('/carousel');
    } catch (err) {
      notify('❌ Saving failed', 'error');
    }
  };

  return (
    <Create>
      <SimpleForm toolbar={false}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button type="button" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
        </button>

        {uploadedImages.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Uploaded Images:</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {uploadedImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Uploaded ${index}`}
                  style={{ width: '150px', borderRadius: '8px' }}
                />
              ))}
            </div>
            <button type="button" onClick={handleSave} style={{ marginTop: '10px' }}>
              Save to Carousel
            </button>
          </div>
        )}
      </SimpleForm>
    </Create>
  );
};
