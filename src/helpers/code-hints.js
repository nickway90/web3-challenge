// The following code fragments may be useful, however the only
// information here that cannot be obtained elsewhere is the Ethereum
// Sepolia testnet smart contract address:
//
// https://sepolia.etherscan.io/address/0x2642381fdf335501897a31d0f96de374b4d8d237#code

import { ethers } from "ethers";

export const donationAddress = "0x2642381fdf335501897a31d0f96de374b4d8d237";

// Copied from the Ethereum smart contract donationAddress.
export const donationBoxABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DonationTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalDonations",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
export const provider = new ethers.providers.Web3Provider(window.ethereum)

// The Metamask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
export const signer = provider.getSigner()

// Read access to the smart contract
export const contract = new ethers.Contract(donationAddress, donationBoxABI, provider);

// Transaction submission for the smart contract
export const contractSigner = contract.connect(signer);

/* This is an example comitted transaction.

{
  "blockNumber": 5514853,
  "blockHash": "0x1af60907dc14f781bed0351c5147df62901e6d9cd538019e69e1aeb166aa8f5f",
  "transactionIndex": 0,
  "removed": false,
  "address": "0x2642381fdf335501897a31d0f96de374b4d8d237",
  "data": "0x00000000000000000000000082da443039fcb3b0f8e513da06d3c7b54cdf4949000000000000000000000000000000000000000000000000006a94d74f430000",
  "topics": [
    "0x787d3106cde7aa4ddd5abe23c8dbddf7ca8c84e95940d4a580aa0343d824dedf"
  ],
  "transactionHash": "0x4d88d7eb9a09697041c039fb7f6c2cf80679e6b66b7676fe9c5637f09b18d520",
  "logIndex": 0,
  "event": "DonationTransferred",
  "eventSignature": "DonationTransferred(address,uint256)",
  "args": [
    "0x82DA443039fCB3b0F8E513Da06D3C7b54CdF4949",
    {
      "type": "BigNumber",
      "hex": "0x6a94d74f430000"
    }
  ]
}
*/
/*
// Event handler for successful donation
contract.on("DonationTransferred", async (from, amount, tx) => {
    let balance = ethers.utils.formatEther(await provider.getBalance(from));
    let total = ethers.utils.formatEther(await contract.getTotalDonations());
    const status = document.getElementById("status");
    status.innerHTML = 
        `Donation received. Thank you!<br/>`
        + `   Sender address: ${from}<br/>`
        + `   Amount: ${ethers.utils.formatEther(amount)} ETH<br/>`
        + `   Balance: ${balance} ETH<br/>`
        + `   Total donations: ${total} ETH<br/>`
        + `   Transaction hash: ${tx.transactionHash}`;
});*/

/*
onSubmit={async (values, { setSubmitting }) => {
    try {
        let nonce = await provider.getTransactionCount(values.sendingAddress);
        let gasPrice = await provider.getGasPrice();
        let donationAmount = ethers.utils.parseEther(values.donationAmount);

        let overrides = {
            gasPrice: 2 * gasPrice,
            gasLimit: 10 * 21000,
            value: donationAmount,
            nonce: nonce
        };
        let tx = contractSigner.donate(overrides);
    }
    catch(err) {
        console.log(err.reason);
    }
} */
