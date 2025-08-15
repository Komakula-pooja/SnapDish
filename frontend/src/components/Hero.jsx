import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

const foodImages = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=500",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=500",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=500",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=500", 
    "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=500", 
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=500",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500",
    "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=500",
];

const Hero = () => {
    const containerRef = useRef(null);
    useLayoutEffect(() => {
        const ourText = new SplitType('h1', { types: 'chars' });
        const chars = ourText.chars;

        let ctx = gsap.context(() => {
            gsap.from(chars, {
                duration: 0.8,
                opacity: 0,
                y: 100, 
                ease: 'power3.out',
                stagger: {
                    from: "edges",
                    amount: 0.5,   
                },
            });

            // Interactive image grid animation (unchanged)
            const container = containerRef.current;
            const images = gsap.utils.toArray(".grid-item img");

            const onMouseMove = (e) => {
                const { clientX, clientY } = e;
                const { width, height } = container.getBoundingClientRect();
                const x = clientX - width / 2;
                const y = clientY - height / 2;

                gsap.to(images, {
                    x: (i) => x * 0.03 * (i % 4 + 1),
                    y: (i) => y * 0.03 * (i % 4 + 1),
                    rotation: (i) => x * 0.01 * (i % 2 === 0 ? -1 : 1),
                    ease: 'power2.out',
                    duration: 1.5,
                });
            };

            container.addEventListener('mousemove', onMouseMove);

            return () => {
                container.removeEventListener('mousemove', onMouseMove);
            };

        }, containerRef);

        return () => ctx.revert();
    }, []);


    return (
        <section ref={containerRef} className="relative h-screen w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Interactive Background Image Grid */}
            <div className="absolute inset-0 w-full h-full grid grid-cols-2 grid-rows-6 md:grid-cols-4 md:grid-rows-3 opacity-20">
                {foodImages.map((url, index) => (
                    <div key={index} className="grid-item w-full h-full p-2">
                        <img src={url} alt={`food-${index}`} className="w-full h-full object-cover rounded-lg"
                             onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/500x500/000000/FFFFFF?text=Error'; }}/>
                    </div>
                ))}
            </div>

            {/* Main Heading */}
            <h1 className="text-7xl md:text-9xl font-extrabold text-white relative z-10 text-center leading-tight">
                Snap<span className="text-green-400">Dish</span>
            </h1>
        </section>
    );
};

export default Hero;
