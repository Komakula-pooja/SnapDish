// src/components/Benefits.jsx
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrainCircuit, Recycle, Globe, ChefHat } from 'lucide-react';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const benefitsData = [
    {
        icon: BrainCircuit,
        title: "Unlock Creativity",
        description: "Discover unique recipes you'd never have imagined from your ingredients.",
        color: "#a855f7", // Purple
    },
    {
        icon: Recycle,
        title: "Reduce Food Waste",
        description: "Give your leftovers a new life and cook delicious meals instead of throwing food away.",
        color: "#22c55e", // Green
    },
    {
        icon: Globe,
        title: "Explore Cuisines",
        description: "Turn simple ingredients into an exciting dish from anywhere around the world.",
        color: "#3b82f6", // Blue
    },
    {
        icon: ChefHat,
        title: "Effortless Planning",
        description: "End the eternal 'what's for dinner?' dilemma in a matter of seconds.",
        color: "#f97316", // Orange
    }
];

const Benefits = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const contentEl = contentRef.current;

        const ctx = gsap.context(() => {
            // Animate the main title
            gsap.from(titleEl, {
                scrollTrigger: {
                    trigger: sectionEl,
                    start: "top 80%",
                    end: "top 50%",
                    scrub: 1,
                },
                y: 50,
                opacity: 0,
                ease: "power2.out"
            });

            // Pin the main content area
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: contentEl,
                    start: "top top",
                    end: "+=4000", // Duration of the pinned section
                    pin: true,
                    scrub: 1.5, // Slightly slower scrub for smoother feel
                    anticipatePin: 1,
                }
            });

            // Background Orb Animation
            const orb = contentEl.querySelector('.orb');
            masterTimeline
                .to(orb, { backgroundColor: benefitsData[1].color, x: "-50vw", ease: "power1.inOut" })
                .to(orb, { backgroundColor: benefitsData[2].color, y: "50vh", ease: "power1.inOut" })
                .to(orb, { backgroundColor: benefitsData[3].color, x: "0", ease: "power1.inOut" });

            // Animate each benefit sequentially
            const benefits = gsap.utils.toArray('.benefit-item');
            
            // Animate IN the first benefit immediately
            const firstIcon = benefits[0].querySelector('.benefit-icon');
            const firstText = benefits[0].querySelector('.benefit-text');
            const firstTitleSplit = new SplitType(firstText.querySelector('h3'), { types: 'chars' });
            const firstDescSplit = new SplitType(firstText.querySelector('p'), { types: 'lines' });

            masterTimeline.from(firstIcon, { scale: 0, opacity: 0, rotation: -90, ease: 'back.out(1.7)' }, 0);
            masterTimeline.from(firstTitleSplit.chars, { y: 30, opacity: 0, stagger: 0.03, ease: 'power2.out' }, 0.1);
            masterTimeline.from(firstDescSplit.lines, { y: 30, opacity: 0, stagger: 0.05, ease: 'power2.out' }, 0.2);

            // Chain the rest of the animations
            for (let i = 1; i < benefits.length; i++) {
                const prevBenefit = benefits[i - 1];
                const currentBenefit = benefits[i];

                const prevIcon = prevBenefit.querySelector('.benefit-icon');
                const prevText = prevBenefit.querySelector('.benefit-text');

                const currentIcon = currentBenefit.querySelector('.benefit-icon');
                const currentText = currentBenefit.querySelector('.benefit-text');
                const currentTitleSplit = new SplitType(currentText.querySelector('h3'), { types: 'chars' });
                const currentDescSplit = new SplitType(currentText.querySelector('p'), { types: 'lines' });
                
                // Animate OUT the previous benefit
                masterTimeline.to([prevIcon, prevText], { 
                    opacity: 0, 
                    y: -40, 
                    ease: 'power2.in',
                    duration: 0.4 
                }, ">+=0.5"); // Wait for 0.5s after the previous animation ends

                // Animate IN the current benefit
                masterTimeline.from(currentIcon, { scale: 0, opacity: 0, rotation: -90, ease: 'back.out(1.7)' }, ">");
                masterTimeline.from(currentTitleSplit.chars, { y: 30, opacity: 0, stagger: 0.03, ease: 'power2.out' }, ">-0.4");
                masterTimeline.from(currentDescSplit.lines, { y: 30, opacity: 0, stagger: 0.05, ease: 'power2.out' }, ">-0.3");
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-black text-white py-20 md:py-32 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 ref={titleRef} className="text-4xl md:text-7xl font-extrabold text-center mb-24">
                    Why You'll <span className="text-green-400">Love</span> SnapDish
                </h2>
                
                <div ref={contentRef} className="relative h-screen w-full">
                    {/* Background glowing orb */}
                    <div className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: benefitsData[0].color }}></div>

                    {/* Content container */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {benefitsData.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="benefit-item absolute w-full max-w-2xl text-center">
                                    <div className="benefit-icon inline-block mb-8">
                                        <Icon size={86} style={{ color: benefit.color }} />
                                    </div>
                                    <div className="benefit-text">
                                        <h3 className="text-4xl md:text-7xl font-bold mb-6" style={{ color: benefit.color }}>{benefit.title}</h3>
                                        <p className="text-2xl text-gray-400">{benefit.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
