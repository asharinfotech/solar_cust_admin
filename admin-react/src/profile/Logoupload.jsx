import { useNotify } from 'react-admin';
import { useState } from 'react';
import axios from 'axios';
import { ADMIN_URL } from '../constant';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddtdsd5ws/image/upload';
const UPLOAD_PRESET = 'glowtt_logo_upload';

export const LogoUpload = () => {
  const notify = useNotify();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || uploading) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = res.data.secure_url;

      await axios.put(`${ADMIN_URL}site_settings.php`, {
        id: 5,
        value: imageUrl,
      });

      notify('✅ Logo updated successfully');
    } catch (err) {
      notify('❌ Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          style={{ maxWidth: '200px', marginTop: '10px' }}
        />
      )}
      <button onClick={handleUpload} disabled={uploading} style={{ marginTop: '10px' }}>
        {uploading ? 'Uploading...' : 'Upload Logo'}
      </button>
    </div>
  );
};
