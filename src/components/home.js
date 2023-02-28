import { Component } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import { AppContext } from "../AppContext";
import Web3 from 'web3';
import AgoraContract from '../contracts/Agora.json';
import MerchandiseContract from '../contracts/Merchandise.json';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, Stack, Button, CardActionArea, CardActions } from '@mui/material';
import { shortenAddress } from "../utils";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

class Home extends Component {
    static contextType = AppContext;

    state = {
        web3: null,
        dataList: [],
        open: false,
        amount: 1,
        deliveryAddress: '',
        isValid: true,
        errorMsg: ''
    }

    getWeb3 = () => {
        const { web3 } = this.context;
        if (this.state.web3 === null) {
            return web3 !== null ? web3 : new Web3('http://localhost:8545');
        }
    }

    getContract = async (web3) => {
        const { agoraContract, merchandiseContract } = this.context;
        let _agoraContract, _merchandiseContract;
        if (agoraContract === null) {
            const networkId = await web3.eth.net.getId();
            if (!AgoraContract.networks[networkId]) {
                alert("Can't support current chain.");
                console.error("Wrong chainId");
                return;
            }
            // Agora contract
            const agoraContract = new web3.eth.Contract(
                AgoraContract.abi,
                AgoraContract.networks[networkId].address
            );
            // Merchandise contract
            const merchandiseContract = new web3.eth.Contract(
                MerchandiseContract.abi,
                MerchandiseContract.networks[networkId].address
            )
            _agoraContract = agoraContract;
            _merchandiseContract = merchandiseContract;
        } else {
            _agoraContract = agoraContract;
            _merchandiseContract = merchandiseContract;
        }
        let data = {};
        // Query events on chain
        let events = await _agoraContract.getPastEvents("allEvents");
        events.map(async (e, i) => {
            const tokenId = e.raw.topics[1];
            const seller = e.raw.topics[2];
            const url = await _merchandiseContract.methods.uri(tokenId).call();
            // Fetch detail of a item
            const response = await fetch(url);
            const itemInfo = await response.json();
            // Query selling price
            const mInfo = await _agoraContract.methods.merchandiseInfo(tokenId).call();

            data.tokenId = web3.utils.hexToNumber(tokenId);
            data.seller = shortenAddress("0x" + seller.substring(26), 13);
            data.name = itemInfo.name;
            data.image = itemInfo.image;
            data.description = itemInfo.description;
            data.attributes = itemInfo.attributes
            data.price = web3.utils.fromWei(mInfo.price);

            this.setState(prevState => ({
                dataList: [...prevState.dataList, data]
            }))
        });
    }

    componentDidMount() {
        const web3 = this.getWeb3();
        this.getContract(web3);
    }

    buy = async (tokenId, price) => {
        const { currentAccount, web3, agoraContract } = this.context;
        const shippingAddressHash = web3.utils.keccak256(this.state.deliveryAddress);
        // buy
        const receipt = await agoraContract.methods.buy(tokenId, this.state.amount, shippingAddressHash)
            .send({ from: currentAccount, value: web3.utils.toWei(price.toString()) });
        return receipt;
    }

    handleConfirm = (tokenId, price) => {
        if (this.state.deliveryAddress === "") {
            this.setState({ isValid: false, errorMsg: "The delivery address is empty." })
            return;
        }
        // Buy
        this.buy(tokenId, price).then((receipt) => {
            console.log(receipt);
            this.setState({ open: false });
        });
    }

    handleClickOpen = () => {
        const { currentAccount } = this.context;
        if (!currentAccount) { alert('Wallet not connected.'); return; };
        this.setState({ open: true });
    }

    handleCancel = () => {
        this.setState({ open: false });
    }

    handelChange = (event) => {
        const deliveryAddress = event.target.value;
        this.setState({ isValid: deliveryAddress != '' });
        this.setState({ deliveryAddress: deliveryAddress })
    }

    sellDialog(tokenId, price) {
        return (
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Enter the delivery address</DialogTitle>
                <DialogContent sx={{ width: 400, height: 200 }}>
                    <Stack>
                        <TextField
                            fullWidth
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Delivery address"
                            type="string"
                            required
                            onChange={this.handelChange}
                            error={!this.state.isValid}
                            helperText={!this.state.isValid && this.state.errorMsg}
                        />
                        <Typography variant="h6">Pay {price} ETH</Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} variant="outlined" >Cancel</Button>
                    <Button onClick={() => (this.handleConfirm(tokenId, price))} color="success" variant="contained" >Confirm</Button>
                </DialogActions>
            </Dialog>
        )
    }

    item(data) {
        return (
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="280"
                        image={data.image}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {data.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {data.price} ETH
                        </Typography>
                        {this.itemAttributes(data.attributes)}
                        <Typography variant="caption" color="text.secondary">
                            Item id:{data.tokenId}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Seller: {data.seller}
                        </Typography>

                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button fullWidth size="medium" color="primary" variant="contained" onClick={this.handleClickOpen}>
                        Buy now
                    </Button>
                    {this.sellDialog(data.tokenId, data.price)}
                </CardActions>
            </Card>
        )
    }

    itemAttributes(data) {
        return (
            <Box>
                {data.map((attr, index) => (
                    <Stack direction="row">
                        <Typography noWrap variant="subtitle2" >{attr.trait_type}: </Typography>
                        <Typography noWrap variant="subtitle2">{attr.value}</Typography>
                    </Stack>
                ))}
            </Box>
        )
    }

    render() {
        return (
            <Grid container spacing={2} minHeight={160} sx={{ padding: 5 }}>
                {
                    this.state.dataList.map((data, index) => (
                        <Grid xs={2} sm={4} md={4} key={index}>
                            {this.item(data)}
                        </Grid>
                    ))
                }
            </Grid>
        )
    }
}

export default Home