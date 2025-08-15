// src/components/ImageUploader.jsx
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

const ImageUploader = ({ onDrop, image }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className={`relative p-8 text-center cursor-pointer transition-all duration-300 rounded-xl
            bg-white/5 ring-1 ring-white/10 hover:ring-green-400
            ${isDragActive ? 'ring-green-400 shadow-[0_0_30px_rgba(45,212,191,0.5)]' : ''}`}
        >
            <input {...getInputProps()} />
            {image ? (
                <div className="relative">
                    <img src={URL.createObjectURL(image)} alt="Preview" className="mx-auto max-h-60 rounded-md" />
                    <p className="mt-4 text-sm text-gray-400">Drag or click to replace image</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                    <UploadCloud size={48} className={`transition-transform duration-300 ${isDragActive ? 'scale-110 text-green-400' : ''}`} />
                    <p>{isDragActive ? "Drop the image here..." : "Drag & drop or click to upload"}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
