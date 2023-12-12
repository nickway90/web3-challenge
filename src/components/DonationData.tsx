import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { donationAddress, donationBoxABI } from '../helpers/code-hints'

const DonationData = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [donationInfo, setDonationInfo] = useState('')

  const fetchData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(donationAddress, donationBoxABI, provider)
      const total = ethers.utils.formatEther(await contract.getTotalDonations())
      setDonationInfo(`Total donations: ${total} ETH`)

      contract.on("DonationTransferred", async (from, amount, tx) => {
        try {
          const balance = await provider.getBalance(from)
          const formattedAmount = ethers.utils.formatEther(amount)
          const formattedBalance = ethers.utils.formatEther(balance)
          const info = `Donation received. Thank you!<br/>` +
            `   Sender address: ${from}<br/>` +
            `   Amount: ${formattedAmount} ETH<br/>` +
            `   Balance: ${formattedBalance} ETH<br/>` +
            `   Total donations: ${total} ETH<br/>` +
            `   Transaction hash: ${tx.transactionHash}`

          setDonationInfo(info)
        } catch (error) {
          setError('Error fetching data. Please try again later.')
        }
      })
      setLoading(false)
      return total
    } catch (error) {
        setError('Error fetching data. Please try again later.')
        setLoading(false)
        return null
    }
  };

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div>
      <h2>Donation Info</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p dangerouslySetInnerHTML={{ __html: donationInfo }} />
      )}
    </div>
  );
};

export default DonationData;
