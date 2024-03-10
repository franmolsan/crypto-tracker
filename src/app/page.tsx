'use client'

import { useState } from "react";

const getURL = (address: string) => `https://mempool.space/api/address/${address}`;

const getWalletData = async (event: any, address: string) => {
  event.preventDefault(); // prevent page reaload
	try {
		const res = await fetch(getURL(address));
		const data = await res.json();
		return data;

	} catch (err) {
		console.log(err);
	}
};

const calculateWalletBalance = (data: any, address: string): { confirmedBalance: number; unconfirmedBalance: number; totalBalance: number; } => {
  const { chain_stats, mempool_stats } = data;

  const confirmedBalance = chain_stats.funded_txo_sum - chain_stats.spent_txo_sum;
  const unconfirmedBalance = mempool_stats.funded_txo_sum - mempool_stats.spent_txo_sum;
  const totalBalance = confirmedBalance + unconfirmedBalance;

  console.log(`Address: ${address}`);
  console.log(`Confirmed Balance: ${confirmedBalance} satoshis`);
  console.log(`Unconfirmed Balance: ${unconfirmedBalance} satoshis`);
  console.log(`Total Balance: ${totalBalance} satoshis`);

  return {
    confirmedBalance,
    unconfirmedBalance,
    totalBalance  
  };
}


export default function Home() {
  const [input, setInput] = useState('')
  const [walletBalance, setWalletBalance] = useState<{ confirmedBalance: number; unconfirmedBalance: number; totalBalance: number; } | null>(null);
  const [loading, setLoading] = useState(false);

  const showWalletBalance = async(event: any, input: string) =>{
    setLoading(true);
    const walletData = await getWalletData(event as any, input);
    const walletBalance = walletData ? calculateWalletBalance(walletData, input) : null;
    setWalletBalance(walletBalance);
    setLoading(false);
  }
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <form className='flex'>
        <input className='shadow-inner rounded-l p-2 flex-1' id='wallet' aria-label='wallet address' placeholder='Enter the wallet address' value={input} onChange={e => setInput(e.target.value)}/>
        <button className='bg-blue-600 hover:bg-blue-700 duration-300 text-white shadow p-2 rounded-r' type='submit' onClick={(event) => showWalletBalance(event as any, input)}>
          Check Amount
        </button>
      </form>
      { loading && <div>Loading...</div>}
      {walletBalance && (<li className='text-2xl'>Confirmed Balance: {walletBalance.confirmedBalance} satoshis</li>)}
      {walletBalance && (<li className='text-2xl'>Unconfirmed Balance: {walletBalance.unconfirmedBalance} satoshis</li>)}
      {walletBalance && (<li className='text-2xl'>Total Balance: {walletBalance.totalBalance} satoshis</li>)}
    </main>
  );
}
