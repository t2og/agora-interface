import { Component } from "react";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Typography, Divider, Fab } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import { Stack } from "@mui/system";

class About extends Component {

    render() {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                        m: 1,
                    },
                    bgcolor: '#e7ebf0',
                }}
            >
                <Box>
                    <Typography display="flex" justifyContent="center" sx={{ padding: 2 }} variant="h5">About Agora</Typography>
                    <Divider />
                    <Typography sx={{ padding: 1, margin: 1 }} variant="body1">Agora is a cutting-edge blockchain-based e-commerce platform,
                        where secure and transparent transactions meet innovative and user-friendly features. Our platform harnesses
                        the power of distributed ledger technology to revolutionize the way e-commerce operates, creating a more secure
                        and trustworthy environment for buyers and sellers alike.</Typography>
                    <Typography sx={{ padding: 1, margin: 1 }} variant="body1">With our blockchain platform, you can enjoy unparalleled security and transparency in your online
                        transactions. Each transaction is recorded on a tamper-proof ledger that is immutable, making fraud and hacking
                        virtually impossible. Plus, our user-friendly interface makes it easy for anyone to buy and sell products
                        with ease.</Typography>
                    <Typography sx={{ padding: 1, margin: 1 }}>Our platform also offers a range of innovative features to enhance your e-commerce experience.
                        From smart contracts that automate transactions and enforce the terms of a deal, to decentralized marketplaces
                        that connect buyers and sellers directly, our platform is designed to empower you in every aspect of your online
                        transactions.</Typography>
                    <Typography sx={{ padding: 1, margin: 1 }}>Join our blockchain e-commerce platform today and experience the future of
                        online transactions. With our advanced technology and user-friendly features, you'll enjoy a seamless and secure
                        e-commerce experience that is unmatched in the industry.</Typography>
                    <Divider />
                    <Box display="flex" justifyContent="left">
                        <Stack direction="row" alignItems="center">
                            <Typography sx={{ padding: 1, margin: 1 }} variant="button">Source code:</Typography>
                            <Chip sx={{ margin: 1 }} color="info" icon={<GitHubIcon />} label="Contract" onClick={() => { window.open("https://github.com/njxieyt/agora") }} />
                            <Chip sx={{ margin: 1 }} color="info" icon={<GitHubIcon />} label="Interface" onClick={() => { window.open("https://github.com/njxieyt/agora-interface") }} />
                        </Stack>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default About