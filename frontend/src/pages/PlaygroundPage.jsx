import React, { useState, useCallback, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import RecipeDisplay from '../components/RecipeDisplay';
import { gsap } from 'gsap';
import { ArrowLeft } from 'lucide-react';

const PlaygroundPage = () => {
    const [image, setImage] = useState(null);
    const [preference, setPreference] = useState('');
    const [recipe, setRecipe] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const comp = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".playground-panel", {
                opacity: 0,
                y: 50,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out'
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setImage(acceptedFiles[0]);
            setRecipe('');
            setError('');
        }
    }, []);

    const handleGenerateRecipe = async () => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }

        setIsLoading(true);
        setError('');
        setRecipe('');

        const formData = new FormData();
        formData.append('image', image);
        formData.append('preference', preference || 'any');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/generate-recipe', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setRecipe(response.data.recipe);
        } catch (err) {
            setError('Failed to generate recipe. The server might be down or an error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={comp} className="min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.15),_transparent_40%)]"></div>

            <header className="fixed top-0 left-0 w-full z-30 p-4">
                <div className="container mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="container mx-auto p-4 pt-24 md:pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Inputs */}
                    <div className="playground-panel relative bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-6 rounded-2xl">
                        <h2 className="text-3xl font-bold mb-4 text-gray-200">1. Upload Ingredients</h2>
                        <ImageUploader onDrop={onDrop} image={image} />

                        <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-200">2. Add Preferences</h2>
                        <input
                            type="text"
                            value={preference}
                            onChange={(e) => setPreference(e.target.value)}
                            placeholder="e.g., vegetarian, gluten-free, spicy"
                            className="w-full p-3 bg-white/5 ring-1 ring-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-shadow"
                        />

                        <button
                            onClick={handleGenerateRecipe}
                            disabled={isLoading}
                            className="w-full relative inline-flex items-center justify-center p-0.5 mt-8 overflow-hidden font-medium text-white rounded-lg group disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed"
                        >
                            <span className={`relative px-5 py-3 transition-all ease-in duration-75 bg-black border text-green-400 rounded-md ${!isLoading ? 'group-hover:bg-opacity-0' : ''}`}>
                                {isLoading ? 'The Chef is Thinking...' : 'Generate Recipe'}
                            </span>
                        </button>
                    </div>

                    {/* Right Column: Output */}
                    <div className="playground-panel relative bg-white/5 ring-1 ring-white/10 backdrop-blur-md p-6 rounded-2xl min-h-[50vh] lg:min-h-0">
                        <h2 className="text-3xl font-bold mb-4 text-gray-200">Your AI-Generated Recipe</h2>
                        <div className="h-full">
                            {isLoading && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center text-gray-400">Loading...</div>
                                </div>
                            )}
                            {error && <div className="text-red-400 bg-red-500/10 p-3 rounded-md">{error}</div>}
                            {recipe && <RecipeDisplay recipe={recipe} />}
                            {!isLoading && !error && !recipe && (
                                <div className="flex items-center justify-center h-full text-center text-gray-500">
                                    <p>Your culinary creation will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlaygroundPage;
