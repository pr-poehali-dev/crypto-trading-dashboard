export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  chartData: { time: string; price: number }[];
}

export interface UserBalance {
  usd: number;
  portfolio: { [key: string]: number };
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  cryptoId: string;
  cryptoSymbol: string;
  amount: number;
  price: number;
  total: number;
  timestamp: number;
}

export const initialCryptos: Crypto[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43250.50,
    change24h: 2.45,
    volume: 28400000000,
    marketCap: 847000000000,
    chartData: [
      { time: '00:00', price: 42300 },
      { time: '04:00', price: 42800 },
      { time: '08:00', price: 42500 },
      { time: '12:00', price: 43100 },
      { time: '16:00', price: 43000 },
      { time: '20:00', price: 43250 }
    ]
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2280.75,
    change24h: -1.23,
    volume: 14200000000,
    marketCap: 274000000000,
    chartData: [
      { time: '00:00', price: 2310 },
      { time: '04:00', price: 2295 },
      { time: '08:00', price: 2285 },
      { time: '12:00', price: 2275 },
      { time: '16:00', price: 2290 },
      { time: '20:00', price: 2280 }
    ]
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    price: 1.00,
    change24h: 0.01,
    volume: 45000000000,
    marketCap: 91000000000,
    chartData: [
      { time: '00:00', price: 1.00 },
      { time: '04:00', price: 1.00 },
      { time: '08:00', price: 1.00 },
      { time: '12:00', price: 1.00 },
      { time: '16:00', price: 1.00 },
      { time: '20:00', price: 1.00 }
    ]
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    price: 315.20,
    change24h: 3.67,
    volume: 1200000000,
    marketCap: 47000000000,
    chartData: [
      { time: '00:00', price: 304 },
      { time: '04:00', price: 308 },
      { time: '08:00', price: 310 },
      { time: '12:00', price: 312 },
      { time: '16:00', price: 314 },
      { time: '20:00', price: 315 }
    ]
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    price: 98.45,
    change24h: 5.12,
    volume: 2800000000,
    marketCap: 42000000000,
    chartData: [
      { time: '00:00', price: 93.6 },
      { time: '04:00', price: 95.2 },
      { time: '08:00', price: 96.8 },
      { time: '12:00', price: 97.5 },
      { time: '16:00', price: 98.1 },
      { time: '20:00', price: 98.45 }
    ]
  },
  {
    id: 'xrp',
    name: 'Ripple',
    symbol: 'XRP',
    price: 0.62,
    change24h: -2.15,
    volume: 1500000000,
    marketCap: 33000000000,
    chartData: [
      { time: '00:00', price: 0.634 },
      { time: '04:00', price: 0.628 },
      { time: '08:00', price: 0.625 },
      { time: '12:00', price: 0.622 },
      { time: '16:00', price: 0.621 },
      { time: '20:00', price: 0.62 }
    ]
  }
];