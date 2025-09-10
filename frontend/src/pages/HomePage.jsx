
import React from 'react';
import Hero from '../components/Hero';
import HorizontalScroll from '../components/HorizontalScroll';
import Benefits from '../components/Benefits';
import FinalCTA from '../components/FinalCTA';
import ExampleRecipes from '../components/ExampleRecipes';
import Navbar from '../components/Navbar';

const HomePage = () => {
    return (
        <div className="bg-black">
            <Navbar />
            <div id="hero-section">
                <Hero />
            </div>
            <div id="how-it-works">
                <HorizontalScroll />
            </div>
            <div id="benefits-section">
                <Benefits />
            </div>
            <div id="example-recipes">
                <ExampleRecipes />
            </div>
            <div id="cta-section">
                <FinalCTA />
            </div>
        </div>
    );
};

export default HomePage;
