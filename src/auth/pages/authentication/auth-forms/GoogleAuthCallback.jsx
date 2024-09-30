import { useAuthStore } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export const GoogleAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleGoogleLoginSuccess, status } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const processAuth = async () => {
            // Comprueba si ya estamos procesando para evitar múltiples ejecuciones
            if (isProcessing) return;

            // Comprueba si estamos en la ruta correcta
            if (!location.search.includes('token') || !location.search.includes('userId')) {
                navigate('/login');
                return;
            }

            setIsProcessing(true);

            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const userId = params.get('userId');

            if (token && userId) {
                await handleGoogleLoginSuccess(token, userId);
                navigate('/');
            } else {
                navigate('/login');
            }

            setIsProcessing(false);
        };

        processAuth();
    }, [location, handleGoogleLoginSuccess, navigate, isProcessing]);

    if (status === 'checking') {
        return <div>Verificando autenticación...</div>;
    }

    return <div>Procesando autenticación de Google...</div>;
};