import { Component } from "react";
import { Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import SellIcon from '@mui/icons-material/Sell';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { AppContext } from "../AppContext";

class ItemInfo extends Component {
    static contextType = AppContext;

    state = {
        open: false,
        approved: false,
        price: 0,
        amount: 1,
        isValid: true,
        errorMsg: '',
        marginRate: 0,
        feeRate: 0,
        totalPay: 0,
        canApprove: true,
        canConfirm: true
    }

    checkIsApproved = () => {
        const { currentAccount, agoraContract, merchandiseContract } = this.context;
        const agoraAddress = agoraContract.options.address;
        merchandiseContract.methods.isApprovedForAll(currentAccount, agoraAddress).call().then((res) => {
            this.setState({ approved: res });
        });
    }

    isValidPrice = (price) => {
        return !(price === '' || price < 0.0001 || price > 10000);
    }

    sell = async () => {
        const {
            data
        } = this.props;
        const { currentAccount, web3, agoraContract } = this.context;
        // Calculate margin and fee 
        const { amount, price } = this.state;
        const totalPrice = amount * price;
        const marginRate = await agoraContract.methods.getMarginRate().call();
        const feeRate = await agoraContract.methods.getFeeRate().call();
        const totalPay = (totalPrice * marginRate / 10000) + (totalPrice * feeRate / 10000);
        // Commit
        const receipt = await agoraContract.methods.sell(amount.toString(), web3.utils.toWei(price.toString()), data.url)
            .send({ from: currentAccount, value: web3.utils.toWei(totalPay.toFixed(18)) });
        return receipt;
    }

    getFee = async () => {
        const { agoraContract } = this.context;
        const marginRate = await agoraContract.methods.getMarginRate().call();
        const feeRate = await agoraContract.methods.getFeeRate().call();
        this.setState({ marginRate: marginRate / 100, feeRate: feeRate / 100 });
    }
    getTotalPay = (price) => {
        const { amount, marginRate, feeRate } = this.state;
        const totalPrice = amount * price;
        const totalPay = (totalPrice * marginRate / 100) + (totalPrice * feeRate / 100);
        return totalPay.toFixed(8);
    }

    handleClickOpen = () => {
        const { currentAccount } = this.context;
        if (!currentAccount) { alert('Wallet not connected.'); return; };
        this.getFee();
        !this.state.approved && this.checkIsApproved();
        this.setState({ open: true });
    }

    handleCancel = () => {
        this.setState({ open: false });
    }

    handelApprove = () => {
        const { currentAccount, agoraContract, merchandiseContract } = this.context;
        const agoraAddress = agoraContract.options.address;
        console.log('merchandiseContract', merchandiseContract);
        merchandiseContract.methods.setApprovalForAll(agoraAddress, true).send({ from: currentAccount }).then((receipt) => {
            console.log(receipt);
            this.checkIsApproved();
        }).finally(() => {
            this.setState({ canApprove: true });
        });

        this.setState({ canApprove: false });
    }

    handelChange = (event) => {
        const price = parseFloat(event.target.value);
        this.setState({ isValid: this.isValidPrice(price) });
        this.setState({ price: price });
        this.setState({ totalPay: this.getTotalPay(price) });
    }

    handleConfirm = () => {
        if (!this.isValidPrice(this.state.price)) {
            this.setState({ isValid: false, errorMsg: "Incorrect price." })
            return;
        }
        if (parseFloat(this.state.totalPay) === 0) {
            this.setState({ isValid: false, errorMsg: "Incorrect total pay." })
            return;
        }
        // Sell
        this.sell().then((receipt) => {
            console.log(receipt);
            this.setState({ open: false });
        }).finally(() => {
            this.setState({ canConfirm: true });
        });

        this.setState({ canConfirm: false });
    }

    sellDialog() {
        const inputPriceProps = {
            step: 0.0001,
            min: 0.0001,
            max: 10000
        };
        return (
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Set selling price</DialogTitle>
                <DialogContent sx={{ width: 400, height: 200 }}>
                    <DialogContentText>
                        {"0.0001<Price<10000 ETH"}
                    </DialogContentText>
                    <Stack direction="row" alignItems="center">
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Price"
                            type="number"
                            required
                            inputProps={inputPriceProps}
                            sx={{ width: 300 }}
                            onChange={this.handelChange}
                            error={!this.state.isValid}
                            helperText={!this.state.isValid && this.state.errorMsg}
                        />
                        <Typography variant="subtitle1">
                            ETH
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography variant="subtitle2">
                            Margin:{this.state.marginRate}%
                        </Typography>
                        <Typography variant="subtitle2">
                            Fee:{this.state.feeRate}%
                        </Typography>
                        <Typography variant="subtitle2">
                            total:{this.state.totalPay} ETH
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} variant="outlined" >Cancel</Button>
                    {!this.state.approved && <Button onClick={this.handelApprove} color="info" variant="contained" disabled={!this.state.canApprove}>Approve</Button>}
                    {this.state.approved && <Button onClick={this.handleConfirm} color="success" variant="contained" disabled={!this.state.canConfirm} >Confirm</Button>}
                </DialogActions>
            </Dialog>
        )
    }

    render() {
        const {
            data
        } = this.props;

        return (
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image={data.image}
                    />
                    <CardContent sx={{ height: 280 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {data.name}
                        </Typography>
                        <Typography paragraph variant="body2" color="text.secondary">
                            {data.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="medium" color="primary" variant="contained" startIcon={<SellIcon />}
                        onClick={this.handleClickOpen}>
                        Sell
                    </Button>
                    {this.sellDialog()}
                </CardActions>
            </Card>
        )
    }
}

class Sell extends Component {
    render() {
        return (
            <Grid container spacing={2} minHeight={160} sx={{ padding: 5 }}>
                {this.props.dataList.map((data, index) => (
                    <Grid xs={2} sm={4} md={4} key={index}>
                        <ItemInfo data={data} />
                    </Grid>
                ))}
            </Grid>
        )
    }
}

export default Sell