// app/universities/page.js
'use client'
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path based on your project structure
import { Container, TextField, Card, CardContent, Typography, Grid, MenuItem, Select, FormControl, InputLabel, Box, Button,AppBar,Toolbar} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [sortCriterion, setSortCriterion] = useState('rank'); // Default sorting criterion
  const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order: descending

  useEffect(() => {
     const fetchUniversities = async () => {
    //   try {
    //     const querySnapshot = await getDocs(collection(db, 'universities'));
    //     const data = querySnapshot.docs.map(doc => doc.data());
    //     setUniversities(data);
    //     filterAndSortUniversities(data);
    //   } catch (error) {
    //     console.error("Error fetching universities: ", error);
    //   }
    // };const fetchUniversities = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'universities'));
    const data = querySnapshot.docs.map(doc => doc.data());
    console.log("Fetched universities data:", data); // Debugging: check the fetched data
    setUniversities(data);
    filterAndSortUniversities(data);
  } catch (error) {
    console.error("Error fetching universities: ", error);
    // Optionally display a user-friendly message
    alert("Failed to fetch universities data. Please try again later.");
  }
};

    fetchUniversities();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleLocationChange = (event) => {
    setLocationQuery(event.target.value.toLowerCase());
  };

  const handleSortChange = (event) => {
    setSortCriterion(event.target.value);
    filterAndSortUniversities(filteredUniversities);
  };

  const handleOrderChange = (event) => {
    setSortOrder(event.target.value);
    filterAndSortUniversities(filteredUniversities);
  };

  const filterAndSortUniversities = (data) => {
    let filteredData = data.filter(uni =>
      uni['Institution Name'].toLowerCase().includes(searchQuery)
    );

    if (locationQuery) {
      filteredData = filteredData.filter(uni =>
        uni.Location.toLowerCase().includes(locationQuery)
      );
    }

    const sortedData = [...filteredData].sort((a, b) => {
      if (sortCriterion === 'location') {
        // Sort by location
        return sortOrder === 'asc'
          ? a.Location.localeCompare(b.Location)
          : b.Location.localeCompare(a.Location);
      }
      // Default to sorting by rank or overall
      return sortOrder === 'asc'
        ? (sortCriterion === 'rank' ? a.Rank - b.Rank : a.Overall - b.Overall)
        : (sortCriterion === 'rank' ? b.Rank - a.Rank : b.Overall - a.Overall);
    });
    setFilteredUniversities(sortedData);
  };

  useEffect(() => {
    filterAndSortUniversities(universities);
  }, [searchQuery, locationQuery, sortCriterion, sortOrder]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'White' }}>
        <AppBar position="fixed" sx={{ backgroundColor: '#003366', width: '100%' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              U-Rankly
            </Typography>
            <Button sx={{ color: 'White' }} href="/">Home</Button>
          </Toolbar>
        </AppBar>
    <Container sx={{ py: 10 }} maxWidth="lg">
      <Typography variant="h3" gutterBottom align="center">
        University Rankings
      </Typography>
      <Grid container spacing={4}>
        {/* Left Column: Filters and Sorting */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Typography variant="h5" gutterBottom>
              Filters and Sorting
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              label="Search by university name"
              value={searchQuery}
              onChange={handleSearch}
              sx={{ mb: 3 }}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Filter by location"
              value={locationQuery}
              onChange={handleLocationChange}
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortCriterion}
                onChange={handleSortChange}
                label="Sort by"
              >
                <MenuItem value="rank">Rank</MenuItem>
                <MenuItem value="overall">Overall Score</MenuItem>
                <MenuItem value="location">Location</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Sort Order</InputLabel>
              <Select
                value={sortOrder}
                onChange={handleOrderChange}
                label="Sort Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" fullWidth onClick={() => filterAndSortUniversities(universities)}>
              Apply Filters
            </Button>
          </Box>
        </Grid>

        {/* Right Column: University Grid */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {filteredUniversities.map((uni, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {uni['Institution Name']}
                    </Typography>
                    <Typography color="text.secondary">
                      <strong>Rank:</strong> {uni.Rank}
                    </Typography>
                    <Typography color="text.secondary">
                      <strong>Location:</strong> {uni.Location}
                    </Typography>
                    <Typography color="text.secondary">
                      <strong>Overall Score:</strong> {uni.Overall}
                    </Typography>

                    <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {uni.reviews && uni.reviews.length > 0 ? (
                          uni.reviews.map((review, revIndex) => (
                            <Box key={revIndex} mb={2}>
                              <Typography variant="subtitle2">{review.reviewerName}</Typography>
                              <Rating value={review.rating} readOnly />
                              <Typography variant="body2" color="textSecondary">{review.reviewText}</Typography>
                              <Typography variant="caption" color="textSecondary">{new Date(review.date).toLocaleDateString()}</Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography>No reviews yet.</Typography>
                        )}
                      </AccordionDetails>
                        </Accordion>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
    </Box>
  );
};

export default UniversitiesPage;
