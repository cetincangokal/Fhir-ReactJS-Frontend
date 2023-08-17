import { Grid, IconButton, Typography, Box, TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPatient, updatePatient } from '../store/feature/PatientSlicer';
import SendIcon from '@mui/icons-material/Send';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { City, Country, State } from "country-state-city";
import { useTranslation } from 'react-i18next';

export default function Form({ id, editedPatient, handleClose }) {
    const dispatch = useDispatch();
    const [t, i18n] = useTranslation('global');
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [use, setUse] = useState('official');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [telecoms, setTelecoms] = useState([
        { system: 'phone', value: '', use: 'work', rank: 1 },
    ]);
    const [czNo, setczNo] = useState('');
    var nationalities = require("i18n-nationality");
    const nationalitiesData = nationalities.getAlpha2Codes();
    const [nationality, setNationality] = useState('');
    const countryData = Country.getAllCountries();
    const [stateData, setStateData] = useState();
    const [cityData, setCityData] = useState();
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [birthDateWarning, setBirthDateWarning] = useState(false);





    useEffect(() => {
        if (editedPatient) {
            setczNo(editedPatient.identifier?.[0]?.value || '');
            setNationality(editedPatient.extension?.[0]?.valueCode || '');
            setGivenName(editedPatient.name?.[0]?.given?.[0] || '');
            setFamilyName(editedPatient.name?.[0]?.family || '');
            setUse(editedPatient.name?.[0]?.use || 'official');
            setGender(editedPatient.gender || '');
            setBirthDate(editedPatient.birthDate || '');
            setTelecoms(editedPatient.telecom || [
                { system: 'phone', value: '', use: 'work', rank: 1 },
            ]);
            setCountry(editedPatient.address?.[0]?.country || null);
            setState(editedPatient.address?.[0]?.state || null);
            setCity(editedPatient.address?.[0]?.city || null);
            console.log(editedPatient);

        }
    }, [editedPatient]);
    //#region Adress and Nationality


    useEffect(() => {
        if (country) {
            setStateData(State.getStatesOfCountry(country.isoCode));
        }
    }, [country]);

    useEffect(() => {
        setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    }, [state]);

    useEffect(() => {
        stateData && setState(stateData[0]);
    }, [stateData]);

    useEffect(() => {
        cityData && setCity(cityData[0]);
    }, [cityData]);



    const handleCountryChange = (e) => {
        const selectedCountry = e.target.value;
        setCountry(selectedCountry);
        setStateData(State.getStatesOfCountry(selectedCountry?.isoCode));
    };

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setState(selectedState);
        setCityData(City.getCitiesOfState(country?.isoCode, selectedState?.isoCode));
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    //#endregion

    const handleBirthDateChange = (e) => {
        const selectedDate = e.target.value;
        setBirthDate(selectedDate);

        const currentDate = new Date();
        const selectedDateObj = new Date(selectedDate);
        const maxAllowedDate = new Date();
        maxAllowedDate.setFullYear(currentDate.getFullYear() - 100);

        if (maxAllowedDate > selectedDateObj) {
            setBirthDateWarning(true);
        } else {
            setBirthDateWarning(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTelecoms = telecoms.map((telecom) => ({
            system: 'phone',
            value: telecom.value,
            use: telecom.use,
        }));

        const newPatient = {
            resourceType: 'Patient',
            identifier: [
                {
                    use: "usual",
                    type: {
                        coding: [
                            {
                                system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                                code: "CZ",
                            }
                        ]
                    },
                    value: czNo,
                }
            ],
            extension: [
                {
                    url: 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
                    valueCode: nationality,
                }
            ],
            name: [
                {
                    use,
                    family: familyName,
                    given: [givenName],
                }
            ],
            gender,
            birthDate,

            telecom: newTelecoms,
            address: [
                {
                    country: country?.name,
                    state: state?.name,
                    city: city?.name,
                }
            ],
        };


        try {
            setczNo('');
            setNationality('');
            setGivenName('');
            setFamilyName('');
            setUse('official');
            setGender('');
            setBirthDate('');
            setTelecoms([{ system: 'phone', value: '', use: 'work', rank: 1 }]);
            setCountry('');
            setState('');
            setCity('');
            if (!id) {
                dispatch(addPatient(newPatient));

            } else {
                dispatch(updatePatient({ id, patientData: newPatient }));
                handleClose();

            }


        } catch (error) {
            console.error('Error creating patient:', error);
        }
    };

    const handleAddTelecom = () => {
        setTelecoms((prevTelecoms) => [
            ...prevTelecoms,
            { system: 'phone', value: '', use: 'work', rank: prevTelecoms.length + 1 },
        ]);
    };

    const handleRemoveTelecom = (index) => {
        setTelecoms((prevTelecoms) =>
            prevTelecoms.filter((telecom, i) => i !== index)
        );
    };

    const handleTelecomChange = (index, field, value) => {
        setTelecoms((prevTelecoms) =>
            prevTelecoms.map((telecom, i) =>
                i === index ? { ...telecom, [field]: value } : telecom
            )
        );
    };


    return (
        <>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant='h5' align='left'>
                {id ? t('patient.addModal.title.update') : t('patient.addModal.title.create')}
            </Typography>

            <Box height={10} />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <TextField
                            style={{ width: '535px' }}
                            id='outlined-basic'
                            label={t('patient.list.columns.identity')}
                            variant='outlined'
                            size='small'
                            type='text'
                            value={czNo}
                            onChange={(e) => setczNo(e.target.value)}

                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.list.columns.nationality')}</InputLabel>
                            <Select
                                value={nationality}
                                label={t('patient.list.columns.nationality')}
                                onChange={(e) => setNationality(e.target.value)}

                            >
                                {Object.keys(nationalitiesData).map((nationalityKey) => (
                                    <MenuItem key={nationalityKey} value={nationalityKey}>
                                        {nationalityKey}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={5}>

                        <TextField
                            style={{ width: '286px' }}
                            id='outlined-basic'
                            label={t('patient.list.columns.givenName')}
                            variant='outlined'
                            size='small'
                            type="text"
                            value={givenName}
                            onChange={(e) => setGivenName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            style={{ width: '286px' }}
                            id='outlined-basic'
                            label={t('patient.list.columns.familyName')}
                            variant='outlined'
                            size='small'
                            type="text"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}

                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Select value={use} style={{ width: '109px' }}
                            onChange={(e) => setUse(e.target.value)} size="small">
                            <MenuItem value="official">{t('patient.list.columns.official')}</MenuItem>
                            <MenuItem value="usual">{t('patient.list.columns.usual')}</MenuItem>
                            <MenuItem value="nickname">{t('patient.list.columns.nickname')}</MenuItem>
                            <MenuItem value="anonymous">{t('patient.list.columns.anonymous')}</MenuItem>
                            <MenuItem value="old">{t('patient.list.columns.old')}</MenuItem>
                        </Select>
                    </Grid>

                    <Grid container spacing={2}>

                        {telecoms.map((telecom, index) => (
                            <Grid item xs={9} style={{ marginTop: '15px' }} key={index}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            id={`outlined-basic-${index}`}
                                            label={t('patient.list.columns.phoneNumber')}
                                            style={{ width: '580px', marginLeft: 15 }}

                                            variant='outlined'
                                            type="text"
                                            size='small'
                                            value={telecom.value}
                                            onChange={(e) =>
                                                handleTelecomChange(index, 'value', e.target.value)
                                            }
                                        />
                                    </div>
                                    <div style={{ marginLeft: '30px' }}>
                                        <Select
                                            value={telecom.use}
                                            size='small'
                                            onChange={(e) =>
                                                handleTelecomChange(index, 'use', e.target.value)
                                            }
                                        >
                                            <MenuItem value="home">{t('patient.list.columns.home')}</MenuItem>
                                            <MenuItem value="work">{t('patient.list.columns.work')}</MenuItem>
                                            <MenuItem value="mobile">{t('patient.list.columns.mobile')}</MenuItem>
                                            <MenuItem value="old">{t('patient.list.columns.old')}</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                                {index > 0 && (
                                    <Typography align='right'>
                                        <IconButton
                                            type="button"
                                            size='small'
                                            variant="contained"
                                            onClick={() => handleRemoveTelecom(index)}
                                            style={{ marginLeft: '15px', marginTop: '5px' }}
                                        >
                                            <RemoveCircleIcon style={{ color: '#1565c0' }} />
                                        </IconButton>
                                    </Typography>
                                )}
                            </Grid>
                        ))}
                        <Grid item xs={1}>
                            <IconButton onClick={handleAddTelecom} style={{ marginTop: '15px', marginLeft: '135px' }}>
                                <SendIcon style={{ color: '#1565c0' }} />
                            </IconButton>

                        </Grid>
                    </Grid>

                    <Grid item xs={8}>
                        <FormControl size='small'>
                            <InputLabel id="demo-simple-select-label">{t('patient.list.columns.gender')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={gender}
                                label={t('patient.list.columns.gender')}
                                style={{ width: '500px' }}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <MenuItem value="unknown">{t('patient.list.columns.Unknown')}</MenuItem>
                                <MenuItem value="male">{t('patient.list.columns.male')}</MenuItem>
                                <MenuItem value="female">{t('patient.list.columns.female')}</MenuItem>
                                <MenuItem value="other">{t('patient.list.columns.other')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            style={{ width: '210px', marginLeft: '25px' }}
                            id='outlined-basic'
                            variant='outlined'
                            size='small'
                            type="date"
                            value={birthDate}
                            onChange={handleBirthDateChange}
                            required
                            error={birthDateWarning}
                            helperText={birthDateWarning && t('patient.messages.birthdayMsg')}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.addModal.formIndex.country')}</InputLabel>
                            <Select
                                value={country || ''}
                                onChange={handleCountryChange}
                                label={t('patient.addModal.formIndex.country')}
                            >
                                {countryData.map((country) => (
                                    <MenuItem key={country.isoCode} value={country}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.addModal.formIndex.state')}</InputLabel>
                            <Select
                                value={state || ''}
                                onChange={handleStateChange}
                                label={t('patient.addModal.formIndex.state')}
                            >
                                {stateData && stateData.map((state) => (
                                    <MenuItem key={state.isoCode} value={state}>
                                        {state.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>{t('patient.addModal.formIndex.city')}</InputLabel>
                            <Select
                                value={city || ''}
                                onChange={handleCityChange}
                                label={t('patient.addModal.formIndex.city')}
                            >
                                {cityData && cityData.map((city) => (
                                    <MenuItem key={city.name} value={city}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='h5' align='right'>
                            <Button onClick={handleClose} style={{ backgroundColor: "#F7FAF7", color: 'grey' }} variant="contained">
                                {t('patient.addModal.button.cancel')}
                            </Button>
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant='h5' align='right'>
                            <Button
                                type='submit' variant="contained">
                                {id ? t('patient.addModal.button.updtButton') : t('patient.addModal.button.saveButton')}

                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
            </form>

            <Box sx={{ m: 4 }} />
        </>
    )
}
//multi lang
//status ve randevu eklenecek
//aynı kimlikten başka insan olamaz kimlik regexi koy
