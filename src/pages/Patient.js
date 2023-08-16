import React, { useEffect } from 'react'
import SideNavBar from '../components/SideNavbar'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import PatientList from '../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientsData, setPage, setPatientsPage } from '../store/feature/PatientSlicer';



const Patient = () => {
    const dispatch = useDispatch();
    const { patients, response, nextUrl, prevUrl, totalPatient, page, patientsPage, status, error } = useSelector(state => state.patients);
    useEffect(() => {
        dispatch(fetchPatientsData(''));
    }, [dispatch]);



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
            <Navbar />
            <Box height={70} />
            <Box sx={{ display: 'flex' }}>
                <SideNavBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <PatientList
                        patients={patients}
                        columns={columns}
                        totalPatient={totalPatient}
                        page={page}
                        patientsPage={patientsPage}
                        status={status}
                        error={error}
                        nextUrl={nextUrl}
                        prevUrl={prevUrl}
                        changePage={changePage}
                        ChangePatients={ChangePatients}

                    />
                </Box>
            </Box>


        </>
    )
}

export default Patient;