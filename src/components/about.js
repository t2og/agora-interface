import { Component } from "react";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Typography, Divider } from "@mui/material";
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
                    <Typography sx={{ padding: 1, margin: 1 }} variant="body1">Agora is a blockchain-based e-commerce platform that offers a range of features for buying
                        and selling goods online. Here's a brief overview of the platform's functionality:</Typography>
                    <Typography sx={{ padding: 1, margin: 1 }}><b>Sell Goods:</b> Sellers can list their products for sale on the platform. </Typography>

                    <Typography sx={{ padding: 1, margin: 1 }}><b>Buy Goods:</b> Shoppers can browse through various stores and purchase items using cryptocurrency.</Typography>

                    <Typography sx={{ padding: 1, margin: 1 }}><b>Fill Out Shipping Info</b>: Once a seller receives an order from a buyer, they can enter the shipping details,
                        including the tracking number, to inform the buyer of the status of their shipment.
                        This allows buyers to track their orders and ensures that they receive their purchases in a timely manner. </Typography>

                    <Typography sx={{ padding: 1, margin: 1 }}><b>Confirm Receipt Infor</b>: Once the products have been received, the buyer or seller can confirm the transaction,
                        ensuring that the payment is released to the seller.</Typography>

                    <Typography sx={{ padding: 1, margin: 1 }}><b>Refunds:</b> If the seller has not shipped the product yet, the buyer can request a refund through the platform.
                        The platform's smart contract will ensure that the buyer receives a refund.</Typography>

                    <Typography sx={{ padding: 1, margin: 1 }}><b>Returns:</b>  Buyers can initiate a return through the platform if they receive a defective or incorrect product,
                        and the platform's smart contract will start the return process.</Typography>

                    <Typography sx={{ padding: 1, margin: 1 }}><b>Settle Transactions:</b> Once the buyer confirms the receipt of the products and the transaction is completed,
                        the seller can settle the payment and receive the funds in their account. The platform's smart contract
                        ensures that all transactions are processed quickly and securely.</Typography>

                    <Typography sx={{ padding: 1, margin: 1 }}>More features are currently under development to enhance the platform's functionality and provide an even better user experience.
                    </Typography>
                    <Divider />
                    <Box display="flex" justifyContent="left">
                        <Stack direction="row" alignItems="center">
                            <Typography sx={{ padding: 1, margin: 1 }} variant="button">Source code:</Typography>
                            <Chip sx={{ margin: 1 }} color="info" icon={<GitHubIcon />} label="Contract" onClick={() => { window.open("https://github.com/t2og/agora") }} />
                        </Stack>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default About