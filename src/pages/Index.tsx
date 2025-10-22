import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  chartData: { time: string; price: number }[];
}

interface UserBalance {
  usd: number;
  portfolio: { [key: string]: number };
}

const initialCryptos: Crypto[] = [
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

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [balance, setBalance] = useState<UserBalance>({
    usd: 10000,
    portfolio: {}
  });
  const [cryptos] = useState<Crypto[]>(initialCryptos);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const handleBuy = () => {
    if (!selectedCrypto || !tradeAmount) return;
    const amount = parseFloat(tradeAmount);
    const totalCost = amount * selectedCrypto.price;
    
    if (totalCost > balance.usd) {
      alert('Недостаточно средств!');
      return;
    }

    setBalance({
      usd: balance.usd - totalCost,
      portfolio: {
        ...balance.portfolio,
        [selectedCrypto.id]: (balance.portfolio[selectedCrypto.id] || 0) + amount
      }
    });
    setTradeAmount('');
    setSelectedCrypto(null);
  };

  const handleSell = () => {
    if (!selectedCrypto || !tradeAmount) return;
    const amount = parseFloat(tradeAmount);
    
    if (amount > (balance.portfolio[selectedCrypto.id] || 0)) {
      alert('Недостаточно криптовалюты!');
      return;
    }

    const totalReceived = amount * selectedCrypto.price;
    
    setBalance({
      usd: balance.usd + totalReceived,
      portfolio: {
        ...balance.portfolio,
        [selectedCrypto.id]: (balance.portfolio[selectedCrypto.id] || 0) - amount
      }
    });
    setTradeAmount('');
    setSelectedCrypto(null);
  };

  const getTotalPortfolioValue = () => {
    let total = balance.usd;
    Object.keys(balance.portfolio).forEach(cryptoId => {
      const crypto = cryptos.find(c => c.id === cryptoId);
      if (crypto) {
        total += balance.portfolio[cryptoId] * crypto.price;
      }
    });
    return total;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">CRYPTO EXCHANGE</h1>
            <p className="text-muted-foreground">Обучающая платформа трейдинга</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full h-12 text-lg"
              onClick={() => setIsLoggedIn(true)}
            >
              <Icon name="LogIn" className="mr-2" size={20} />
              Войти
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-lg"
              onClick={() => setIsLoggedIn(true)}
            >
              Создать аккаунт
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">CRYPTO EXCHANGE</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Баланс портфеля</div>
              <div className="text-xl font-bold">{formatNumber(getTotalPortfolioValue())}</div>
            </div>
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="market" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="market">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Рынок
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="Briefcase" size={18} className="mr-2" />
              Портфель
            </TabsTrigger>
            <TabsTrigger value="trade">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Торговля
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-4">
            <div className="grid gap-4">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Обзор рынка</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Общая капитализация</div>
                    <div className="text-2xl font-bold">$1.68T</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">24ч объем</div>
                    <div className="text-2xl font-bold">$93.2B</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Доминация BTC</div>
                    <div className="text-2xl font-bold">50.4%</div>
                  </div>
                </div>
              </Card>

              {cryptos.map((crypto) => (
                <Card 
                  key={crypto.id} 
                  className="p-6 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelectedCrypto(crypto)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold">{crypto.name}</h3>
                          <p className="text-muted-foreground">{crypto.symbol}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatNumber(crypto.price)}</div>
                          <div className={crypto.change24h >= 0 ? 'text-profit' : 'text-loss'}>
                            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Объем 24ч</div>
                          <div className="font-semibold">{formatNumber(crypto.volume)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Капитализация</div>
                          <div className="font-semibold">{formatNumber(crypto.marketCap)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={crypto.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))' 
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke={crypto.change24h >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Мой портфель</h2>
              
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Общий баланс</div>
                <div className="text-3xl font-bold">{formatNumber(getTotalPortfolioValue())}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Свободные средства: {formatNumber(balance.usd)}
                </div>
              </div>

              <div className="space-y-3">
                {Object.keys(balance.portfolio).map(cryptoId => {
                  const crypto = cryptos.find(c => c.id === cryptoId);
                  if (!crypto || balance.portfolio[cryptoId] === 0) return null;
                  
                  const value = balance.portfolio[cryptoId] * crypto.price;
                  
                  return (
                    <div key={cryptoId} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {balance.portfolio[cryptoId].toFixed(8)} {crypto.symbol}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatNumber(value)}</div>
                          <div className="text-sm text-muted-foreground">
                            @ {formatNumber(crypto.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {Object.keys(balance.portfolio).filter(id => balance.portfolio[id] > 0).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Портфель пуст. Начните торговлю!
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trade" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Торговля</h2>
              
              {!selectedCrypto ? (
                <div className="text-center py-12 text-muted-foreground">
                  Выберите криптовалюту на вкладке "Рынок" для начала торговли
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="text-xl font-bold">{selectedCrypto.name}</h3>
                      <p className="text-muted-foreground">{selectedCrypto.symbol}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatNumber(selectedCrypto.price)}</div>
                      <div className={selectedCrypto.change24h >= 0 ? 'text-profit' : 'text-loss'}>
                        {selectedCrypto.change24h >= 0 ? '+' : ''}{selectedCrypto.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedCrypto.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))' 
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={selectedCrypto.change24h >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} 
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border border-border rounded-lg">
                      <h3 className="font-bold text-lg flex items-center">
                        <Icon name="TrendingUp" className="mr-2 text-profit" size={20} />
                        Купить {selectedCrypto.symbol}
                      </h3>
                      
                      <div>
                        <label className="text-sm text-muted-foreground">Количество</label>
                        <Input 
                          type="number" 
                          placeholder="0.00"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Доступно: {formatNumber(balance.usd)}
                      </div>
                      
                      {tradeAmount && (
                        <div className="text-sm">
                          Стоимость: {formatNumber(parseFloat(tradeAmount) * selectedCrypto.price)}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-profit hover:bg-profit/90"
                        onClick={handleBuy}
                        disabled={!tradeAmount || parseFloat(tradeAmount) * selectedCrypto.price > balance.usd}
                      >
                        Купить
                      </Button>
                    </div>

                    <div className="space-y-4 p-4 border border-border rounded-lg">
                      <h3 className="font-bold text-lg flex items-center">
                        <Icon name="TrendingDown" className="mr-2 text-loss" size={20} />
                        Продать {selectedCrypto.symbol}
                      </h3>
                      
                      <div>
                        <label className="text-sm text-muted-foreground">Количество</label>
                        <Input 
                          type="number" 
                          placeholder="0.00"
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        В наличии: {(balance.portfolio[selectedCrypto.id] || 0).toFixed(8)} {selectedCrypto.symbol}
                      </div>
                      
                      {tradeAmount && (
                        <div className="text-sm">
                          Получите: {formatNumber(parseFloat(tradeAmount) * selectedCrypto.price)}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-loss hover:bg-loss/90"
                        onClick={handleSell}
                        disabled={!tradeAmount || parseFloat(tradeAmount) > (balance.portfolio[selectedCrypto.id] || 0)}
                      >
                        Продать
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
