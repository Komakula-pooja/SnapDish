import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Link } from 'react-router-dom';
import { ChefHat, Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Navbar = () => {
    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useLayoutEffect(() => {
        const navEl = navRef.current;
        gsap.fromTo(navEl,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useLayoutEffect(() => {
        if (!mobileMenuRef.current) return;
        if (isMenuOpen) {
            gsap.fromTo(mobileMenuRef.current,
                { y: -200, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, [isMenuOpen]);

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: element,
                    offsetY: 80
                },
                ease: 'power3.inOut'
            });
            setIsMenuOpen(false);
        }
    };

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo Section */}
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleScrollTo('hero-section')}
                >
                    <img
                        src="/snapdish-logo.png"
                        alt="SnapDish Logo"
                        className="h-8 md:h-10 w-auto"
                    />
                    <span className="text-2xl font-bold text-white">Snap<span className="text-green-400">Dish</span></span>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex space-x-8">
                    <button onClick={() => handleScrollTo('how-it-works')} className="nav-link text-white hover:text-green-400 transition-colors duration-300">
                        How It Works
                    </button>
                    <button onClick={() => handleScrollTo('benefits-section')} className="nav-link text-white hover:text-blue-400 transition-colors duration-300">
                        Benefits
                    </button>
                    <button onClick={() => handleScrollTo('example-recipes')} className="nav-link text-white hover:text-purple-400 transition-colors duration-300">
                        Recipe Gallery
                    </button>
                    <button onClick={() => handleScrollTo('cta-section')} className="nav-link text-white hover:text-pink-400 transition-colors duration-300">
                        Create Your Recipe
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Auth Button */}
                <div className="hidden md:block">
                    <Link
                        to="#"
                        className="btn-auth px-6 py-2 rounded-full font-semibold transition-all duration-300
                            bg-transparent border text-white "
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div ref={mobileMenuRef} className="md:hidden bg-black/90 backdrop-blur-sm w-full py-4 text-center">
                    <div className="flex flex-col space-y-4">
                        <button onClick={() => handleScrollTo('how-it-works')} className="nav-link text-white hover:text-green-400 transition-colors duration-300 text-xl font-medium">
                            How It Works
                        </button>
                        <button onClick={() => handleScrollTo('benefits-section')} className="nav-link text-white hover:text-blue-400 transition-colors duration-300 text-xl font-medium">
                            Benefits
                        </button>
                        <button onClick={() => handleScrollTo('example-recipes')} className="nav-link text-white hover:text-purple-400 transition-colors duration-300 text-xl font-medium">
                            Recipe Gallery
                        </button>
                        <button onClick={() => handleScrollTo('cta-section')} className="nav-link text-white hover:text-pink-400 transition-colors duration-300 text-xl font-medium">
                            Create Your Recipe
                        </button>
                        <div className="border-t border-gray-700 mx-8 my-4"></div>
                        <Link
                            to="#"
                            onClick={() => setIsMenuOpen(false)}
                            className="btn-auth px-6 py-2 mx-auto rounded-full font-semibold transition-all duration-300
                                bg-gradient-to-r from-green-400 to-blue-400 text-white w-fit
                                hover:from-green-500 hover:to-blue-500 hover:scale-105"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;