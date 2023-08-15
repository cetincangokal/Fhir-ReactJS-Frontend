import { Grid, IconButton, Typography, Box, TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPatient, updatePatient } from '../store/feature/PatientSlicer';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import SendIcon from '@mui/icons-material/Send';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { City, Country, State } from "country-state-city";


export default function Form({ id, editedPatient }) {
    const dispatch = useDispatch();
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [use, setUse] = useState('official');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [telecoms, setTelecoms] = useState([
        { system: 'phone', value: '', use: 'work', rank: 1 },
    ]);
    const [adress, setAddress] = useState('');
    const [czNo, setczNo] = useState('');
    var nationalities = require("i18n-nationality");
    const nationalitiesData = nationalities.getAlpha2Codes();
    const [nationality, setNationality] = useState('');
    let countryData = Country.getAllCountries();
    const [stateData, setStateData] = useState();
    const [cityData, setCityData] = useState();
    const [country, setCountry] = useState(countryData[0]);
    const [state, setState] = useState();
    const [city, setCity] = useState();




    useEffect(() => {
        if (editedPatient) {
            // setczNo(editedPatient.identifier?.[0]?.value || '');
            // setNationality(editedPatient.extension?.[0]?.valueCode || '');
            setGivenName(editedPatient.name?.[0]?.given?.[0] || '');
            setFamilyName(editedPatient.name?.[0]?.family || '');
            setUse(editedPatient.name?.[0]?.use || 'official');
            setGender(editedPatient.gender || '');
            setBirthDate(editedPatient.birthDate || '');
            setTelecoms(editedPatient.telecom || [
                { system: 'phone', value: '', use: 'work', rank: 1 },
            ]);
            setAddress(editedPatient.address?.[0]?.line?.[0] || '');
        }
    }, [editedPatient]);
    //#region Adress and Nationality
    useEffect(() => {
        setStateData(State.getStatesOfCountry(country?.isoCode));
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
                                code: "CZ"
                            }
                        ]
                    },
                    value: czNo,
                }
            ],
            extension: [
                {
                    url: 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
                    valueCode: nationality
                }
            ],
            name: [
                {
                    use,
                    family: familyName,
                    given: [givenName],
                },
            ],
            gender,
            birthDate,
            telecom: newTelecoms,

            address: [
                {
                    country: country?.name || '',
                    state: state?.name || '',
                    city: city || '',
                },
            ],
        };
        

        try {
            // setczNo('');
            // setNationality('');
            setGivenName('');
            setFamilyName('');
            setUse('official');
            setGender('');
            setBirthDate('');
            setTelecoms([{ system: 'phone', value: '', use: 'work', rank: 1 }]);
            setAddress('');
            if (!id) {
                dispatch(addPatient(newPatient));


            } else {
                dispatch(updatePatient(id, newPatient));
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
                {id ? 'Editing Patient' : 'Creating Patient'}
            </Typography>

            <Box height={10} />
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField
                            style={{ width: '600px' }}
                            id='outlined-basic'
                            label='Identity'
                            variant='outlined'
                            size='small'
                            type='text'
                            value={czNo}
                            onChange={(e) => setczNo(e.target.value)}

                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>Nationality</InputLabel>
                            <Select
                                value={nationality}
                                label="Nationality"
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
                            label="Name"
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
                            label="Last Name"
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
                            <MenuItem value="official">Official</MenuItem>
                            <MenuItem value="usual">Usual</MenuItem>
                            <MenuItem value="nickname">Nickname</MenuItem>
                            <MenuItem value="anonymous">Anonymous</MenuItem>
                            <MenuItem value="old">Old</MenuItem>
                        </Select>
                    </Grid>

                    <Grid container spacing={2}>
                        {telecoms.map((telecom, index) => (
                            <Grid item xs={11} style={{ marginTop: '15px' }} key={index}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <TextField
                                            id={`outlined-basic-${index}`}
                                            label="Phone Number"
                                            style={{ width: '563px', marginLeft: 15 }}

                                            variant='outlined'
                                            type="text"
                                            size='small'
                                            value={telecom.value}
                                            onChange={(e) =>
                                                handleTelecomChange(index, 'value', e.target.value)
                                            }
                                        />
                                    </div>
                                    <div style={{ marginLeft: '2px' }}>
                                        <Select
                                            value={telecom.use}
                                            size='small'
                                            onChange={(e) =>
                                                handleTelecomChange(index, 'use', e.target.value)
                                            }
                                        >
                                            <MenuItem value="home">Home</MenuItem>
                                            <MenuItem value="work">Work</MenuItem>
                                            <MenuItem value="mobile">Mobile</MenuItem>
                                            <MenuItem value="old">Old</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                                {index > 0 && (
                                    <Button
                                        type="button"
                                        size='small'
                                        variant="contained"
                                        onClick={() => handleRemoveTelecom(index)}
                                        style={{ backgroundColor: 'grey', marginLeft: '15px', marginTop: '5px' }}
                                    >
                                        <RemoveCircleIcon />
                                    </Button>
                                )}
                            </Grid>
                        ))}
                        <Grid item xs={1}>
                            <IconButton onClick={handleAddTelecom} style={{ marginTop: '15px' }}>
                                <SendIcon />
                            </IconButton>

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id='outlined-basic'
                            variant='outlined'
                            size='small'
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl size='small'>
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={gender}
                                label="Gender"
                                style={{ width: '736px' }}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <MenuItem value="unknown">Unknown</MenuItem>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl variant="outlined" size='small' style={{ width: '100%' }}>
                            <InputLabel>Country</InputLabel>
                            <Select
                                value={country || ''}
                                onChange={handleCountryChange}
                                label="Country"
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
                            <InputLabel>State</InputLabel>
                            <Select
                                value={state || ''}
                                onChange={handleStateChange}
                                label="State"
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
                            <InputLabel>City</InputLabel>
                            <Select
                                value={city || ''}
                                onChange={handleCityChange}
                                label="City"
                            >
                                {cityData && cityData.map((city) => (
                                    <MenuItem key={city.name} value={city.name}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant='h5' align='center'>
                            <Button
                                type='submit' variant="contained">
                                {id ? 'Update' : 'Save'}

                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
            </form>

            <Box sx={{ m: 4 }} />
        </>
    )
}