import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAdminAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/backoffice/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
