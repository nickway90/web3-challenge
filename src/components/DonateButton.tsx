import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import {donationAddress, donationBoxABI} from '../helpers/code-hints'
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any; // or whatever specific type ethereum might have
  }
}

const web3 = new Web3(Web3.givenProvider);

export const DonateButton = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [contractSigner, setContractSigner] = useState<ethers.Contract | null>(null)
  const [donationAmount, setDonationAmount] = useState('')

  useEffect(() => {
    async function connectToEthereum() {
      try {
        if(window.ethereum) {
          await window.ethereum?.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const smartContract = new ethers.Contract(donationAddress, donationBoxABI, provider as ethers.providers.Provider)
          const smartContractSigner = smartContract.connect(signer)
          setContractSigner(smartContractSigner)
          setProvider(provider)
        }
      } catch (error) {
        console.error('Error connecting to Ethereum:', error)
      }
    }
    connectToEthereum()
  }, [])

  const donate = async(inputValue: string) => {
    try {
      const accounts = await web3.eth.getAccounts()
      const currentAccount = accounts[0]
      let nonce = await provider!.getTransactionCount(currentAccount)
      let gasPrice = await provider!.getGasPrice();
      let donation = ethers.utils.parseEther(inputValue)
      let overrides = {
        gasPrice: 2 * Number(gasPrice),
        gasLimit: 10 * 21000,
        value: donation,
        nonce: nonce
      };
      let tx = contractSigner!.donate(overrides);
      console.log('tx: ', tx)
    } catch(err) {
      console.log("Error: ", err.reason)
    }
  }

  const handleNumberChange = (value: React.SetStateAction<string>) => {
    setDonationAmount(value)
  }

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const inputValue = event.target.value;
    // Check if the input is a number before updating state
    if (!isNaN(inputValue) || /^\d*\.?\d*$/.test(inputValue)) {
      handleNumberChange(inputValue)
    }
  }

  return (
    <>
      <input
        className="custom-input"
        type="text"
        value={donationAmount}
        onChange={handleInputChange}
        placeholder="Enter ETH Donation"
      />
      <button className='custom-button' onClick={() => donate(donationAmount)}>
        Donate
      </button>
    </>
   
  )
}

export default DonateButton
