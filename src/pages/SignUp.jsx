import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { imageUpload } from '../utils/utils';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';

const SignUp = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state || '/';

    const [divisions, setDivisions] = useState([]);
    const [selectedDivisionId, setSelectedDivisionId] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [upazilas, setUpazilas] = useState([]);
    const [signingUp, setSigningUp] = useState(false);

    // fetch divisions
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/all-divisions`)
            .then(res => res.json())
            .then(data => setDivisions(data))
            .catch(err => console.log(err));
    }, []);

    // fetch districts by division
    useEffect(() => {
        if (!selectedDivisionId) return;
        fetch(`${import.meta.env.VITE_API_URL}/districts?divisionId=${selectedDivisionId}`)
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.error(err));
    }, [selectedDivisionId]);

    // fetch upazilas by district
    useEffect(() => {
        if (!selectedDistrictId) return;
        fetch(`${import.meta.env.VITE_API_URL}/upazilas?districtId=${selectedDistrictId}`)
            .then(res => res.json())
            .then(data => setUpazilas(data))
            .catch(err => console.error(err));
    }, [selectedDistrictId]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setSigningUp(true);

        try {
            // Use uploaded image or default image
            let imageURL = '/default-Profile.png';
            if (data.image && data.image.length > 0) {
                imageURL = await imageUpload(data.image[0]);
            }

            // Firebase signup & profile update
            await createUser(data.email, data.password);
            await updateUserProfile(data.name, imageURL);

            // Find names from IDs
            const selectedDivision = divisions.find(d => d.id === data.division);
            const selectedDistrict = districts.find(d => d.id === data.district);

            // Prepare MongoDB payload
            const userData = {
                name: data.name,
                email: data.email,
                image: imageURL,
                bloodGroup: data.bloodGroup,
                division: selectedDivision?.name || '',
                district: selectedDistrict?.name || '',
                upazila: data.upazila,
                role: 'donor',
                status: true,
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData);

            toast.success('Signup Successful');
            navigate(from, { replace: true });

        } catch (err) {
            console.error(err);
            toast.error(err.code || err.message || 'Signup failed');
        } finally {
            setSigningUp(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="max-w-md w-full p-6 bg-gray-100 rounded-md">
                <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Name */}
                    <input
                        placeholder="Name"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                    {/* Image (Optional) */}
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                    />

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    {/* Blood Group */}
                    <select {...register('bloodGroup', { required: 'Blood group is required' })} className="w-full px-3 py-2 border rounded-md">
                        <option value="">Select Blood Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                    {errors.bloodGroup && <p className="text-red-500 text-sm">{errors.bloodGroup.message}</p>}

                    {/* Division */}
                    <select
                        {...register('division', { required: 'Division is required' })}
                        onChange={(e) => setSelectedDivisionId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">Select Your Division</option>
                        {divisions.map(d => <option key={d._id} value={d.id}>{d.name}</option>)}
                    </select>
                    {errors.division && <p className="text-red-500 text-sm">{errors.division.message}</p>}

                    {/* District */}
                    <select
                        {...register('district', { required: 'District is required' })}
                        onChange={(e) => setSelectedDistrictId(e.target.value)}
                        disabled={!districts.length}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">Select Your District</option>
                        {districts.map(d => <option key={d._id} value={d.id}>{d.name}</option>)}
                    </select>
                    {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}

                    {/* Upazila */}
                    <select
                        {...register('upazila', { required: 'Upazila is required' })}
                        disabled={!upazilas.length}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">Select Your Upazila</option>
                        {upazilas.map(u => <option key={u._id} value={u.name}>{u.name}</option>)}
                    </select>
                    {errors.upazila && <p className="text-red-500 text-sm">{errors.upazila.message}</p>}

                    <button type="submit" disabled={signingUp} className="w-full py-3 bg-lime-500 text-white rounded-md disabled:opacity-60">
                        {signingUp ? 'Signing Up...' : 'Sign Up'}
                    </button>

                </form>

                <p className="text-center mt-4 text-sm">
                    Already have an account? <Link to="/log-in" className="text-lime-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;