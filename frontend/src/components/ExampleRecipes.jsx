import React, { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const sampleRecipes = [
    {
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800",
        title: "Inferno Pepperoni Pizza",
        recipe: `**Ingredients:**\n* 1 ball of pizza dough\n* 1/2 cup tomato sauce\n* 1 tsp sugar\n* 1/2 tsp oregano\n* 2 cloves garlic, minced\n* Salt and pepper to taste\n* 1/4 cup olive oil\n* 8 oz shredded mozzarella cheese\n* 1/4 cup shredded parmesan cheese\n* 4 oz spicy pepperoni slices\n\n**Instructions:**\n 1. Preheat Oven: Preheat your oven to 450°F (232°C). If you have a pizza stone, place it in the oven while preheating.\n2. Prepare the Sauce: In a small bowl, combine the tomato sauce, sugar, minced garlic, oregano, salt, and pepper. Mix well.\n3. Shape the Dough: On a lightly floured surface, stretch or roll out your pizza dough to your desired thickness and shape.\n4. Assemble the Pizza: Brush the pizza dough with olive oil. Spread the tomato sauce mixture evenly over the dough, leaving a small border for the crust. Sprinkle the mozzarella cheese evenly over the sauce. Top with parmesan cheese. Arrange the spicy pepperoni slices over the cheese.\n5. Bake the Pizza: Carefully transfer the pizza to the preheated pizza stone (or a baking sheet). Bake for 12-15 minutes, or until the crust is golden brown and the cheese is melted and bubbly.\n6. Serve: Remove the pizza from the oven and let it cool for a few minutes before slicing and serving. Enjoy your Inferno Pepperoni Pizza!`
    },
    {
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
        title: "Fresh Quinoa Salad",
        recipe: `**Ingredients:**\n* 1 cup cooked quinoa\n* 1/2 cucumber, diced\n* 1 cup cherry tomatoes, halved\n* 1/4 cup feta cheese\n* 2 tbsp lemon juice\n* 1 tbsp olive oil\n\n**Instructions:**\n1. In a large bowl, combine quinoa, cucumber, and tomatoes.\n2. Drizzle with lemon juice and olive oil.\n3. Gently stir in feta cheese.\n4. Season with salt and pepper to taste.`
    },
    {
        image: "https://images.squarespace-cdn.com/content/v1/624fa63d5ba99559345806e6/8892373c-72b0-491f-bf42-c1d44fec3e46/EG5_EP79_Spaghetti-Carbonara_67645e919b12432e590b303456de6e74.jpg?q=80&w=800",
        title: "Gourmet Pasta Carbonara",
        recipe: `**Ingredients:**\n* Pasta: 1 pound spaghetti\n* Bacon: 6 oz, chopped into lardons\n* Eggs: 4 large egg yolks\n* Parmesan Cheese: 1 cup, freshly grated, plus more for serving\n* Milk: 1/4 cup whole milk\n* Garlic: 2 cloves, minced finely\n* Olive Oil: 1 tablespoon\n* Fresh Parsley: 2 tablespoons, finely chopped, for garnish\n* Salt: To taste\n* Black Pepper: Freshly ground, to taste (and plenty of it!)\n\n**Instructions:**\n1. Prep Your Paradise: Bring a large pot of salted water to a rolling boil. This is crucial for perfectly cooked pasta! While the water heats, chop your bacon into small, bite-sized pieces (lardons). Grate your Parmesan cheese. Freshly grated is key for that authentic, melty texture. Mince the garlic. Chop the parsley.\n2. Bacon Bliss: In a large skillet (big enough to eventually hold the pasta), heat the olive oil over medium heat. Add the bacon and cook until crispy and golden brown. Remove the bacon from the skillet with a slotted spoon and set aside, leaving the rendered bacon fat in the pan. Add the minced garlic to the bacon fat in the skillet and cook for about 30 seconds, or until fragrant. Be careful not to burn it! Remove from heat.\n3. Sauce Sensation: While the bacon is cooking and the garlic is resting, whisk together the egg yolks, Parmesan cheese, and milk in a bowl. Add a generous amount of freshly ground black pepper. The pepper is a vital part of Carbonara! Taste and season with salt, but be mindful that the bacon and Parmesan are already salty.\n4. **Pasta Perfection:** Cook the spaghetti according to package directions for al dente. Before draining the pasta, reserve about 1 cup of the starchy pasta water. This is liquid gold! Drain the pasta and immediately add it to the skillet with the bacon and garlic.\n5. **Carbonara Creation:** Remove the skillet from the heat. Pour the egg yolk mixture over the hot pasta. Toss quickly and continuously to coat the pasta evenly. The heat from the pasta will gently cook the eggs and create a creamy sauce. If the sauce is too thick, add a little of the reserved pasta water until you reach your desired consistency. Add the crispy bacon to the pasta.\n6. **Serve & Savor:** Serve immediately in warm bowls. Garnish with a sprinkle of fresh parsley, extra grated Parmesan cheese, and a generous grind of black pepper. Enjoy your "Silk Road" Carbonara! It's a taste of pure culinary comfort.`
    },
    {
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
        title: "Avocado & Veggie Bowl",
        recipe: `**Ingredients:**\n* 1/2 avocado, sliced\n* 1/2 cup mixed greens\n* 1/4 cup chickpeas\n* 1/4 cup shredded carrots\n* 2 tbsp vinaigrette dressing\n\n**Instructions:**\n1. Arrange mixed greens in a bowl.\n2. Top with avocado, chickpeas, and carrots.\n3. Drizzle with vinaigrette just before serving.`
    }
];

// --- Modal Component ---
const RecipeModal = ({ recipe, onClose }) => {
    const modalRef = useRef(null);

    useLayoutEffect(() => {
        const modal = modalRef.current;
        gsap.fromTo(modal, 
            { opacity: 0, scale: 0.9 }, 
            { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
        );
    }, []);

    const handleClose = () => {
        gsap.to(modalRef.current, { 
            opacity: 0, 
            scale: 0.9, 
            duration: 0.2, 
            ease: 'power2.in',
            onComplete: onClose,
        });
    };
    
    const formattedRecipe = recipe.recipe
        .replace(/\*\*(.*?):\*\*/g, '<strong class="text-xl block mt-4 mb-2 text-blue-400">$1:</strong>')
        .replace(/\* (.*?)(?=\n\*|\n\n|$)/g, '<li class="list-disc ml-6 text-gray-300">$1</li>')
        .replace(/(\d+\.\s)/g, '<br/><span class="font-semibold text-gray-200">$1</span>');

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div ref={modalRef} className="relative bg-gray-900 ring-1 ring-white/10 rounded-2xl p-8 max-w-2xl w-full">
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-green-400 mb-6">{recipe.title}</h2>
                <div className="max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-green-400/50 scrollbar-track-transparent">
                    <div dangerouslySetInnerHTML={{ __html: formattedRecipe }} />
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---
const ExampleRecipes = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    useLayoutEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const items = gsap.utils.toArray(".recipe-item");

        const ctx = gsap.context(() => {
            gsap.from(titleEl, {
                scrollTrigger: { trigger: sectionEl, start: "top 80%", scrub: 1 },
                y: 50, opacity: 0
            });
            gsap.from(items, {
                scrollTrigger: { trigger: sectionEl, start: "top 70%", toggleActions: "play none none reverse" },
                opacity: 0,
                y: 100,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-black text-white py-20 md:py-32">
            <div className="container mx-auto px-4">
                <h2 ref={titleRef} className="text-4xl md:text-6xl font-extrabold text-center mb-16">
                    Taste the Possibilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sampleRecipes.map((recipe, index) => (
                        <div 
                            key={index} 
                            className="recipe-item group relative rounded-2xl overflow-hidden cursor-pointer"
                            onClick={() => setSelectedRecipe(recipe)}
                        >
                            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover aspect-square transition-transform duration-500 ease-in-out group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <div className="absolute inset-0 flex items-end p-6">
                                <h3 className="text-2xl font-bold transition-transform duration-300 ease-out group-hover:-translate-y-2">{recipe.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
        </section>
    );
};

export default ExampleRecipes;
