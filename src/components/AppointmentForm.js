import { Grid, IconButton, Typography, Box, TextField, Button, InputLabel, Select, MenuItem, FormControl, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenders, fetchPatientsData, setPage, setPatientsPage, updatePatient } from '../store/feature/PatientSlicer';

import { useTranslation } from 'react-i18next';
import PatientListAppo from './PatientListAppointment';

const AppointmentForm = ({handleClose}) => {
    const dispatch = useDispatch();
    const [t, i18n] = useTranslation('global');
    const { patients, response, nextUrl, prevUrl, totalPatient, page, patientsPage, status, error } = useSelector(state => state.patients);
    useEffect(() => {
        dispatch(fetchPatientsData(''));
    }, [dispatch]);

    const { genders } = useSelector((state) => state.patients);

    React.useEffect(() => {
      if (genders.length <= 0) {
        dispatch(fetchGenders());
      }
    }, [genders]);

    //#region Sayfada gösterilecek data
    const changePage = (event, newPage) => {
        if (newPage > page && nextUrl) {
            dispatch(fetchPatientsData({ type: 'next', bundle: response }))
                .catch((error) => {
                    console.error("Error fetching next page data:", error);
                });
        } else if (newPage < page && prevUrl) {
            dispatch(fetchPatientsData({ type: 'prev', bundle: response }))
                .catch((error) => {
                    console.error("Error fetching previous page data:", error);
                });
        } else {
            dispatch(setPage(newPage));
        }
    };

    //#endregion



    const ChangePatients = (event) => {
        dispatch(setPatientsPage(+event.target.value));
        dispatch(setPage(0));
    };



    const columns = [
        { id: 'id', label: 'ID', minWidth: 100 },
        { id: 'identity', label: 'Identity No', minWidth: 100 },
        { id: 'name', label: 'Name Surname', minWidth: 150 },
        { id: 'gender', label: 'Gender', minWidth: 100 },
        { id: 'birthDate', label: 'Birth Date', minWidth: 100 },
        { id: 'phoneNumber', label: 'Phone Number', minWidth: 100 },
        { id: 'address', label: 'Country/State' },
        { id: 'nationality', label: 'Nationality', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];






    return (
        <>
            <Box sx={{ flexGrow: 1 }} />

            <PatientListAppo
                handleClose={handleClose}
                patients={patients}
                columns={columns}
                totalPatient={totalPatient}
                page={page}
                genders={genders}
                patientsPage={patientsPage}
                status={status}
                error={error}
                nextUrl={nextUrl}
                prevUrl={prevUrl}
                changePage={changePage}
                ChangePatients={ChangePatients}
            />

            <Box sx={{ m: 4 }} />
        </>
    )
}

export default AppointmentForm;
