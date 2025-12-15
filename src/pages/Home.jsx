import React from 'react';

const Home = () => {
    const makeDifference = [
        {
            image: '/donation-bus.png',
            heading: 'Host a Blood Drive',
            desc: 'Organize a blood drive and help save lives in your community.'
        },
        {
            image: '/volunteer.png',
            heading: 'Become a Volunteer',
            desc: 'Join our volunteer network and support blood donation efforts.'
        },
        {
            image: '/poor-girl.png',
            heading: 'Make a Donation',
            desc: 'Your financial support helps us reach more people in need.'
        }
    ];

    return (
        <div>
            {/* types of blood Section */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">
                    Types Of Blood
                </h2>
                <div className='grid grid-cols-8 gap-1.5 w-4/5 mx-auto'>
                    {
                        ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(group => (
                            <div className='relative w-20 mx-auto'>
                                <img src="/blood-bag.png" alt="" />
                                <p className='absolute font-extrabold text-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>{group}</p>
                            </div>
                        ))
                    }
                </div>
            </div>



            {/* Make a Difference Section */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">
                    More Ways You Can Make a Difference
                </h2>
                <p className="text-gray-500 mt-2">
                    Every action matters. Choose how you want to help today.
                </p>
            </div>

            {/* Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {makeDifference.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center group"
                    >
                        <div className="mx-auto mb-4 bg-red-50 flex items-center justify-center group-hover:scale-105 transition">
                            <img
                                src={item.image}
                                alt={item.heading}
                                className="w-full h-full rounded-xl"
                            />
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {item.heading}
                        </h3>

                        <p className="text-gray-500 text-sm">
                            {item.desc}
                        </p>

                        <button className="mt-5 px-5 py-2 text-white rounded-full bg-[#f05b5b] hover:bg-[#f14343] hover:cursor-pointer transition">
                            Learn More
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;