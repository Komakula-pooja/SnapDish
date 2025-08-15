// src/components/RecipeDisplay.jsx
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Copy, Check, List, ChefHat } from 'lucide-react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

const RecipeDisplay = ({ recipe }) => {
    const [copied, setCopied] = useState(false);
    const comp = useRef(null);

    useLayoutEffect(() => {
        const recipeCard = comp.current;
        const recipeContent = recipeCard.querySelector('.recipe-content');

        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(recipeCard, {
                opacity: 0,
                scale: 0.95,
                y: 50,
                duration: 0.6,
                ease: 'power3.out'
            });

            const titleEl = recipeContent.querySelector('.recipe-title');
            if (titleEl) {
                const splitTitle = new SplitType(titleEl, { types: 'chars' });
                tl.from(splitTitle.chars, {
                    opacity: 0,
                    y: 20,
                    stagger: 0.03,
                    duration: 0.5
                }, "-=0.3");
            }

            const listItems = recipeContent.querySelectorAll('li');
            if (listItems.length > 0) {
                tl.from(listItems, {
                    opacity: 0,
                    x: -30, 
                    stagger: 0.1, 
                    duration: 0.5,
                    ease: 'power2.out'
                }, "-=0.2");
            }

        }, comp);
        return () => ctx.revert();
    }, [recipe]);

    const handleCopy = () => {
        const cleanText = recipe
            .replace(/\*\*(.*?)\*\*/g, '$1\n\n')
            .replace(/\* /g, '- ')
            .replace(/(\d+\.\s)/g, '\n$1');
            
        navigator.clipboard.writeText(cleanText.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const titleMatch = recipe.match(/\*\*(.*?)\*\*/);
    const title = titleMatch ? titleMatch[1] : "Your Recipe";
    
    const ingredientsMatch = recipe.match(/\*\*Ingredients:\*\*\s*([\s\S]*?)(?=\*\*Instructions:\*\*|$)/i);
    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim().split(/\n\s*\*/).filter(item => item.trim() !== '') : [];
    
    const instructionsMatch = recipe.match(/\*\*Instructions:\*\*\s*([\s\S]*)/i);
    const instructions = instructionsMatch ? instructionsMatch[1].trim().split(/\n\s*\d+\./).filter(item => item.trim() !== '') : [];

    return (
        <div 
            ref={comp} 
            className="relative bg-gray-900/50 ring-1 ring-white/10 rounded-2xl p-6 text-gray-300 flex flex-col max-h-[70vh]"
        >
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 z-10"
            >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>

            <div 
                className="recipe-content overflow-y-auto pr-2 flex-1"
            >
                <h2 className="recipe-title text-3xl font-bold text-green-400 mb-6">{title}</h2>
                
                <div className="flex items-center gap-3 mt-4 mb-4">
                    <List size={24} className="text-blue-400" />
                    <h3 className="text-2xl font-semibold text-blue-400">Ingredients</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    {ingredients.map((item, index) => (
                        <li key={`ing-${index}`}>{item.trim()}</li>
                    ))}
                </ul>

                <div className="flex items-center gap-3 mt-6 mb-4">
                    <ChefHat size={24} className="text-blue-400" />
                    <h3 className="text-2xl font-semibold text-blue-400">Instructions</h3>
                </div>
                <ol className="space-y-3 mb-2">
                    {instructions.map((item, index) => (
                        <li key={`inst-${index}`} className="flex gap-3">
                           <span className="font-bold text-orange-400 min-w-[2rem]">{index + 1}.</span>
                           <span>{item.trim()}</span>
                        </li>
                    ))}
                </ol>
            </div>

            <style jsx>{`
                .recipe-content::-webkit-scrollbar {
                    width: 6px;
                }
                .recipe-content::-webkit-scrollbar-track {
                    background: transparent;
                }
                .recipe-content::-webkit-scrollbar-thumb {
                    background-color: rgba(45, 212, 191, 0.5);
                    border-radius: 3px;
                }
            `}</style>
        </div>
    );
};

export default RecipeDisplay;
