import React, { useEffect, useState } from 'react'
import { ethers } from "ethers"
import {donationAddress, donationBoxABI} from '../helpers/code-hints'
import Web3 from 'web3'

declare global {
  interface Window {
    ethereum?: any
  }
}

const web3 = new Web3(Web3.givenProvider)

export const DonateButton = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [contractSigner, setContractSigner] = useState<ethers.Contract>()
  const [donationAmount, setDonationAmount] = useState('')
  const [buttonState, setButtonState] = useState('Donate')
  const [initialized, setInitialized] = useState(false)

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
          setProvider(provider);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error connecting to Ethereum:', error)
      }
    }
    connectToEthereum()
  }, [])

  const donate = async(inputValue: string) => {
    try {
      if (!initialized || !provider || !contractSigner) {
        console.log('Provider or contract not initialized')
      }
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
      let tx = await contractSigner!.donate(overrides)
      if (tx && tx.hash) {
        setButtonState('Donating ...')
        await tx.wait()
        setButtonState('Donate')
      }
      console.log('Transaction confirmed: ', tx)
    } catch(err) {
        console.log("Error: ", err)
        setButtonState('Donate')
    }
  }

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const inputValue = event.target.value
    // Check if the input is a number before updating state
    if (!isNaN(inputValue) || /^\d*\.?\d*$/.test(inputValue)) {
      setDonationAmount(inputValue)
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
        {buttonState}
      </button>
    </>
   
  )
}

export default DonateButton
