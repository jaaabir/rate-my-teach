'use client'
import { Box, Button, Typography, AppBar, Toolbar, Container, Grid } from '@mui/material'
import {SignedOut } from "@clerk/nextjs"
import { useState } from 'react';

export default function LandingPage() {

  const [starEffect, setStarEffect] = useState(false);

  const handleMouseEnter = () => {
    setStarEffect(true);
  };

  const handleMouseLeave = () => {
    setStarEffect(false);
  };

  return (
    <Box>
      {/* Transparent AppBar */}
      <Box sx={{ position: 'absolute', width: '100%', zIndex: 1 }}>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
              U-Rankly
            </Typography>
            <SignedOut>
            <Button sx={{ color: 'White' }} href="/sign-in">Login</Button>
            <Button sx={{ color: 'White' }} href="/sign-up">Sign Up</Button>
            </SignedOut>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Main content container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/000/622/344/original/beautiful-background-of-lines-with-gradients-vector.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 4,
        }}
      >
        {/* Text and button section */}
        <Box
          sx={{
            position: 'absolute',
            backgroundColor: 'transparent',
            borderRadius: 2,
            p: 10,
            mt: 10,
            textAlign: 'center',
            width: '100vw',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Streamline Your University Search
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white' }}>
          U-Rankly - The Trusted University Ranking Platform
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            //onClick={handleStartChat}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              mt: 2,
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
            animation: starEffect ? 'starEffect 1s ease-out forwards' : 'none',
          },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
          >
            Start Chatting
          </Button>
        </Box>
      </Box>
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
  )
}
