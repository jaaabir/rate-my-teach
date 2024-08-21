'use client'
import { SignIn } from "@clerk/nextjs";
import { AppBar, Container, Toolbar,Button, Box, Typography, Grid } from "@mui/material";
import Link from "next/link";


export default function SignInPage() {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'White' }}>
        <AppBar position="fixed" sx={{ backgroundColor: '#003366', width: '100%' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              U-Rankly
            </Typography>
            <Button sx={{ color: 'White' }} href="/">Home</Button>
            <Button sx={{ color: 'White' }} href="/sign-up">Sign Up</Button>
          </Toolbar>
        </AppBar>
        <Container
          sx={{
            flexGrow: 1,
            pt: 8, // Adjust padding-top to account for the fixed AppBar
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Sign In
          </Typography>
          <SignIn routing="hash" />
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
  }