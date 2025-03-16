import React from 'react';
import {
  createTheme,
  ThemeProvider,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Box,
  TextField,
} from '@mui/material';

const theme = createTheme({
  typography: {
    allVariants: {
      color: '#FFFFFF',
    },
  },
});

const FormSection = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    surname: '',
    phoneNumber: '',
    gender: '',
    age: '',
    smoking: '',
    anxiety: '',
    peerPressure: '',
    chronicDisease: '',
    fatigue: '',
    allergy: '',
    wheezing: '',
    alcohol: '',
    coughing: '',
    shortnessOfBreath: '',
    swallowingDifficulty: '',
    chestPain: '',
  });

  const [errors, setErrors] = React.useState({});
  const [result, setResult] = React.useState('');
  const [probability, setProbability] = React.useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.surname) newErrors.surname = 'Surname is required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    if (!formData.age || isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (0-120).';
    }
    ['smoking', 'anxiety', 'peerPressure', 'chronicDisease', 'fatigue', 'allergy', 'wheezing', 'alcohol', 'coughing', 'shortnessOfBreath', 'swallowingDifficulty', 'chestPain'].forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `Please select an option for ${field}.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const transformedData = {
        name: formData.name,
        family_name: formData.surname,
        phone: formData.phoneNumber,
        gender: formData.gender === 'Female' ? 1 : 0, // Female -> 1, Male -> 0
        age: Number(formData.age),
        smoking: formData.smoking === '1' ? 1 : 0,
        anxiety: formData.anxiety === '1' ? 1 : 0,
        peer_pressure: formData.peerPressure === '1' ? 1 : 0,
        chronic_disease: formData.chronicDisease === '1' ? 1 : 0,
        fatigue: formData.fatigue === '1' ? 1 : 0,
        allergy: formData.allergy === '1' ? 1 : 0,
        wheezing: formData.wheezing === '1' ? 1 : 0,
        alcohol: formData.alcohol === '1' ? 1 : 0,
        coughing: formData.coughing === '1' ? 1 : 0,
        shortness_of_breath: formData.shortnessOfBreath === '1' ? 1 : 0,
        swallowing_difficulty: formData.swallowingDifficulty === '1' ? 1 : 0,
        chest_pain: formData.chestPain === '1' ? 1 : 0
      };      
  
      console.log('Transformed Data:', transformedData);
  
      try {
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transformedData),
        });

        console.log('Response Status:', response.status);
        const responseData = await response.json();
        console.log('Response Data:', responseData);

        if (response.status === 200) {
          setResult(responseData.predicted_class === 1 ? 'Lung cancer: yes' : 'Lung cancer: no');
          setProbability(`Probability: ${responseData.probability_class.toFixed(2)}%`);
        } else {
          setResult('Server error: Unable to process request.');
          setProbability('');
        }
      } catch (error) {
        console.error('Error:', error);
        setResult('Error: Unable to reach the server.');
        setProbability('');
      }
    }
  };
  


  return (
    <ThemeProvider theme={theme}>
      <Box
        id="form-section"
        sx={{
          padding: '40px',
          backgroundColor: '#132D46',
          minHeight: '100vh',
        }}
      >
        <Typography fontWeight="600" fontSize="32px" textAlign="center" mb={4}>
          Enter Patient Information
        </Typography>
        <Grid container spacing={4} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              InputProps={{
                sx: { color: '#FFFFFF', backgroundColor: '#132D46' },
              }}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="surname"
              label="Surname"
              value={formData.surname}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              InputProps={{
                sx: { color: '#FFFFFF', backgroundColor: '#132D46' },
              }}
              error={!!errors.surname}
              helperText={errors.surname}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              InputProps={{
                sx: { color: '#FFFFFF', backgroundColor: '#132D46' },
              }}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel style={{ color: '#FFFFFF' }}>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                sx={{ color: '#FFFFFF' }}
              >
                <MenuItem value="Male" style={{ color: '#132D46' }}>Male</MenuItem>
                <MenuItem value="Female" style={{ color: '#132D46' }}>Female</MenuItem>
              </Select>
              {errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel style={{ color: '#FFFFFF' }}>Age</InputLabel>
              <Select
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                sx={{ color: '#FFFFFF' }}
              >
                {[...Array(121).keys()].map((age) => (
                  <MenuItem key={age} value={age} style={{ color: '#132D46' }}>
                    {age}
                  </MenuItem>
                ))}
              </Select>
              {errors.age && <FormHelperText error>{errors.age}</FormHelperText>}
            </FormControl>
          </Grid>

          {[
            { name: 'smoking', label: 'Smoking (1 = Yes, 0 = No)' },
            { name: 'anxiety', label: 'Anxiety (1 = Yes, 0 = No)' },
            { name: 'peerPressure', label: 'Peer Pressure (1 = Yes, 0 = No)' },
            { name: 'chronicDisease', label: 'Chronic Disease (1 = Yes, 0 = No)' },
            { name: 'fatigue', label: 'Fatigue (1 = Yes, 0 = No)' },
            { name: 'allergy', label: 'Allergy (1 = Yes, 0 = No)' },
            { name: 'wheezing', label: 'Wheezing (1 = Yes, 0 = No)' },
            { name: 'alcohol', label: 'Alcohol (1 = Yes, 0 = No)' },
            { name: 'coughing', label: 'Coughing (1 = Yes, 0 = No)' },
            { name: 'shortnessOfBreath', label: 'Shortness of Breath (1 = Yes, 0 = No)' },
            { name: 'swallowingDifficulty', label: 'Swallowing Difficulty (1 = Yes, 0 = No)' },
            { name: 'chestPain', label: 'Chest Pain (1 = Yes, 0 = No)' },
          ].map((field) => (
            <Grid item xs={12} md={6} key={field.name}>
              <FormControl fullWidth>
                <InputLabel style={{ color: '#FFFFFF' }}>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  sx={{ color: '#FFFFFF' }}
                >
                  <MenuItem value="0" style={{ color: '#132D46' }}>0</MenuItem>
                  <MenuItem value="1" style={{ color: '#132D46' }}>1</MenuItem>
                </Select>
                {errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
              </FormControl>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#132D46',
            }}
            onClick={handleSubmit}
          >
            Get results
          </Button>
        </Box>
        {result && (
          <Typography variant="h6" style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '20px' }}>
            {result}
          </Typography>
        )}
        {probability && (
          <Typography variant="h6" style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '10px' }}>
            {probability}
          </Typography>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default FormSection;