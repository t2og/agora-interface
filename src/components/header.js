import { Component } from "react";
import { Stack, Link, Button, Typography, Box } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Davatar from "@davatar/react";
import { Link as RouterLink } from "react-router-dom";

import { AppContext } from "../AppContext";

class Header extends Component {
    static contextType = AppContext;

    shortenAddress(address, length) {
        if (!length) {
            return "";
        }
        if (!address) {
            return address;
        }
        if (address.length < 10) {
            return address;
        }
        let left = Math.floor((length - 3) / 2) + 1;
        return address.substring(0, left) + "..." + address.substring(address.length - (length - (left + 3)), address.length);
    }

    render() {
        const { currentAccount, connectWallet } = this.context;
        return (
            <Stack direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ height: 100 }}
            >
                <Box>
                    <Typography variant="h4" component="h2">
                        Agora
                    </Typography>
                </Box>
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={4}>
                        <Link component={RouterLink} to="/" underline="hover">
                            {'Buy'}
                        </Link>
                        <Link component={RouterLink} to="/Sell" underline="hover">
                            {'Sell'}
                        </Link>
                        <Link href="#" underline="hover">
                            {'FAQ'}
                        </Link>
                        <Link href="#" underline="hover">
                            {'About'}
                        </Link>
                    </Stack>
                </Box>
                <Box>
                    {currentAccount ?
                        <Stack direction="row">
                            {/* <Box><Davatar size={20} address={currentAccount} provider={this.props.provider} /></Box> */}
                            <Box><Typography>{this.shortenAddress(currentAccount, 13)}</Typography></Box>
                        </Stack>
                        :
                        <Button onClick={connectWallet} variant="contained" startIcon={<AccountBalanceWalletIcon />}>
                            Connect Wallet
                        </Button>
                    }
                </Box>
            </Stack>
        )
    }
}

export default Header