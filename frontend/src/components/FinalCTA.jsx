import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const FinalCTA = () => {
    const sectionRef = useRef(null);
    const buttonRef = useRef(null);

    useLayoutEffect(() => {
        const sectionEl = sectionRef.current;
        const heading = sectionEl.querySelector('h2');
        const button = buttonRef.current;

        // Button hover animation
        const onMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt based on mouse position (more pronounced at edges)
            const tiltX = ((x / rect.width) - 0.5) * 20; // ±10deg tilt
            const tiltY = ((y / rect.height) - 0.5) * -10; // ±5deg tilt
            
            gsap.to(button, {
                rotationY: tiltX,
                rotationX: tiltY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: 'power2.out'
            });
        };

        const onMouseLeave = () => {
            gsap.to(button, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });
        };

        button.addEventListener('mousemove', onMouseMove);
        button.addEventListener('mouseleave', onMouseLeave);

        // Scroll animations
        const ctx = gsap.context(() => {
            const split = new SplitType(heading, { types: 'chars' });
            
            gsap.timeline({
                scrollTrigger: {
                    trigger: sectionEl,
                    start: 'top 60%',
                    toggleActions: 'play none none none'
                }
            })
            .from(split.chars, {
                y: 100,
                opacity: 0,
                stagger: 0.03,
                duration: 0.8,
                ease: 'power3.out'
            })
            .from(button, {
                y: 40,
                duration: 0.6,
                ease: 'back.out(2)'
            }, "-=0.3");

        }, sectionRef);

        return () => {
            ctx.revert();
            button.removeEventListener('mousemove', onMouseMove);
            button.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src="/cooking_video.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            <div className="relative z-20 text-white px-4">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tighter mb-8">
                    Stop Staring.
                    <br />
                    Start Cooking.
                </h2>
                
                <Link
                    to="/playground"
                    ref={buttonRef}
                    className="inline-block px-12 py-4 text-xl md:text-2xl font-medium rounded-full 
                             border-2 border-white/80 backdrop-blur-sm
                             hover:border-white hover:backdrop-blur transition-all duration-300
                             transform-style-preserve-3d" 
                >
                    <span className="relative z-10">Try SnapDish Now</span>
                    {/* Glass overlay */}
                    <span className="absolute inset-0 bg-white/5 rounded-full 
                                    hover:bg-white/10 transition-colors duration-300" />
                </Link>
            </div>
        </section>
    );
};

export default FinalCTA;