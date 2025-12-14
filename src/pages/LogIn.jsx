import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useState } from 'react';

const LogIn = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state || '/';
    const [signingIn, setSigningIn] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { email, password } = data;
        setSigningIn(true);

        try {
            await signIn(email, password);
            toast.success('Login Successful');
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            toast.error(err.code || err.message);
        } finally {
            setSigningIn(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="max-w-md w-full p-6 bg-gray-100 rounded-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        {...register('password', {
                            required: 'Password is required',
                        })}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={signingIn}
                        className="w-full py-3 bg-lime-500 text-white rounded-md disabled:opacity-60"
                    >
                        {signingIn ? 'Signing In...' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Don’t have an account?{' '}
                    <Link to="/sign-up" className="text-lime-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LogIn;