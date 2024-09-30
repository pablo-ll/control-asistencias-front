import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { Navigate } from 'react-router-dom';
import { GoogleAuthCallback } from 'auth/pages/authentication/auth-forms/GoogleAuthCallback';


// login option 3 routing
const LoginPage = Loadable(lazy(() => import('auth/pages/authentication3/LoginPage')));
const AuthRegister3 = Loadable(lazy(() => import('auth/pages/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //




const AuthenticationRoutes = [
  {
  path: '/',
  element: <MinimalLayout /> ,
  children: [
    {
      path: '/',
      element: <Navigate to="/login" />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/oauth2/redirect',
      element: <GoogleAuthCallback/>
    },
   
   
    
  ]
},
{
  path: '*',
  element: <Navigate to="/login" />
},

]; 

export default AuthenticationRoutes;






