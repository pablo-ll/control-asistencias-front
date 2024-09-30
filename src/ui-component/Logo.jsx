// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * 
 *
 */
import logo from 'assets/images/Logo.png';
// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (

    <img src={logo} alt="Beicruz" width="100" />
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Berry" width="100" />
     *
     */
   
    
  );
};

export default Logo;
