import { Component } from "react";
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MuiAlert from '@mui/material/Alert';
import { AppContext } from "../AppContext";
import { Box, CircularProgress } from "@mui/material";

class Wallet extends Component {
    static contextType = AppContext;

    state = {
        open: false,
        tips: '',
        isLoading: false,
    }

    handleOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    handleByState = (isOpen, isLoading = false) => {
        this.setState({ open: isOpen, isLoading: isLoading });
    }

    setTips = (message) => {
        this.setState({ tips: message });
    }

    render() {
        const { connectWallet } = this.context;
        return (
            <Box>
                <Button onClick={this.handleOpen} variant="contained" startIcon={<AccountBalanceWalletIcon />}>
                    Connect Wallet
                </Button>
                <Dialog sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "400px",
                        },
                    },
                }} open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Connect a wallet</DialogTitle>
                    <DialogContent>
                        {!this.state.isLoading &&
                            <Stack justifyContent="space-evenly" alignItems="center">
                                {this.state.tips && <MuiAlert severity="warning">{this.state.tips}</MuiAlert>}
                                <Button variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        mb: '8px',
                                        textTransform: 'none',
                                    }}
                                    size="large" endIcon={<img
                                        src={`/icons/wallets/browserWallet.svg`}
                                        width="24px"
                                        height="24px"
                                        alt={`browser wallet icon`}
                                    />} onClick={() => { connectWallet('metamask', this.setTips) }}>Browser Wallet</Button>
                                <Button variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        mb: '8px',
                                        textTransform: 'none',
                                    }}
                                    size="large" endIcon={<img
                                        src={`/icons/wallets/coinbase.svg`}
                                        width="24px"
                                        height="24px"
                                        alt={`coinbase wallet icon`}
                                    />} onClick={() => { connectWallet('coinbase', this.setTips) }}>Coinbase Wallet</Button>
                                <Button variant="outlined"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        mb: '8px',
                                        textTransform: 'none',
                                    }}
                                    size="large" endIcon={<img
                                        src={`/icons/wallets/walletConnect.svg`}
                                        width="24px"
                                        height="24px"
                                        alt={`wallet connect icon`}
                                    />} onClick={() => { connectWallet('walletconnect', this.setTips, this.handleByState) }}>WalletConnect</Button>
                            </Stack>}
                        {this.state.isLoading &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                                <CircularProgress />
                            </Box>}
                    </DialogContent>
                </Dialog>
            </Box>
        )
    }
}

export default Wallet