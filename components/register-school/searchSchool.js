'use client'
import { useState } from 'react'
import {Box, TextField} from '@mui/material';

const SearchSchool = ({handle}) => {

    const [schoolUrl, setSchoolUrl] = useState("")
    return (
        <TextField id="school-url" label="School url" variant="outlined" onChange={(e) => { setSchoolUrl(e.target.value)}}/>
    )
}

export default SearchSchool