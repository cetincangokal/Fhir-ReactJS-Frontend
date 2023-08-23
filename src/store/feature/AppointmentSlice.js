import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Client from 'fhir-kit-client';

const url = 'https://hapi.fhir.org/baseR5/';
const client = new Client({ baseUrl: url });
const resourceType = 'Appointment';

const initialState = {
  appointments: [],
  response: {},
  statusAppo: [],
  nextUrl: null,
  prevUrl: null,
  totalAppointment: 0,
  page: 0,
  appointmentsPage: 20,
  status: 'idle',
  error: null,
}


export const fetchAppointmentData = createAsyncThunk(
  'fetchAppointmentData',
  async ({ type, bundle, searchTerm }) => {
    let response;

    if (type === 'next') {
      response = await client.nextPage(bundle);
    } else if (type === 'prev') {
      response = await client.prevPage(bundle);
    } else if (type === 'search') {
      if (searchTerm.trim() === '') {
        response = await client.search({
          resourceType: 'Appointment',
          searchParams: { _total: 'accurate' },
        });
      } else {
        const phoneNumberRegex = /^\d{10,}$/;
        const isPhoneNumber = phoneNumberRegex.test(searchTerm);
        const [status] = searchTerm.split('');

        let searchParameters = {};

        if (isPhoneNumber) {
          searchParameters = {
            telecom: searchTerm,
          };
        } else {
          const [firstName, lastName] = searchTerm.split(' ');
          if (!lastName) {
            searchParameters = { name: firstName };
          } else {
            searchParameters = {
              given: firstName,
              family: lastName,
            };
          }
        }

        response = await client.search({
          resourceType: 'Appointment',
          searchParams: {
            _total: 'accurate',
            ...searchParameters,
          },
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
      }
    }
    else {
      response = await client.search({
        resourceType: 'Appointment',
        searchParams: { _total: 'accurate' },
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
    }

    return response;
  }
);
//#endregion

export const searchAppointmentsByStatus = createAsyncThunk(
  'searchAppointmentsByStatus',
  async (status) => {
    try {
      // API isteği ile Appointment'ları status değerine göre filtreleyin.
      const response = await client.search({
        resourceType: 'Appointment',
        searchParams: {
          _total: 'accurate',
          status, // status değerini kullanarak arama yapın
        },
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      return response;
    } catch (error) {
      // Hata durumunu yönetin
      throw error;
    }
  }
);

export const fetchStatus = createAsyncThunk('appointment/fetchStatus', async () => {
  const finalRequestBody = {
    resourceType: 'CodeSystem',
    id: 'appointmentstatus'
  };
  const response = await client.read(finalRequestBody);
  return response;
});


//#region Yeni hasta ekleme
export const addAppointment = createAsyncThunk('addAppointment', async (appointmentData) => {
  const response = await client.create({
    resourceType: 'Appointment',
    body: appointmentData,
  });

  return response;
});
//#endregion

//#region Hasta silme
export const deleteAppointment = createAsyncThunk('deleteAppointment', async (appointmentId) => {
  const response = await client.delete({
    resourceType: 'Appointment',
    id: appointmentId,
  });
  return appointmentId;
});
//#endregion

//#region Update
export const updateAppointment = createAsyncThunk(
  'updateAppointment',
  async ({ id, appointmentData }) => {
    appointmentData = { resourceType, id, ...appointmentData }
    const response = await client.update({
      resourceType,
      id,
      body: appointmentData,
    });

    return response;
  }


);
//#endregion

const AppointmentSlice = createSlice({
  name: 'Appointments',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setAppointmentsPage(state, action) {
      state.appointmentsPage = action.payload;
      state.setPage = 0;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(fetchAppointmentData.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.totalAppointment = 0;
      state.status = 'loading';
    });
    builder.addCase(fetchAppointmentData.fulfilled, (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.appointments = action.payload?.entry?.map((entry) => entry.resource) ?? [];
      state.totalAppointment = action.payload?.total || 0;
      state.nextUrl = action.payload?.link.find((link) => link.relation === 'next');
      state.prevUrl = action.payload?.link.find((link) => link.relation === 'prev');
      state.status = 'succeeded';
      console.log(action.payload);
    });
    builder.addCase(fetchAppointmentData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.totalAppointment = 0;
      state.status = 'failed';
    });
    builder.addCase(addAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'loading';
    });

    builder.addCase(addAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.appointments.push(action.payload);
    });

    builder.addCase(addAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.status = 'failed';
    });

    builder.addCase(deleteAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'loading';
    });

    builder.addCase(deleteAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      const deletedAppointmentId = action.payload;
      state.appointments = state.appointments.filter((appointment) => appointment.id !== deletedAppointmentId);
    });

    builder.addCase(deleteAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.status = 'failed';
    });

    builder.addCase(updateAppointment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'loading';
    });

    builder.addCase(updateAppointment.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.appointments = state.appointments.map((appointment) =>
        appointment.id === action.payload.id ? action.payload : appointment
      );
    });

    builder.addCase(updateAppointment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.status = 'failed';
    });
    builder.addCase(fetchStatus.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(fetchStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.statusAppo = action.payload;
    })
    builder.addCase(fetchStatus.rejected, (state) => {
      state.loading = false;
    })

    builder.addCase(searchAppointmentsByStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.totalAppointment = 0;
      state.status = 'loading';
    });
    builder.addCase(searchAppointmentsByStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.appointments = action.payload?.entry?.map((entry) => entry.resource) ?? [];
      state.totalAppointment = action.payload?.total || 0;
      state.nextUrl = action.payload?.link.find((link) => link.relation === 'next');
      state.prevUrl = action.payload?.link.find((link) => link.relation === 'prev');
      state.status = 'succeeded';
    });
    builder.addCase(searchAppointmentsByStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.totalAppointment = 0;
      state.status = 'failed';
    });
  }
});


export const { setPage, setAppointmentsPage } = AppointmentSlice.actions;
export default AppointmentSlice.reducer;