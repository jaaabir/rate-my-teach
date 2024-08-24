
// export default UniversitiesPage;
'use client'
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, startAt } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path based on your project structure
import { Container, TextField, Card, CardContent, Typography, Grid, MenuItem, Select, FormControl, InputLabel, Box, Button, AppBar, Toolbar, Pagination, CircularProgress, useMediaQuery, useTheme } from '@mui/material';


const UniversitiesPage = () => {
  const [universities, setUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [sortCriterion, setSortCriterion] = useState('rank'); // Default sorting criterion
  const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order: descending
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [totalUniversities, setTotalUniversities] = useState(0); // Total number of universities in the collection

  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null); // Track the expanded accordion

  useEffect(() => {
    const fetchUniversitiesCount = async () => {
      const querySnapshot = await getDocs(collection(db, 'universities'));
      setTotalUniversities(querySnapshot.size);
    };

    fetchUniversitiesCount();
  }, []);

  const fetchUniversities = async (page = 1) => {
    const pageSize = itemsPerPage;
    const startAtIndex = (page - 1) * pageSize;

    try {
      const q = query(
        collection(db, 'universities'),
        orderBy('Rank'),
        startAt(startAtIndex),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setUniversities(data);
      filterAndSortUniversities(data);
    } catch (error) {
      console.error("Error fetching universities: ", error);
    }
  };

  useEffect(() => {
    fetchUniversities(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const totalPages = Math.ceil(totalUniversities / itemsPerPage);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      backgroundColor: 'white', // Replace with your image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',}}>
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
              <Button variant="contained"
               color="primary"
               size="medium"fullWidth onClick={() => filterAndSortUniversities(universities)} sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                mb: isMobile ? 2 : 0,
                mr: isMobile ? 0 : 2, 
                borderRadius: 7,
                position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 1,
            },
          }}>
                Apply Filters
              </Button>
            </Box>
          </Grid>

          {/* Right Column: University Grid */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
            {filteredUniversities.map((uni, index) => (
           <Grid item xs={12} sm={6} key={index}>
          <Card variant="outlined" sx={{ backgroundColor: '#003366', color: 'white' }}>
          <CardContent>
          <Typography variant="h6" component="div" sx={{ color: 'white' }}>
          {uni['Institution Name']}
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <strong>Rank:</strong> {uni.Rank}
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <strong>Location:</strong> {uni.Location}
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <strong>Overall Score:</strong> {uni.Overall}
           </Typography>
          </CardContent>
         </Card>
         </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{
          backgroundColor: '#003366',
          color: 'white',
          py: 4,
          mt: 0,
        }}
      >
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">© 2023 U-Rankly. All rights reserved.</Typography>
            </Grid>
          </Grid>
        </Container>
    </Box>
    </Box>
  );
};

export default UniversitiesPage;
