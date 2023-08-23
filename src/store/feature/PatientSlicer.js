
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Client from 'fhir-kit-client';



const url = 'https://hapi.fhir.org/baseR5/';
const client = new Client({ baseUrl: url });
const resourceType = 'Patient';

const initialState = {
  patients: [],
  response: {},
  genders: [],
  nextUrl: null,
  prevUrl: null,
  totalPatient: 0,
  page: 0,
  patientsPage: 20,
  status: 'idle',
  error: null,
}

//#region Fetch ve search işlemi
export const fetchPatientsData = createAsyncThunk(
  'fetchPatientsData',
  async ({ type, bundle, searchTerm }) => {
    let response;

    if (type === 'next') {
      response = await client.nextPage(bundle);
    } else if (type === 'prev') {
      response = await client.prevPage(bundle);
    } else if (type === 'search') {
      if (searchTerm.trim() === '') {
        response = await client.search({
          resourceType: 'Patient',
          searchParams: { _total: 'accurate' },
        });
      } else {
        //bu kısmı switch case yapmak daha doğru olur galiba
        const phoneNumberRegex = /^\d{10,}$/;
        const isPhoneNumber = phoneNumberRegex.test(searchTerm);

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
          resourceType: 'Patient',
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
        resourceType: 'Patient',
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

export const fetchGenders = createAsyncThunk('patients/fetchGenders', async () => {
  const finalRequestBody = {
    resourceType: 'CodeSystem',
    id: 'administrative-gender'
  };
  const response = await client.read(finalRequestBody);
  console.log(response);
  return response;
});

//#region Yeni hasta ekleme
export const addPatient = createAsyncThunk('addPatient', async (patientData) => {
  const response = await client.create({
    resourceType: 'Patient',
    body: patientData,
  });

  return response;
});
//#endregion

//#region Hasta silme
export const deletePatient = createAsyncThunk('deletePatient', async (patientId) => {
  const response = await client.delete({
    resourceType: 'Patient',
    id: patientId,
  });
  console.log(response);
  return patientId;
});
//#endregion

//#region Update
export const updatePatient = createAsyncThunk(
  'updatePatient',
  async ({ id, patientData }) => {
    patientData={resourceType, id,...patientData}
    const response = await client.update({
      resourceType,
      id,
      body: patientData,
    });

    return response;
  }
  
  
); 
//#endregion



const PatientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPatientsPage(state, action) {
      state.patientsPage = action.payload;
      state.setPage = 0;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(fetchPatientsData.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.totalPatient = 0;
      state.status = 'loading';
    });
    builder.addCase(fetchPatientsData.fulfilled, (state, action) => {
      state.loading = false;
      state.response = action.payload;
      state.patients = action.payload?.entry?.map((entry) => entry.resource) ?? [];
      state.totalPatient = action.payload?.total || 0;
      state.nextUrl = action.payload?.link.find((link) => link.relation === 'next');
      state.prevUrl = action.payload?.link.find((link) => link.relation === 'prev');
      state.status = 'succeeded';
    });
    builder.addCase(fetchPatientsData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.totalPatient = 0;
      state.status = 'failed';
    });
    builder.addCase(addPatient.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'loading';
    });

    builder.addCase(addPatient.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.patients.push(action.payload);
    });

    builder.addCase(addPatient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.status = 'failed';
    });

    builder.addCase(deletePatient.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'loading';
    });

    builder.addCase(deletePatient.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      const deletedPatientId = action.payload;
      state.patients = state.patients.filter((patient) => patient.id !== deletedPatientId);
    });

    builder.addCase(deletePatient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.status = 'failed';
    });
    
    builder.addCase(updatePatient.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = 'loading';
    });
    
    builder.addCase(updatePatient.fulfilled, (state, action) => {
      state.loading = false;
      state.status = 'succeeded';
      state.patients = state.patients.map((patient) =>
        patient.id === action.payload.id ? action.payload : patient
      );
    });

    builder.addCase(updatePatient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.status = 'failed';
    });
    builder.addCase(fetchGenders.pending, (state) => {
      state.loading = true;
    })
    builder.addCase(fetchGenders.fulfilled, (state, action) => {
      state.loading = false;
      state.genders = action.payload;
    })
    builder.addCase(fetchGenders.rejected, (state) => {
      state.loading = false;
    })

  },
});


export const { setPage, setPatientsPage } = PatientSlice.actions;
export default PatientSlice.reducer;