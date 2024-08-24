'use client'
import { Box, Button, Stack, TextField, AppBar, Toolbar, Container, Typography, Grid } from '@mui/material'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        { text: "Hi, I am a chatbot assistant, here to help you with university questions." }
      ]
    }
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    const userQuery = message
    setMessage('')
    setMessages(pastMessages => [
      ...pastMessages,
      { role: 'user', parts: [{ text: message }] }
    ])

    try {
      const history = messages.slice(1, messages.length - 1)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history: history, userQuery: userQuery }),
      })

      if (!response.ok) {
        console.log(response)
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'model', parts: [{ text: '' }] }
        ])
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setMessages((prevMessages) => {
            const history = [...prevMessages];
            history[history.length - 1] = { role: 'model', parts: [{ text: fullResponse }] };
            return history
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/000/622/344/original/beautiful-background-of-lines-with-gradients-vector.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: '#003366', width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            U-Rankly
          </Typography>
          <Button sx={{ color: 'White' }} href="/">Home</Button>
          <Button sx={{ color: 'White' }} href="/ranking">Ranking</Button>
        </Toolbar>
      </AppBar>

      <Box
        width="100vw"
        display="flex"
        color="white"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          pt: `${theme.mixins.toolbar.minHeight}px`, // Add padding top
          mt: 2, // Add some extra margin if needed
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <Stack
          direction={'column'}
          width={isMobile ? '95%' : '500px'}
          height={isMobile ? 'calc(100vh - 200px)' : '700px'}
          border="1px solid black"
          p={isMobile ? 1 : 2}
          spacing={isMobile ? 2 : 3}
          sx={{
            backgroundColor: 'white', // Add this line
            color: 'black', // Add this line to ensure text is visible
            borderRadius: '8px', // Optional: add rounded corners
          }}
        >
          <Stack
            direction={'column'}
            spacing={isMobile ? 1 : 2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'model' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'model'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color="white"
                  borderRadius={16}
                  p={isMobile ? 2 : 3}
                  maxWidth={isMobile ? '80%' : '70%'}
                >
                  {message.parts[0].text}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
            />
            <Button variant="contained" onClick={sendMessage} size={isMobile ? 'small' : 'medium'}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          backgroundColor: '#003366',
          color: 'white',
          py: isMobile ? 2 : 4,
          width: '100%',
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
