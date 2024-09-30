import React, { useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Switch,
  Typography,
  Container
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';

const RoleSchema = Yup.object().shape({
  name: Yup.string().required('Role name is required'),
  permissions: Yup.object().shape({
    manageUsers: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    manageRoles: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    manageDepartments: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    managePositions: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    manageEmployees: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    manageContracts: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    manageAttendance: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    manageVacations: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
    managePermits: Yup.object().shape({
      general: Yup.boolean(),
      create: Yup.boolean(),
      modify: Yup.boolean(),
      delete: Yup.boolean(),
    }),
  })
});

export const RoleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.pathname.includes('edit');
  const role = location.state?.role || {
    name: '',
    permissions: {
      manageUsers: { general: false, create: false, modify: false, delete: false },
      manageRoles: { general: false, create: false, modify: false, delete: false },
      manageDepartments: { general: false, create: false, modify: false, delete: false },
      managePositions: { general: false, create: false, modify: false, delete: false },
      manageEmployees: { general: false, create: false, modify: false, delete: false },
      manageContracts: { general: false, create: false, modify: false, delete: false },
      manageAttendance: { general: false, create: false, modify: false, delete: false },
      manageVacations: { general: false, create: false, modify: false, delete: false },
      managePermits: { general: false, create: false, modify: false, delete: false },
    }
  };

  const handleGeneralSwitchChange = (values, setFieldValue, section) => (event) => {
    const { checked } = event.target;
    setFieldValue(`permissions.${section}.general`, checked);
    setFieldValue(`permissions.${section}.create`, checked);
    setFieldValue(`permissions.${section}.modify`, checked);
    setFieldValue(`permissions.${section}.delete`, checked);
  };

  return (
    <MainCard title="Gestión de Roles" >
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Role' : 'Create Role'}
      </Typography>
      <Formik
        initialValues={role}
        validationSchema={RoleSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values);
          // Submit form values to the server or state management
          navigate('/role');
          resetForm();
        }}
        enableReinitialize
      >
        {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Role Name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              {Object.keys(values.permissions).map((section, index) => (
                <Grid item xs={12} key={index}>
                  <Typography variant="h6">{section.replace(/manage/, 'Manage ')}</Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography>General</Typography>
                      <Switch
                        name={`permissions.${section}.general`}
                        checked={values.permissions[section].general}
                        onChange={handleGeneralSwitchChange(values, setFieldValue, section)}
                      />
                    </Grid>
                    {['create', 'modify', 'delete'].map((action) => (
                      <Grid item xs={4} key={action}>
                        <Typography>{action}</Typography>
                        <Switch
                          name={`permissions.${section}.${action}`}
                          checked={values.permissions[section][action]}
                          onChange={handleChange}
                          disabled={!values.permissions[section].general}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={3} justifyContent="flex-end" style={{ marginTop: '20px' }}>
              <Grid item>
                <Button onClick={() => navigate('/roles')} color="secondary">Cancel</Button>
              </Grid>
              <Grid item>
                <Button onClick={handleSubmit} color="primary">{isEdit ? 'Update Role' : 'Create Role'}</Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
    </MainCard>
  );
};


