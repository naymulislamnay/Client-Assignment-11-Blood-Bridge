import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    const location = useLocation();

    if (loading) {
        return <Loader></Loader>
    }

    if (user) {
        return children;
    }

    return <Navigate state={location?.pathname} to='/log-in'></Navigate>;
};

export default PrivateRoute;