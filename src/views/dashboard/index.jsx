import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// project imports




import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import VacacionPermiso from 'views/utilities/VacacionPermiso';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          
          
         <VacacionPermiso/>
        </Grid>
      </Grid>
     
    </Grid>
  );
};

export default Dashboard;
