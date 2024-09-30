import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuthStore } from 'hooks';
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';

const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();
   
    useEffect(() => {
       
            checkAuthToken();
      
    }, []);

    if (status === 'checking') {
        return <h3>Cargando....</h3>;
    }

    return (
        <RouterProvider
            router={createBrowserRouter(
                status === 'not-authenticated' ? AuthenticationRoutes : MainRoutes,
                {
                    basename: import.meta.env.VITE_APP_BASE_NAME,
                }
            )}
        />
    );
};

export default AppRouter;
