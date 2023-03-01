import { Component } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography, Divider, Fab } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import Chip from '@mui/material/Chip';
import { WindowSharp } from "@mui/icons-material";

class Source extends Component {

    render() {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                        m: 1,
                        height: 128,
                    },
                    bgcolor: '#e7ebf0',
                }}
            >
                <Box>
                    <Typography sx={{ padding: 2 }} variant="h5">Source code</Typography>
                    <Chip sx={{ margin: 1 }} color="info" icon={<GitHubIcon />} label="Contract" onClick={() => { window.open("https://github.com/njxieyt/agora") }} />
                    <Chip sx={{ margin: 1 }} color="info" icon={<GitHubIcon />} label="Interface" onClick={() => { window.open("https://github.com/njxieyt/agora-interface") }} />
                </Box>
            </Box >
        )
    }
}

export default Source