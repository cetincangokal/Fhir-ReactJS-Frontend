import { useState } from 'react';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Checkbox, Divider, IconButton, InputBase, Stack, TableSortLabel, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTranslation } from 'react-i18next';

import { Country, State } from 'country-state-city';
import { useDispatch } from 'react-redux';
import { fetchPatientsData } from '../store/feature/PatientSlicer';
import AppointmentFormSecond from './AppointmentFormSecond';


const PatientListAppo = ({ patients, patientId, columns, genders, page, patientsPage, totalPatient, status, nextUrl, prevUrl, changePage, ChangePatients, handleClose }) => {
    const [order, setOrder] = useState('asc'); // Sorting order ('asc' or 'desc')
    const [orderBy, setOrderBy] = useState('id'); // Column ID to be sorted
    const [selected, setSelected] = useState([]); // Selected rows (for row selection)



    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = patients.map((patient) => patient.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, patientId) => {
        const selectedIndex = selected.indexOf(patientId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, patientId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (patientId) => selected.indexOf(patientId) !== -1;

    const dispatch = useDispatch();
    const [t, i18n] = useTranslation('global');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);

    const handleSelect = () => {
        setShowAppointmentForm(true);
    }


    const handleSearch = () => {
        dispatch(fetchPatientsData({ type: 'search', searchTerm }));
    };

    let getCountryName = (countryCode) => {
        const country = Country.getCountryByCode(countryCode);
        return country ? country.name : '-';
    };


    const getStateName = (stateCode, countryCode) => {
        const state = State.getStateByCodeAndCountry(stateCode, countryCode);
        return state ? state.name : '-';
    };

    const getGenderValueBasedOnLanguage = (gender) => {
        const genderConceptObject = genders?.concept?.filter((element) => element.code === gender)[0] || undefined;
        return (
            genderConceptObject?.designation?.filter((element1) => element1.language === i18n.language)[0]?.value ||
            genderConceptObject?.display ||
            undefined
        );
    };

    return (
        <div>
            {showAppointmentForm ? (
                <AppointmentFormSecond />
            ) : (
                <div>
                    <Typography variant='h5' align='left' >
                        {t('patient.appointmentForm.title')}
                    </Typography>
                    <Box height={10} />
                    <Divider />

                    <Box height={10} />
                    <Box height={10} />
                    <Stack direction={"row"} spacing={2}>
                        <InputBase
                            style={{ color: 'black', width: '250px', marginLeft: '10px', borderInlineColor: '#B1AFAF' }}

                            placeholder={t('patient.list.columns.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IconButton onClick={handleSearch} sx={{ color: 'black' }}>
                            <SearchIcon />
                        </IconButton>
                        <Typography variant='h6' component={'div'} sx={{ flexGrow: 1 }}></Typography>

                    </Stack>
                    <Box height={10} />
                    <TableContainer sx={{ maxHeight: 370 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selected.length > 0 && selected.length < patients.length
                                            }
                                            checked={selected.length === patients.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align="left"
                                            padding={column.disablePadding ? 'none' : 'default'}
                                            sortDirection={orderBy === column.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={orderBy === column.id ? order : 'asc'}
                                                onClick={() => handleRequestSort(column.id)}
                                            >
                                                {column.label}
                                                {orderBy === column.id ? (
                                                    <span>
                                                        {order === 'desc' ? (
                                                            <KeyboardArrowDownIcon fontSize="small" />
                                                        ) : (
                                                            <KeyboardArrowUpIcon fontSize="small" />
                                                        )}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                    <TableCell align="left"></TableCell>
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
                                                hover
                                                onClick={(event) => handleClick(event, patient.id)} // Handle row selection
                                                role="checkbox"
                                                aria-checked={isSelected(patient.id)} // Set the aria-checked attribute for accessibility
                                                tabIndex={-1}
                                                selected={isSelected(patient.id)} // Apply selected style if the row is selected
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isSelected(patient.id)}
                                                        inputProps={{ 'aria-labelledby': `row-${patient.id}-checkbox` }}
                                                    />
                                                </TableCell>

                                                <TableCell>{patient.id || '-'}</TableCell>
                                                <TableCell>{patient.identifier?.[0]?.value || '-'}</TableCell>

                                                <TableCell>
                                                    {`${patient.name?.[0]?.given?.[0] || ''} ${patient.name?.[0]?.family || ''} ${patient.name?.[0].text || ''
                                                        } `}
                                                </TableCell>

                                                <TableCell>{getGenderValueBasedOnLanguage(patient.gender) || '-'}</TableCell>
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
                                                    ${getCountryName(patient.address?.[0]?.country)}/
                                                    ${getStateName(patient.address?.[0]?.state, patient.address?.[0]?.country)}`}
                                                </TableCell>
                                                <TableCell>{patient.extension?.[0]?.valueCode || '-'}</TableCell>
                                                <TableCell>{'-'}</TableCell>
                                                <TableCell align='left'>

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

                    <Typography variant='h6' align='right'>
                        <Button onClick={handleClose} style={{ backgroundColor: "#F7FAF7", color: 'grey' }} variant="contained">
                            {t('patient.addModal.button.cancel')}
                        </Button>
                        <Button
                            style={{ marginLeft: '10px' }}
                            onClick={handleSelect}
                            type='submit' variant="contained">
                            {t('patient.appointmentForm.button.select')}

                        </Button>
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default PatientListAppo;
