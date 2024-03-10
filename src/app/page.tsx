'use client'

import { useState } from "react";

const getURL = (address: string) => `https://mempool.space/api/address/${address}`;

const getWalletData = async (event: Event, address: string) => {
  event.preventDefault(); // prevent page reaload
	try {
		const res = await fetch(getURL(address));
		const data = await res.json();
    
    const { chain_stats, mempool_stats } = data;
 
    const confirmedBalance = chain_stats.funded_txo_sum - chain_stats.spent_txo_sum;
    const unconfirmedBalance = mempool_stats.funded_txo_sum - mempool_stats.spent_txo_sum;
    const totalBalance = confirmedBalance + unconfirmedBalance;
 
    console.log(`Address: ${address}`);
    console.log(`Confirmed Balance: ${confirmedBalance} satoshis`);
    console.log(`Unconfirmed Balance: ${unconfirmedBalance} satoshis`);
    console.log(`Total Balance: ${totalBalance} satoshis`);
		return data;

	} catch (err) {
		console.log(err);
	}
};

export default function Home() {
  const [input, setInput] = useState('')
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <form className='flex'>
        <input className='bg-gray-200 shadow-inner rounded-l p-2 flex-1' id='wallet' aria-label='wallet address' placeholder='Enter the wallet address' value={input} onChange={e => setInput(e.target.value)}/>
        <button className='bg-blue-600 hover:bg-blue-700 duration-300 text-white shadow p-2 rounded-r' type='submit' onClick={(event) => getWalletData(event as any, input)}>
          Check Amount
        </button>
      </form>
    </main>
  );
}
