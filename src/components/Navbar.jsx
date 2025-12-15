import React from 'react';
import Logo from './Logo';
import useAuth from '../hooks/useAuth';
import { Link, NavLink } from 'react-router';

/**
 * Logo
Home
Donation Requests
Search Donors
Login
Register
 * **/

const Navbar = () => {
    const { user, logOut } = useAuth();


    const navLinkClass = ({ isActive }) => `hover:text-[#f57676] ${isActive ? 'text-[#f57676] underline' : ''}`;

    const navOptions = (
        <>
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/donate-now" className={navLinkClass}>Donate Now</NavLink>
            {/* <NavLink to="/add-vehicle" className={navLinkClass}>Add Vehicle</NavLink>
            <NavLink to="/my-vehicles" className={navLinkClass}>My Vehicles</NavLink>
            <NavLink to="/my-bookings" className={navLinkClass}>My Bookings</NavLink> */}
        </>
    )
    return (
        <div className="w-full bg-[#360c0c] backdrop-blur-xl shadow-lg border-b border-white/20 z-100">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between py-2 md:py-3 lg:py-4 px-2 md:px-4 lg:px-6 text-2xl">
                <Link to='/'>
                    <Logo></Logo>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-white font-medium text-[12px] lg:text-[16px]">
                    {navOptions}
                </div>
                {user ? (
                    <>
                        {/* <Link
                          to='/dashboard'
                          className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                        >
                          Dashboard
                        </Link> */}

                        <div className="group cursor-pointer flex items-center gap-1.5">
                            <Link to='/profile'>
                                <img
                                    src={user.photoURL || '/default-Profile.png'}
                                    alt={user.displayName} title={user.displayName}
                                    className="w-8 md:w-11 h-8 md:h-11 rounded-full border md:border-2 border-[#f57676] object-cover"
                                />
                            </Link>

                            <button
                                onClick={logOut}
                                className="px-2 md:px-3 lg:px-4 py-1 md:py-2 h-fit rounded-lg bg-[#f05b5b] hover:bg-[#f14343] text-white font-semibold shadow text-[14px] md:text-[16px]"
                            >
                                Log Out
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link
                                to="/log-in"
                                className="px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-lg bg-[#f05b5b] hover:bg-[#f14343] text-white font-semibold shadow text-[14px] md:text-[16px]"
                            >
                                Login
                            </Link>
                            <Link
                                to="/sign-up"
                                className="px-2 md:px-3 lg:px-4 py-1 md:py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 shadow text-[14px] md:text-[16px]"
                            >
                                Register
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;