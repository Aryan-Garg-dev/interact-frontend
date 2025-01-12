import React, { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage: string | null;
  onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageUpload }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  return (
    <div className="w-full h-40 relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {previewImage ? (
        <Image src={previewImage} alt="Cover" layout="fill" objectFit="cover" className="rounded-xl" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
          <Plus size={24} />
          <p className="ml-2">Change Cover Image</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
