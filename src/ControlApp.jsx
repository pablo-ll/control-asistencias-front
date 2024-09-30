import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';


// defaultTheme
import themes from 'themes';


// project imports
import NavigationScroll from 'layout/NavigationScroll';
import  AppRouter  from 'routes/AppRouter';


// ==============================|| APP ||============================== //

const ControlApp = () => {
  const customization = useSelector((state) => state.customization);
  
  

 
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          
          <AppRouter />
          
         
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ControlApp;
