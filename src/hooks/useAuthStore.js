import { useDispatch, useSelector } from 'react-redux';
import { controlAsistenciaApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store/auth/authSlice';

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ username, password }) => {
        dispatch(onChecking());
        try {
            const { data } = await controlAsistenciaApi.post('/auth/log-in', { username, password });
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({ name: data.username, uid: data.uid }));
        } catch (error) {
            dispatch(onLogout('Credenciales incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }

    const startGoogleLogin = async () => {
        // Redirigir al usuario a la URL de autorización de Google
        window.location.href = `${controlAsistenciaApi.defaults.baseURL}/oauth2/authorization/google`;

        
    };

    const handleGoogleLoginSuccess = async (token, userId) => {
        try {
            const { data } = await controlAsistenciaApi.get(`/auth/loginSuccess?token=${token}&userId=${userId}`);
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onLogin({ name: data.username, uid: data.userId }));
        } catch (error) {
            dispatch(onLogout('Error en la autenticación con Google'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };
    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          dispatch(onLogout());
          return;
        }
      
        try {
          const { data } = await controlAsistenciaApi.get('/auth/revalidate');
          console.log(data, 'dataToken');
          dispatch(onLogin({ name: data.username, uid: data.uid }));
        } catch (error) {
          console.error('Error revalidating token:', error);
          localStorage.removeItem('token');
          dispatch(onLogout());
        }
      };

    const startLogout = async () => {
        try {
            await controlAsistenciaApi.post('/auth/logout');
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.clear();
            dispatch(onLogout());
        }
    };

    return {
        errorMessage,
        status,
        user,
        startLogin,
        startLogout,
        startGoogleLogin,
        checkAuthToken,
        handleGoogleLoginSuccess
    };
};
