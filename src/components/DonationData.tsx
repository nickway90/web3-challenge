import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { donationAddress, donationBoxABI } from '../helpers/code-hints';

const DonationData = () => {
  const [totalDonations, setTotalDonations] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(donationAddress, donationBoxABI, provider);
        const total = ethers.utils.formatEther(await contract.getTotalDonations());
        setTotalDonations(total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <h2>Total Donations</h2>
      <p>{totalDonations} {'ETH'}</p>
    </div>
  );
};

export default DonationData;
