import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchEmpleados = createAsyncThunk(
  'departamentos/fetchEmpleados',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/empleados/listar');
      console.log(response.data, 'data emp')
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEmpleado = createAsyncThunk(
  'departamentos/createEmpleado',
  async (newEmpleado, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/empleados/crear', newEmpleado);
      console.log(response.data, 'formulario resp')
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmpleado = createAsyncThunk(
  'empleados/updateEmpleado',
  async (empleado, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/empleados/modificar/${empleado.id}`, empleado);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEmpleado = createAsyncThunk(
  'empleados/deleteEmpleado',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/empleados/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const empleadoSlice = createSlice({
  name: 'empleados',
  initialState: {
    isLoading: false,
    empleados: [],
    activeEmpleado: null,
    error: null,
  },
  reducers: {
    setActiveEmpleado: (state, { payload }) => {
      state.activeEmpleado = payload;
    },
    clearActiveEmpleado: (state) => {
      state.activeEmpleado = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpleados.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmpleados.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.empleados = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchEmpleados.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.empleados = [];
      })
      .addCase(createEmpleado.fulfilled, (state, { payload }) => {
        state.empleados.push(payload);
      })
      .addCase(updateEmpleado.fulfilled, (state, { payload }) => {
        state.empleados = state.empleados.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteEmpleado.fulfilled, (state, { payload }) => {
        state.empleados = state.empleados.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveEmpleado, clearActiveEmpleado } = empleadoSlice.actions;
export default empleadoSlice.reducer;
