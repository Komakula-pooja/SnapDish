import React, { useState } from 'react';
import { Copy, Check, List, ChefHat, Clock } from 'lucide-react';

const RecipeDisplay = ({ recipe }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(recipe.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Parse title - handles both "**Kimchi**" and "**Recipe Title:** Kimchi"
    const titleMatch = recipe.match(/\*\*Recipe Title:\*\*\s*(.+)|^##?\s*(.+)|^\*\*([^*\n:]+)\*\*/m);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3])?.trim() : "Your Recipe";

    // Parse ingredients
    const ingredientsMatch = recipe.match(/\*\*Ingredients[:\*]*\*?\s*([\s\S]*?)(?=\*\*(?:Step|Instructions|Directions|Estimated|Note)|$)/i);
    const ingredientsRaw = ingredientsMatch ? ingredientsMatch[1] : '';
    const ingredients = ingredientsRaw
        .split('\n')
        .map(l => l.replace(/^[\*\-\d\.]+\s*/, '').trim())
        .filter(l => l.length > 0);

    // Parse instructions - handles numbered steps
    const instructionsMatch = recipe.match(/\*\*(?:Step-by-Step Instructions|Instructions|Directions)[:\*]*\*?\s*([\s\S]*?)(?=\*\*Estimated|\*\*Note|$)/i);
    const instructionsRaw = instructionsMatch ? instructionsMatch[1] : '';
    const instructions = instructionsRaw
        .split(/\n(?=\d+\.)/)
        .map(block => {
            // Remove step number and bold header like "**Salting the Cabbage:**"
            return block
                .replace(/^\d+\.\s*/, '')
                .replace(/\*\*[^*]+\*\*\s*/, '')
                .replace(/-\s+/g, '')   // flatten sub-bullets
                .replace(/\n/g, ' ')
                .trim();
        })
        .filter(l => l.length > 0);

    // Parse cooking time
    const timeMatch = recipe.match(/\*\*Estimated Cooking Time[:\*]*\*?\s*([\s\S]*?)(?=\*\*Note|$)/i);
    const cookingTime = timeMatch ? timeMatch[1].replace(/\n/g, ' ').replace(/-\s*/g, '').trim() : '';

    return (
        <div className="relative bg-gray-900/50 ring-1 ring-white/10 rounded-2xl p-6 text-gray-300 flex flex-col max-h-[70vh]">
            <button
                onClick={handleCopy}
                className="absolute top-4 right-12 p-2 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 z-10"
            >
                {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>

            <div className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-teal-500/50">
                {/* Title */}
                <h2 className="text-3xl font-bold text-green-400 mb-6">{title}</h2>

                {/* Ingredients */}
                {ingredients.length > 0 && (
                    <>
                        <div className="flex items-center gap-3 mb-3">
                            <List size={22} className="text-blue-400" />
                            <h3 className="text-xl font-semibold text-blue-400">Ingredients</h3>
                        </div>
                        <ul className="list-disc list-inside space-y-1 mb-6 ml-2">
                            {ingredients.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}

                {/* Instructions */}
                {instructions.length > 0 && (
                    <>
                        <div className="flex items-center gap-3 mb-3">
                            <ChefHat size={22} className="text-blue-400" />
                            <h3 className="text-xl font-semibold text-blue-400">Instructions</h3>
                        </div>
                        <ol className="space-y-3 mb-6">
                            {instructions.map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="font-bold text-orange-400 min-w-[2rem]">{i + 1}.</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ol>
                    </>
                )}

                {/* Cooking Time */}
                {cookingTime && (
                    <div className="flex items-start gap-3 mt-2 p-3 bg-white/5 rounded-lg">
                        <Clock size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-400">{cookingTime}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeDisplay;