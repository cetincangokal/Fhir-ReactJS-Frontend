//table.js

import * as React from 'react';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Divider, IconButton, InputBase, Stack, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { Search as SearchIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { deletePatient, fetchPatientsData, addPatient } from '../store/feature/PatientSlicer';
import { useDispatch } from 'react-redux';
import ConfirmationDialog from './ConfirmationDialogs';
import Modal from '@mui/material/Modal';
import Form from './Form';
import AppointmentForm from './AppointmentForm';
import { useTranslation } from 'react-i18next';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};




const PatientList = ({
    patients,
    columns,
    page,
    patientsPage,
    status,
    totalPatient,
    error,
    nextUrl,
    prevUrl,
    changePage,
    ChangePatients,
}) => {

    const dispatch = useDispatch();
    const [t, i18n] = useTranslation('global');
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        resetForm();
    };
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const [editedPatient, setEditedPatient] = useState(null);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [deletingPatientId, setDeletingPatientId] = useState(null);


    const handleOpenDeleteConfirmation = (patientId) => {
        setDeleteConfirmationOpen(true);
        setDeletingPatientId(patientId);
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
        setDeletingPatientId(null);
    };

    const handleConfirmDelete = () => {
        if (deletingPatientId) {
            handleDeletePatient(deletingPatientId);
            handleCloseDeleteConfirmation();
        }
    };
    const handleDeletePatient = (patientId) => {
        dispatch(deletePatient(patientId));
    };

    const handleSearch = () => {
        dispatch(fetchPatientsData({ type: 'search', searchTerm }));
    };

    const handleCreatePatient = (patientData) => {
        dispatch(addPatient(patientData));
        setOpen(false);
    };
    const handleEditClick = (patient) => {
        setEditedPatient(patient);
        setOpen(true);
    };
    const resetForm = async () => {
        setEditedPatient(patients);
    };
    const handleArrowClick = (patient) => {
        setEditedPatient(patient); // Set the patient data to the state
        setAppointmentModalOpen(true); // Open the appointment modal
    };



    return (
        <div>
            <div>
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Form
                            handleCreatePatient={handleCreatePatient}
                            id={editedPatient?.id}
                            editedPatient={editedPatient}
                            handleClose={handleClose}

                        />
                    </Box>
                </Modal>
                <Modal
                    open={appointmentModalOpen}
                    onClose={() => setAppointmentModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"

                >
                    <Box sx={style}>
                        <AppointmentForm onClose={handleClose} patient={editedPatient} />
                    </Box>
                </Modal>

            </div>

            <Paper sx={{ width: '100%', overflow: 'hidden', padding: '20px' }}>
                <Typography
                    gutterBottom
                    variant='h5'
                    component="div"
                    sx={{ padding: "20px" }}
                >
                    {t('patient.list.title')}
                </Typography>
                <Divider />
                <Box height={10} />
                <Stack direction={"row"} spacing={2}>
                    <InputBase
                        style={{ color: 'black', marginLeft: '20px', borderInlineColor: '#B1AFAF' }}

                        placeholder={t('patient.list.columns.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <IconButton onClick={handleSearch} sx={{ color: 'black' }}>
                        <SearchIcon />
                    </IconButton>
                    <Typography variant='h6' component={'div'} sx={{ flexGrow: 1 }}></Typography>

                    <Button onClick={handleOpen} color='grey' variant="contained" endIcon={<AddCircle />}>{t('patient.addModal.button.addBtn')}</Button>
                </Stack>
                <Box height={10} />
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {t('patient.list.columns.' + column.id)}
                                    </TableCell>
                                ))}
                                <TableCell align='left' style={{ minWidth: "100px" }}>

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        {status === 'loading' && (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}

                        {status === 'failed' && (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        Error fetching data.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}

                        {status === 'succeeded' && (
                            <TableBody>
                                {patients
                                    .slice(page * patientsPage, page * patientsPage + patientsPage)
                                    .map((patient) => (
                                        <TableRow
                                            key={patient.id}
                                            style={{ borderRadius: '10px' }}
                                        >
                                            <TableCell>{patient.id || '-'}</TableCell>
                                            <TableCell>{patient.identifier?.[0]?.value || '-'}</TableCell>

                                            <TableCell>
                                                {`${patient.name?.[0]?.given?.[0] || ''} ${patient.name?.[0]?.family || ''} ${patient.name?.[0].text || ''
                                                    } `}
                                            </TableCell>

                                            <TableCell>{patient.gender || '-'}</TableCell>
                                            <TableCell>{patient.birthDate || '-'}</TableCell>
                                            <TableCell>
                                                {patient.telecom?.map((phone, index) => (
                                                    <div key={index}>
                                                        <div>{phone.value || '-'}</div>
                                                        <div>{phone.use || '-'}</div>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                {`
                                                    ${patient.address?.[0]?.country || '-'}/
                                                    ${patient.address?.[0]?.state || '-'}`}
                                            </TableCell>
                                            <TableCell>{patient.extension?.[0]?.valueCode || '-'}</TableCell>
                                            <TableCell>{'-'}</TableCell>
                                            <TableCell align='left'>
                                                <Stack spacing={2} direction="row">
                                                    <IconButton
                                                        sx={{ color: 'black', fontSize: '20px' }}
                                                        onClick={() => handleEditClick(patient)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleOpenDeleteConfirmation(patient.id)}
                                                        sx={{ color: 'black', fontSize: '20px' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleArrowClick(patient)}
                                                        sx={{ color: 'black', fontSize: '20px' }}
                                                    >
                                                        <ArrowRightAltIcon />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        )}

                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20]}
                    component="div"
                    count={totalPatient}
                    rowsPerPage={patientsPage}
                    page={page}
                    onPageChange={changePage}
                    onRowsPerPageChange={ChangePatients}
                    nextIconButtonProps={{
                        disabled: !nextUrl,
                    }}
                    backIconButtonProps={{
                        disabled: !prevUrl,
                    }}
                />
                <ConfirmationDialog
                    open={deleteConfirmationOpen}
                    onClose={handleCloseDeleteConfirmation}
                    onConfirm={handleConfirmDelete}
                    title={t('patient.messages.deleteTitle')}
                    message={t('patient.messages.deleteMsg')}
                />
            </Paper>

        </div>
    );
}
export default PatientList;
