'use client'

import { useState } from "react";

type err = {
  message: string
}

type Balances = {
  confirmedBalance: number;
  unconfirmedBalance: number;
  totalBalance: number;
};

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

const calculateWalletBalance = (data: any, address: string): Balances => {
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
  const [walletBalance, setWalletBalance] = useState<Balances | null>(null);
  const [error, setError] = useState<err | null>(null);
  const [loading, setLoading] = useState(false);

  const showWalletBalance = async(event: any, input: string) =>{
    setWalletBalance(null);
    setLoading(true);
    setError(null);

    const walletData = await getWalletData(event as any, input);
    const err = walletData ? null : { message: 'Invalid wallet address'};
    setError(err);

    const walletBalance = err ? null: calculateWalletBalance(walletData, input);
    setWalletBalance(walletBalance);
    setLoading(false);
  }
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
    <form className='flex'>
        <input className='shadow-inner text-black rounded-l p-2 flex-1' id='wallet' aria-label='wallet address' placeholder='Enter the BTC wallet address' value={input} onChange={e => setInput(e.target.value)}/>
        <button className='bg-blue-600 hover:bg-blue-700 duration-300 text-white shadow p-2 rounded-r' type='submit' onClick={(event) => showWalletBalance(event as any, input)}>
          Check BTC Amount
        </button>
    </form>
      { loading && <div className="justify-end pt-10">Loading...</div>}
      { error && <div className="justify-end pt-10">{`❌ ${error.message}`}</div>}
      {walletBalance && 
      (<div className="justify-end pt-10">
        <li className='list-disc'>Confirmed Balance: {walletBalance.confirmedBalance} BTC</li> 
        <li className='list-disc'>Unconfirmed Balance: {walletBalance.unconfirmedBalance} BTC</li> 
        <li className='list-disc'>Total Balance: {walletBalance.totalBalance} BTC</li> 
      </div>)}
    </main>
  );
}
