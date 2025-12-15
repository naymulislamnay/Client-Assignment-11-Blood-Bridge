import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthContext';
import axios from 'axios';
import { formatText } from '../utils/utils';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        axios
            .get(`${import.meta.env.VITE_API_URL}/user/${user.email}`)
            .then(res => {
                setDbUser(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user?.email]);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div>
            <img
                src={user.photoURL || '/default-Profile.png'}
                alt={user.displayName}
                className="w-8 md:w-11 h-8 md:h-11 rounded-full border md:border-2 border-[#f57676] object-cover"
            />

            <p><strong>Name:</strong> {dbUser?.name}</p>
            <p><strong>Role:</strong> {formatText(dbUser?.role)}</p>
            <p><strong>Email:</strong> {dbUser?.email}</p>
            <p><strong>Blood Group:</strong> {dbUser?.bloodGroup}</p>
            <p><strong>Division:</strong> {dbUser?.division}</p>
            <p><strong>District:</strong> {dbUser?.district}</p>
        </div>
    );
};

export default Profile;