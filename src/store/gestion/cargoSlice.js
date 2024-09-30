import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { controlAsistenciaApi } from '../../api';

// Async actions
 export const fetchCargos = createAsyncThunk(
  'cargos/fetchCargos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.get('/cargos/listar');
     
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
); 

export const createCargo = createAsyncThunk(
  'cargos/createCargo',
  async (newCargo, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.post('/cargos/crear', newCargo);
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCargo = createAsyncThunk(
  'cargos/updateCargo',
  async (cargo, { rejectWithValue }) => {
    try {
      const response = await controlAsistenciaApi.put(`/cargos/modificar/${cargo.id}`, cargo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCargo = createAsyncThunk(
  'cargos/deleteCargo',
  async (id, { rejectWithValue }) => {
    try {
      await controlAsistenciaApi.delete(`/cargos/eliminar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cargoSlice = createSlice({
    name: 'cargos',
    initialState: {
      isLoading: false,
      cargos: [],
      activeCargo: null,
      error: null,
    },
  reducers: {
    setActiveCargo: (state, { payload }) => {
      state.activeCargo = payload;
    },
    clearActiveCargo: (state) => {
      state.activeCargo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCargos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCargos.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.cargos = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchCargos.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.cargos = [];
      })
      .addCase(createCargo.fulfilled, (state, { payload }) => {
        state.cargos.push(payload);
      })
      .addCase(updateCargo.fulfilled, (state, { payload }) => {
        state.cargos = state.cargos.map(item => item.id === payload.id ? payload : item);
      })
      .addCase(deleteCargo.fulfilled, (state, { payload }) => {
        state.cargos = state.cargos.filter(item => item.id !== payload);
      });
  },
});

export const { setActiveCargo, clearActiveCargo } = cargoSlice.actions;
