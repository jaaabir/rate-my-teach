'use client'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

export default function Home() {
    const [messages, setMessages] = useState([
        {
          role: "model",
          parts: [
            {text: "Hi, Iam a chatbot assistant, here to help you with university questions."}
          ]
        }
      ])
      const [message, setMessage] = useState('')

      const sendMessage = async () => {
        
        const userQuery = message
        setMessage('')
        setMessages(pastMessages => [
          ...pastMessages,
          {role: 'user', parts: [{text: message}]}
        ])

        try {
          const history = messages.slice(1, messages.length - 1)
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ history : history, userQuery: userQuery }),
            })
          
          const data = await response.json()
          setMessages((pastMessages) => [
            ...pastMessages,
            {role: 'model', parts: [{text: data.bot_response}]}
          ])
        } catch (err) {
          console.log(err)
        }
      }

      return (
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction={'column'}
            width="500px"
            height="700px"
            border="1px solid black"
            p={2}
            spacing={3}
          >
            <Stack
              direction={'column'}
              spacing={2}
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
                    p={3}
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
              />
              <Button variant="contained" onClick={sendMessage}>
                Send
              </Button>
            </Stack>
          </Stack>
        </Box>
      )
   
  }




  // .then(async (res) => {
  //   const reader = res.body.getReader()
  //   const decoder = new TextDecoder()
  //   let result = ''

  //   return reader.read().then(function processText({done, value}) {
  //     if (done) {
  //       return result
  //     }
  //     const text = decoder.decode(value || new Uint8Array(), {stream: true})
  //     setMessages((messages) => {
  //       let lastMessage = messages[messages.length - 1]
  //       let otherMessages = messages.slice(0, messages.length - 1)
  //       return [
  //         ...otherMessages,
  //         {...lastMessage, content: lastMessage.content + text},
  //       ]
  //     })
  //     return reader.read().then(processText)
  //   })
  // })