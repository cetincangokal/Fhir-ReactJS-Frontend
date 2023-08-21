import React, { useEffect } from 'react'
import SideNavBar from '../components/SideNavbar'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import AppointmentList from '../components/AppointmentList';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentData, setPage, setAppointmentsPage } from '../store/feature/AppointmentSlice';



const Appointment = () => {
    const dispatch = useDispatch();
    const { appointments, response, nextUrl, prevUrl, totalAppointment, page, appointmentsPage, status, error } = useSelector(state => state.appointments);
    useEffect(() => {
        dispatch(fetchAppointmentData(''));
    }, [dispatch]);




    //#region Sayfada gösterilecek data
    const changePage = (event, newPage) => {
        if (newPage > page && nextUrl) {
            dispatch(fetchAppointmentData({ type: 'next', bundle: response }))
                .catch((error) => {
                    console.error("Error fetching next page data:", error);
                });
        } else if (newPage < page && prevUrl) {
            dispatch(fetchAppointmentData({ type: 'prev', bundle: response }))
                .catch((error) => {
                    console.error("Error fetching previous page data:", error);
                });
        } else {
            dispatch(setPage(newPage));
        }
    };

    //#endregion



    const ChangeAppointments = (event) => {
        dispatch(setAppointmentsPage(+event.target.value));
        dispatch(setPage(0));
    };



    const columns = [
        { id: 'id', label: 'ID', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 100 },
        { id: 'patientName', label: 'Patient Name', minWidth: 150 },
        { id: 'expert', label: 'Expert', minWidth: 100 },
        { id: 'status', label: 'Status', minWidth: 100 },
    ];
    return (
        <>
            <Navbar />
            <Box height={70} />
            <Box sx={{ display: 'flex' }}>
                <SideNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <AppointmentList
                        appointments={appointments}
                        columns={columns}
                        totalAppointment={totalAppointment}
                        page={page}
                        appointmentsPage={appointmentsPage}
                        status={status}
                        error={error}
                        nextUrl={nextUrl}
                        prevUrl={prevUrl}
                        changePage={changePage}
                        ChangeAppointments={ChangeAppointments}

                    />
                </Box>
            </Box>


        </>
    )
}

export default Appointment;