import { useRef, useState } from 'react';
import { uploadImage } from '../../services/uploads';

const sizeClasses = {
  md: 'px-4 py-2 text-xs',
  sm: 'px-3 py-2 text-[0.65rem]',
};

const ImageUploadButton = ({
  label = 'Upload image',
  onUploadComplete,
  onError,
  size = 'md',
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const triggerInput = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const result = await uploadImage(file);
      onUploadComplete?.(result?.url, result);
    } catch (error) {
      console.error('Image upload failed', error);
      onError?.(error);
      alert(error.message || 'Upload failed. Please try again.');
    } finally {
      event.target.value = '';
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={triggerInput}
        disabled={uploading}
        className={`rounded-full border border-ink/40 bg-white/70 font-semibold uppercase tracking-[0.35em] text-ink transition hover:border-ink hover:bg-white ${
          sizeClasses[size] || sizeClasses.md
        } ${uploading ? 'cursor-progress opacity-60' : ''}`}
      >
        {uploading ? 'Uploading…' : label}
      </button>
    </>
  );
};

export default ImageUploadButton;
