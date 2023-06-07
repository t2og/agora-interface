export const GOERLI = 5;
export const TESTNET = 1676904320055;
export const USE_NETWORK = GOERLI;

export const RPC_PROVIDERS = {
    [TESTNET]: "http://localhost:8545",
    [GOERLI]: process.env.REACT_APP_PROVIDER_API_KEY
}