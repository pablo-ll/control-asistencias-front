import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
  ListItemText,
} from '@mui/material';

const validationSchema = (isEdit) => Yup.object({
  username: Yup.string().required('El nombre de usuario es obligatorio').min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  empleadoId: Yup.string().required('El email es obligatorio'),
  password: Yup.string().when('isEdit', {
    is: false,
    then: Yup.string().required('La contraseña es obligatoria').min(8, 'La contraseña debe tener al menos 8 caracteres'),
  }),
  password2: Yup.string().when('isEdit', {
    is: false,
    then: Yup.string().required('La contraseña es obligatoria').min(8, 'La contraseña debe tener al menos 8 caracteres'),
  }),
  roleRequest: Yup.object({
    roleListName: Yup.array().min(1, 'Debe seleccionar al menos un rol').required('El rol es obligatorio')
  })
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UsuarioForm = ({ open, handleClose, handleSubmit, isEdit, currentItem, empleados, roles }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>{isEdit ? 'Editar' : 'Agregar'} Usuario</DialogTitle>
    <Formik
      initialValues={currentItem}
      validationSchema={validationSchema(isEdit)}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values);
        setSubmitting(false);
      }}
      enableReinitialize
    >
      {({ isSubmitting, errors, touched, values, setFieldValue }) => (
        <Form>
          <DialogContent>
            <Field
              as={TextField}
              autoFocus
              margin="dense"
              name="username"
              label="Nombre de Usuario"
              fullWidth
              error={Boolean(errors.username) && Boolean(touched.username)}
              helperText={<ErrorMessage name="username" />}
            />
            <FormControl fullWidth margin="dense" error={Boolean(errors.empleadoId) && Boolean(touched.empleadoId)}>
              <InputLabel id="empleado-label">Empleado email</InputLabel>
              <Field
                as={Select}
                labelId="empleado-label"
                name="empleadoId"
                label="Empleado email"
                value={values.empleadoId}
                onChange={(e) => setFieldValue('empleadoId', e.target.value)}
                input={<OutlinedInput label="Empleado email" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {empleados.map((empleado) => (
                  <MenuItem key={empleado.id} value={empleado.id}>
                    {empleado.email}
                  </MenuItem>
                ))}
              </Field>
              <ErrorMessage name="empleadoId" />
            </FormControl>
            {!isEdit && (
              <>
                <Field
                  as={TextField}
                  margin="dense"
                  name="password"
                  label="Contraseña"
                  type="password"
                  fullWidth
                  error={Boolean(errors.password) && Boolean(touched.password)}
                  helperText={<ErrorMessage name="password" />}
                />
                <Field
                  as={TextField}
                  margin="dense"
                  name="password2"
                  label="Repetir contraseña"
                  type="password"
                  fullWidth
                  error={Boolean(errors.password2) && Boolean(touched.password2)}
                  helperText={<ErrorMessage name="password2" />}
                />
              </>
            )}
            <FormControl
              component="fieldset"
              margin="normal"
              error={Boolean(errors.roleRequest?.roleListName) && Boolean(touched.roleRequest?.roleListName)}
              fullWidth
            >
              <InputLabel id="roles-select-label">Roles</InputLabel>
              <Select
                labelId="roles-select-label"
                id="roles-select"
                multiple
                value={values.roleRequest.roleListName}
                onChange={(event) => {
                  const {
                    target: { value }
                  } = event;
                  setFieldValue('roleRequest.roleListName', typeof value === 'string' ? value.split(',') : value);
                }}
                input={<OutlinedInput label="Roles" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.nombre}>
                    <Checkbox checked={values.roleRequest.roleListName.indexOf(role.nombre) > -1} />
                    <ListItemText primary={role.nombre} />
                  </MenuItem>
                ))}
              </Select>
              <ErrorMessage name="roleRequest.roleListName" component="div" />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isEdit ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  </Dialog>
);

export default UsuarioForm;
