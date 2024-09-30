import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/roles/listar');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
); 

export const createRol = createAsyncThunk(
  'roles/createRol',
  async (newRol, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/roles/crear', newRol);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRol = createAsyncThunk(
  'roles/updateRol',
  async (rol, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/roles/modificar/${rol.id}`, rol);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRol = createAsyncThunk(
  'roles/deleteRol',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/roles/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rolSlice = createSlice({
  name: 'roles',
  initialState: {
    isLoading: false,
    roles: [],
    activeRol: null,
    error: null,
  },
  reducers: {
    setActiveRol: (state, { payload }) => {
      state.activeRol = payload;
    },
    clearActiveRol: (state) => {
      state.activeRol = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.roles = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchRoles.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.roles = [];
      })
      .addCase(createRol.fulfilled, (state, { payload }) => {
        state.roles.push(payload);
      })
      .addCase(updateRol.fulfilled, (state, { payload }) => {
        state.roles = state.roles.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteRol.fulfilled, (state, { payload }) => {
        state.roles = state.roles.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveRol, clearActiveRol } = rolSlice.actions;
