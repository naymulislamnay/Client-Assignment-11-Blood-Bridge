import React from 'react';
import Logo from './Logo';

const Navbar = () => {
    return (
        <div className="w-full bg-[#360c0c] backdrop-blur-xl shadow-lg border-b border-white/20 z-100">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between py-2 md:py-3 lg:py-4 px-2 md:px-4 lg:px-6 text-2xl">
                <Logo></Logo>
            </div>
        </div>
    );
};

export default Navbar;