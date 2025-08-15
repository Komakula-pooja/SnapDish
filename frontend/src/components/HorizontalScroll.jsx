import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { Camera, Apple, Carrot, Wheat, Sparkles, ChefHat, Clock, ArrowRight } from 'lucide-react';

// We must register the plugin to use it
gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = () => {
    const componentRef = useRef(null);
    const sliderRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const panels = gsap.utils.toArray(".panel");
            const connectingStrings = gsap.utils.toArray(".connecting-string");
            
            const horizontalScroll = gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: componentRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (panels.length - 1),
                    end: () => "+=" + sliderRef.current.offsetWidth,
                },
            });

            // Animate connecting strings
            connectingStrings.forEach((string, index) => {
                gsap.fromTo(string, 
                    { 
                        scaleX: 0,
                        transformOrigin: "left center"
                    },
                    {
                        scaleX: 1,
                        duration: 1,
                        ease: "power2.inOut",
                        scrollTrigger: {
                            trigger: panels[index + 1],
                            containerAnimation: horizontalScroll,
                            start: "left 90%",
                            end: "left 70%",
                            scrub: 1,
                        }
                    }
                );
            });

            // --- Panel 1: Camera Splash Animation ---
            const panel1 = panels[0];
            const cameraIcon = panel1.querySelector('.camera-icon');
            const cameraFlash = panel1.querySelector('.camera-flash');
            const cameraPulse = panel1.querySelector('.camera-pulse');
            const panel1Text = new SplitType(panel1.querySelector('h2'), { types: 'chars' });

            gsap.timeline({
                scrollTrigger: {
                    trigger: panel1,
                    containerAnimation: horizontalScroll,
                    start: "left center",
                    toggleActions: "play reverse play reverse",
                }
            })
            .from(cameraIcon, { scale: 0, rotation: -45, duration: 1, ease: 'power3.out' })
            .to(cameraFlash, { scale: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, "-=0.7")
            .to(cameraPulse, { scale: 3, opacity: 0, duration: 1, ease: 'power2.out' }, "-=1")
            .from(panel1Text.chars, { opacity: 0, y: 50, stagger: 0.03, duration: 0.5 }, "-=0.5");

            // --- Panel 2: Falling Ingredients Animation ---
            const panel2 = panels[1];
            const ingredients = panel2.querySelectorAll('.ingredient-icon');
            const ingredientsImage = panel2.querySelector('.ingredients-image');
            const floatingElements = panel2.querySelectorAll('.floating-element');
            const panel2Text = new SplitType(panel2.querySelector('h2'), { types: 'chars' });

            gsap.timeline({
                scrollTrigger: {
                    trigger: panel2,
                    containerAnimation: horizontalScroll,
                    start: 'left 80%',
                    toggleActions: 'play reverse play reverse',
                }
            })
            .from(ingredients, { y: -200, opacity: 0, duration: 1, ease: 'bounce.out', stagger: 0.1 })
            .from(ingredientsImage, { y: -100, opacity: 0, duration: 0.8, ease: 'power2.out' }, "-=0.8")
            .from(floatingElements, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1 }, "-=0.6")
            .from(panel2Text.chars, { opacity: 0, scale: 0, stagger: 0.03, duration: 0.5 });

            // Continuous floating animation for ingredients
            gsap.to(ingredients, {
                y: "random(-20, 20)",
                x: "random(-10, 10)",
                rotation: "random(-15, 15)",
                duration: 2,
                ease: "power1.inOut",
                stagger: {
                    each: 0.2,
                    repeat: -1,
                    yoyo: true
                }
            });

            // --- Panel 3: Recipe Reveal Animation ---
            const panel3 = panels[2];
            const recipeImage = panel3.querySelector('.recipe-image');
            const sparkles = panel3.querySelectorAll('.sparkle');
            const panel3Text = new SplitType(panel3.querySelector('h2'), { types: 'words, chars' });

            gsap.timeline({
                scrollTrigger: {
                    trigger: panel3,
                    containerAnimation: horizontalScroll,
                    start: 'left 80%',
                    toggleActions: 'play reverse play reverse',
                }
            })
            .from(recipeImage, { scale: 0.5, opacity: 0, rotation: 15, duration: 1, ease: 'power3.out' })
            .from(sparkles, { scale: 0, opacity: 0, rotation: 360, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.1 }, "-=0.8")
            .from(panel3Text.chars, { opacity: 0, filter: 'blur(5px)', stagger: 0.03, duration: 0.8 }, "-=0.5");

            // Continuous sparkle animation
            gsap.to(sparkles, {
                rotation: 360,
                scale: "random(0.8, 1.2)",
                duration: 3,
                ease: "power1.inOut",
                stagger: {
                    each: 0.3,
                    repeat: -1
                }
            });

            // --- Panel 4: Final Animation ---
            const panel4 = panels[3];
            const chefIcon = panel4.querySelector('.chef-icon');
            const panel4Text = panel4.querySelector('h2');
            const gradientBg = panel4.querySelector('.gradient-bg');

            gsap.timeline({
                scrollTrigger: {
                    trigger: panel4,
                    containerAnimation: horizontalScroll,
                    start: 'left center',
                    toggleActions: 'play reverse play reverse',
                }
            })
            .from(gradientBg, { scale: 0, opacity: 0, duration: 1.2, ease: 'power3.out' })
            .from(chefIcon, { scale: 0, rotation: 360, duration: 1.2, ease: 'power3.inOut' }, "-=0.8")
            .from(panel4Text, { opacity: 0, scale: 0.8, duration: 0.7 }, "-=0.8");

        }, componentRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full overflow-hidden" ref={componentRef}>
            <div ref={sliderRef} className="h-screen w-[400vw] flex flex-row relative">
                {/* Connecting Strings */}
                <div className="connecting-string absolute top-1/2 left-full w-screen h-0.5 bg-gradient-to-r from-blue-400 to-green-400 z-10 transform -translate-y-1/2"></div>
                <div className="connecting-string absolute top-1/2 left-[200vw] w-screen h-0.5 bg-gradient-to-r from-green-400 to-purple-400 z-10 transform -translate-y-1/2"></div>
                <div className="connecting-string absolute top-1/2 left-[300vw] w-screen h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 z-10 transform -translate-y-1/2"></div>

                {/* Panel 1 */}
                <div className="panel w-screen h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-8 overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400 rounded-full"></div>
                        <div className="absolute bottom-32 right-32 w-24 h-24 border border-green-400 rounded-full"></div>
                        <div className="absolute top-1/2 left-10 w-16 h-16 border border-purple-400 rounded-full"></div>
                    </div>
                    
                    <div className="text-center relative z-10">
                        <div className="relative inline-block mb-12">
                            <div className="camera-flash absolute inset-0 bg-white rounded-full" style={{ transform: 'scale(0)', opacity: 1 }}></div>
                            <div className="camera-pulse absolute inset-0 bg-blue-400 rounded-full opacity-30" style={{ transform: 'scale(1)' }}></div>
                            <div className="camera-icon relative bg-gradient-to-r from-blue-400 to-green-400 p-6 rounded-full">
                                <Camera size={80} className="text-white" />
                            </div>
                        </div>
                        <h2 className="text-5xl md:text-8xl text-white font-extrabold leading-tight">
                            One photo is all it takes.
                        </h2>
                    </div>
                </div>

                {/* Panel 2 */}
                <div className="panel w-screen h-screen bg-gradient-to-br from-black to-green-300/10 flex items-center justify-center p-8 overflow-hidden relative">
                    {/* Floating ingredient icons */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="ingredient-icon absolute" style={{top: '10%', left: '15%'}}>
                            <Apple size={48} className="text-red-400" />
                        </div>
                        <div className="ingredient-icon absolute" style={{top: '20%', left: '80%'}}>
                            <Carrot size={56} className="text-orange-400" />
                        </div>
                        <div className="ingredient-icon absolute" style={{top: '70%', left: '10%'}}>
                            <Wheat size={40} className="text-yellow-400" />
                        </div>
                        <div className="ingredient-icon absolute" style={{top: '60%', right: '20%'}}>
                            <Sparkles size={32} className="text-purple-400" />
                        </div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="floating-element absolute top-1/4 right-1/4 w-4 h-4 bg-green-400 rounded-full opacity-60"></div>
                    <div className="floating-element absolute bottom-1/4 left-1/4 w-6 h-6 bg-blue-400 rounded-full opacity-40"></div>
                    <div className="floating-element absolute top-3/4 right-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-70"></div>
                    
                    <div className="text-center relative z-10">
                        <div className="ingredients-image w-64 h-40 md:w-96 md:h-64 rounded-xl overflow-hidden border-4 border-gradient-to-r from-green-400 to-blue-400 mb-8 shadow-2xl shadow-green-400/20 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 p-1 rounded-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800" 
                                    className="w-full h-full object-cover rounded-lg" 
                                    alt="Fresh Ingredients"
                                />
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-7xl text-white font-extrabold leading-tight">
                            From apples to zucchini, <br /> 
                            <span className="text-green-400">
                                SnapDish auto-detects
                            </span> what you <br />have on hand.
                        </h2>
                    </div>
                </div>

                {/* Panel 3 */}
                <div className="panel w-screen h-screen bg-gradient-to-br from-black to-slate-900 flex items-center justify-center p-8 relative">
                    {/* Sparkle effects */}
                    <div className="sparkle absolute top-1/4 left-1/4">
                        <Sparkles size={24} className="text-yellow-400" />
                    </div>
                    <div className="sparkle absolute top-1/3 right-1/4">
                        <Sparkles size={32} className="text-green-400" />
                    </div>
                    <div className="sparkle absolute bottom-1/4 left-1/3">
                        <Sparkles size={28} className="text-blue-400" />
                    </div>
                    <div className="sparkle absolute bottom-1/3 right-1/3">
                        <Sparkles size={20} className="text-purple-400" />
                    </div>

                    <div className="text-center relative z-10">
                        <div className="recipe-image w-64 h-40 md:w-96 md:h-60 rounded-xl overflow-hidden mb-6 shadow-2xl relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 p-1 rounded-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800" 
                                    className="w-full h-full object-cover rounded-lg" 
                                    alt="Delicious Recipe"
                                />
                            </div>

                        </div>
                        <h2 className="text-3xl md:text-7xl font-extrabold leading-tight">
                            <span className="text-green-400"> Smart pairing </span>{' '}
                            <span className="text-white"> of your ingredients, </span>
                            <br />
                            <span className="text-white"> Step-by-step timing </span> {' '}
                            <span className="text-green-400"> and substitutes.</span>
                        </h2>
                    </div>
                </div>

                {/* Panel 4 */}
                <div className="panel w-screen h-screen  bg-gradient-to-br from-slate-900 to-black flex items-center justify-center p-8 relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="gradient-bg absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 opacity-50"></div>
                    
                    {/* Background decorative elements */}
                    <div className="absolute top-10 left-10 w-64 h-64 border border-green-400/30 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 border border-purple-400/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-400/20 rounded-full"></div>
                    
                    <div className="text-center relative z-10">
                        <div className="chef-icon mb-8 inline-block bg-gradient-to-r from-green-400 to-green-200 p-8 rounded-full">
                            <ChefHat size={80} className="text-white" />
                        </div>
                        <h2 className="text-3xl md:text-7xl font-extrabold leading-tight">
                            <span className="text-green-400">
                                SnapDish
                            </span>
                            <span className="text-white"> turns your </span>
                            <br />
                            <span className="text-white">pantry into </span>
                            <span className="text-green-400">
                                possibilities.
                            </span>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HorizontalScroll;