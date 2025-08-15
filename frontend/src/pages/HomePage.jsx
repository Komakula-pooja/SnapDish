
import React from 'react';
import Hero from '../components/Hero';
import HorizontalScroll from '../components/HorizontalScroll';
import Benefits from '../components/Benefits';
import FinalCTA from '../components/FinalCTA';
import ExampleRecipes from '../components/ExampleRecipes';

const HomePage = () => {
    return (
        <div className="bg-black">
            <Hero />
            <HorizontalScroll />
            <Benefits />
            <ExampleRecipes />
            <FinalCTA />
        </div>
    );
};

export default HomePage;
