import { Component } from "react";
import { Stack, Link, Button, Typography, Box } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Davatar from "@davatar/react";
import { Link as RouterLink } from "react-router-dom";
import { shortenAddress } from "../utils";
import { AppContext } from "../AppContext";
import Chip from '@mui/material/Chip';
import Wallet from "./wallet";

class Header extends Component {
    static contextType = AppContext;

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
                        <Link component={RouterLink} to="/About" underline="hover">
                            {'FAQ'}
                        </Link>
                        <Link component={RouterLink} to="/About" underline="hover">
                            {'About'}
                        </Link>
                    </Stack>
                </Box>
                <Box>
                    {currentAccount ?
                        <Stack direction="row">
                            <Chip
                                avatar={<Davatar size={20} address={currentAccount} provider={this.props.provider} />}
                                label={shortenAddress(currentAccount, 13)}
                                variant="outlined"
                            />
                        </Stack>
                        :
                        <Wallet></Wallet>
                    }
                </Box>
            </Stack>
        )
    }
}

export default Header