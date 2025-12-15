import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthContext';
import axios from 'axios';
import { formatText } from '../utils/utils';

const Profile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);

    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [isChanged, setIsChanged] = useState(false);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.email) return;

        axios
            .get(`${import.meta.env.VITE_API_URL}/user/${user.email}`)
            .then(res => {
                setDbUser(res.data);
                setName(res.data?.name || "");
                setImage(res.data?.photoURL || "");
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user?.email]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // Update Firebase profile
            await updateUserProfile(name, image);

            // Update DB profile
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/user/${user.email}`,
                {
                    name,
                    image
                }
            );

            setDbUser(prev => ({
                ...prev,
                name,
                photoURL: image
            }));

            setSuccess("Profile updated successfully!");
            setShowModal(false);
            setIsChanged(false);
        } catch (err) {
            console.error(err);
            setError("Failed to update profile. Try again.");
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Profile</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    Edit Profile
                </button>
            </div>

            <div className="flex justify-center mb-4">
                <img
                    src={dbUser?.photoURL}
                    alt={dbUser?.name}
                    className="w-24 h-24 rounded-full border-2 border-red-400 object-cover"
                />
            </div>

            <p><strong>Name:</strong> {dbUser?.name}</p>
            <p><strong>Role:</strong> {formatText(dbUser?.role)}</p>
            <p><strong>Email:</strong> {dbUser?.email}</p>
            <p><strong>Blood Group:</strong> {dbUser?.bloodGroup}</p>
            <p><strong>Division:</strong> {dbUser?.division}</p>
            <p><strong>District:</strong> {dbUser?.district}</p>
            <p><strong>Upazila:</strong> {dbUser?.upazila}</p>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50">
                    <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/3 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Edit Profile
                        </h2>

                        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setIsChanged(e.target.value !== dbUser?.name);
                                }}
                                placeholder="Enter name"
                                className="input input-bordered rounded-full"
                            />

                            <input
                                type="text"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                    setIsChanged(e.target.value !== dbUser?.photoURL);
                                }}
                                placeholder="Enter image URL"
                                className="input input-bordered rounded-full"
                            />

                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-full"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={!isChanged}
                                    className={`px-4 py-2 rounded-full text-white ${isChanged
                                        ? "bg-green-600"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {success && (
                <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow">
                    {success}
                </div>
            )}

            {error && (
                <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Profile;