import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthContext';
import axios from 'axios';
import { formatText } from '../utils/utils';
import { FaPen } from "react-icons/fa";
import { imageUpload } from '../utils/utils';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);

    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        bloodGroup: "",
        divisionId: "",
        districtId: "",
        upazila: ""
    });

    const [originalData, setOriginalData] = useState({});
    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Load divisions
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/all-divisions`)
            .then(res => setDivisions(res.data))
            .catch(err => console.error(err));
    }, []);

    // Load user data
    useEffect(() => {
        if (!user?.email) return;

        axios.get(`${import.meta.env.VITE_API_URL}/user/${user.email}`)
            .then(res => {
                const data = res.data;
                setDbUser(data);

                setFormData({
                    name: data.name || "",
                    image: data.photoURL || "",
                    bloodGroup: data.bloodGroup || "",
                    divisionId: "",
                    districtId: "",
                    upazila: data.upazila || ""
                });

                setOriginalData({
                    name: data.name || "",
                    image: data.photoURL || "",
                    bloodGroup: data.bloodGroup || "",
                    divisionId: "",
                    districtId: "",
                    upazila: data.upazila || ""
                });

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user?.email]);

    useEffect(() => {
        if (!dbUser || !divisions.length) return;

        const selectedDivision = divisions.find(d => d.name === dbUser.division);
        const divisionId = selectedDivision?.id || "";

        setFormData(prev => ({ ...prev, divisionId }));
        setOriginalData(prev => ({ ...prev, divisionId }));
    }, [dbUser, divisions]);

    useEffect(() => {
        if (!formData.divisionId) {
            setDistricts([]);
            setFormData(prev => ({ ...prev, districtId: "", upazila: "" }));
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/districts?divisionId=${formData.divisionId}`)
            .then(res => setDistricts(res.data))
            .catch(err => console.error(err));
    }, [formData.divisionId]);


    useEffect(() => {
        if (!dbUser || !districts.length) return;

        const selectedDistrict = districts.find(d => d.name === dbUser.district);
        const districtId = selectedDistrict?.id || "";

        setFormData(prev => ({ ...prev, districtId }));
        setOriginalData(prev => ({ ...prev, districtId }));
    }, [dbUser, districts]);


    useEffect(() => {
        if (!formData.districtId) {
            setUpazilas([]);
            setFormData(prev => ({ ...prev, upazila: "" }));
            return;
        }

        axios.get(`${import.meta.env.VITE_API_URL}/upazilas?districtId=${formData.districtId}`)
            .then(res => setUpazilas(res.data))
            .catch(err => console.error(err));
    }, [formData.districtId]);

    const hasChanges = () => {
        return Object.keys(formData).some(key => formData[key] !== originalData[key]);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // Update Firebase
            await updateUserProfile(formData.name, formData.image);

            // convert id to name
            const selectedDivision = divisions.find(d => d.id === formData.divisionId)?.name || "";
            const selectedDistrict = districts.find(d => d.id === formData.districtId)?.name || "";

            // Update MongoDB
            await axios.patch(`${import.meta.env.VITE_API_URL}/user/${user.email}`, {
                name: formData.name,
                photoURL: formData.image,
                bloodGroup: formData.bloodGroup,
                division: selectedDivision,
                divisionId: formData.divisionId,
                district: selectedDistrict,
                districtId: formData.districtId,
                upazila: formData.upazila
            });

            setDbUser(prev => ({
                ...prev,
                name: formData.name,
                photoURL: formData.image,
                bloodGroup: formData.bloodGroup,
                division: selectedDivision,
                district: selectedDistrict,
                upazila: formData.upazila
            }));

            setOriginalData({ ...formData });
            setSuccess("Profile updated successfully!");
            setShowModal(false);
        } catch (err) {
            console.error(err);
            setError("Failed to update profile. Try again.");
        }
    };

    const handleProfileImageClick = async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                toast.loading('Uploading image...', { id: 'upload' });
                const uploadedURL = await imageUpload(file);
                toast.dismiss('upload');

                if (!uploadedURL) {
                    toast.error('Image upload failed');
                    return;
                }

                // update Firebase
                await updateUserProfile(dbUser.name, uploadedURL);

                // update MongoDB
                await axios.patch(`${import.meta.env.VITE_API_URL}/user/${user.email}`, {
                    photoURL: uploadedURL
                });

                setDbUser(prev => ({ ...prev, photoURL: uploadedURL }));
                setFormData(prev => ({ ...prev, image: uploadedURL }));
                setOriginalData(prev => ({ ...prev, image: uploadedURL }));

                toast.success('Profile image updated!');
            };

            input.click();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update image');
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Profile</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:cursor-pointer"
                >
                    Edit Profile
                </button>
            </div>

            <div className="flex justify-center mb-4 relative w-fit mx-auto">
                <img
                    src={dbUser?.photoURL}
                    alt={dbUser?.name}
                    className="w-24 h-24 rounded-full border-2 border-red-400 object-cover"
                />
                <button
                    className='absolute bottom-0 right-2 bg-[#360c0c] p-1 rounded-full text-white text-[12px] hover:cursor-pointer'
                    onClick={handleProfileImageClick}
                >
                    <FaPen />
                </button>

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
                        <h2 className="text-lg font-semibold mb-4 text-center">Edit Profile</h2>

                        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Enter name"
                                className="input input-bordered rounded-full"
                            />


                            <select
                                value={formData.bloodGroup}
                                onChange={(e) => handleChange("bloodGroup", e.target.value)}
                                className="input input-bordered rounded-full"
                            >
                                <option value="">Select Blood Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>

                            <select
                                value={formData.divisionId}
                                onChange={(e) => {
                                    handleChange("divisionId", e.target.value);
                                    handleChange("districtId", "");
                                    handleChange("upazila", "");
                                }}
                            >
                                <option value="">Select Division</option>
                                {divisions.map(d => <option key={d._id} value={d.id}>{d.name}</option>)}
                            </select>

                            <select
                                value={formData.districtId}
                                onChange={(e) => {
                                    handleChange("districtId", e.target.value);
                                    handleChange("upazila", "");
                                }}
                                disabled={!districts.length}
                            >
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d._id} value={d.id}>{d.name}</option>)}
                            </select>

                            <select
                                value={formData.upazila}
                                onChange={(e) => handleChange("upazila", e.target.value)}
                                disabled={!upazilas.length}
                            >
                                <option value="">Select Upazila</option>
                                {upazilas.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
                            </select>

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
                                    disabled={!hasChanges()}
                                    className={`px-4 py-2 rounded-full text-white ${hasChanges() ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
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