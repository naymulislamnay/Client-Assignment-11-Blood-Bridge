import React from 'react';
import { Link } from 'react-router';
import Logo from './Logo';

const Footer = () => {
    return (
        <div className="bg-[#360c0c] mt-3">
            <div className="max-w-[1200px] mx-auto pt-5 sm:pt-8 md:pt-12 pb-3 p-2.5">
                <div className="flex justify-between flex-col md:flex-row gap-1.5 text-[12px] text-[#A1A1AA] text-center md:text-left">
                    <div className="w-full md:max-w-[25%] px-1.5">
                        <Link to='/' className="text-[30px] hover:cursor-pointer w-fit md:mx-0">
                            <Logo></Logo>
                        </Link>
                        <p>
                            At BloodBridge, we believe in the power of humanity. This platform brings donors and recipients together to make life-saving moments possible every day. Your support helps build a future filled with hope.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-white text-[15px] font-medium mt-1.5 md:mt-0 mb-0 md:mb-3">Company</h2>
                        <p className="mt-0 md:mt-2.5">About Us</p>
                        <p className="mt-0 md:mt-2.5">Our Mission</p>
                        <p className="mt-0 md:mt-2.5">Contact Us</p>
                    </div>

                    <div>
                        <h2 className="text-white text-[15px] font-medium mt-1.5 md:mt-0 mb-0 md:mb-3">Services</h2>
                        <p className="mt-0 md:mt-2.5">Services</p>
                        <p className="mt-0 md:mt-2.5">Stories</p>
                        <p className="mt-0 md:mt-2.5">Download App</p>
                    </div>

                    <div>
                        <h2 className="text-white text-[15px] font-medium mt-1.5 md:mt-0 mb-0 md:mb-3">Information</h2>
                        <p className="mt-0 md:mt-2.5">Privacy Policy</p>
                        <p className="mt-0 md:mt-2.5">Terms & Conditions</p>
                        <p className="mt-0 md:mt-2.5">Join Us</p>
                    </div>

                    <div>
                        <h2 className="text-white text-[15px] font-medium mt-1.5 md:mt-0 mb-0 md:mb-3">Social Links</h2>
                        <p className="mt-0 md:mt-2.5">
                            @linkedin.BloodBridge.bd
                        </p>
                        <p className="mt-0 md:mt-2.5">
                            @facebook.BloodBridge.bd
                        </p>
                        <p className="mt-0 md:mt-2.5">
                            support@BloodBridge.com
                        </p>
                    </div>
                </div>
                <hr className="text-[#5e5e5e] mt-2.5 md:mt-8" />
                <p className="text-[#A1A1AA] text-center text-[12px] mt-3">© 2025 BloodBridge All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;