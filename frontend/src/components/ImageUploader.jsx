import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Trash2 } from 'lucide-react';

const ImageUploader = ({ onDrop, images = [], removeImage }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: true,
    });

    return (
        <div>
            {/* Display selected images */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 sm:h-32 object-cover"
                            />
                            {/* Overlay and remove button */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="p-2 rounded-full text-white bg-red-500/70 hover:bg-red-600/90 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Drag and Drop area */}
            <div
                {...getRootProps()}
                className={`relative p-8 text-center cursor-pointer transition-all duration-300 rounded-xl
                bg-white/5 ring-1 ring-white/10 hover:ring-green-400
                ${isDragActive ? 'ring-green-400 shadow-[0_0_30px_rgba(45,212,191,0.5)]' : ''}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                    <UploadCloud size={48} className={`transition-transform duration-300 ${isDragActive ? 'scale-110 text-green-400' : ''}`} />
                    <p>{isDragActive ? "Drop the images here..." : "Drag & drop or click to upload"}</p>
                    <p className="text-sm text-gray-500">You can upload multiple files.</p>
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;