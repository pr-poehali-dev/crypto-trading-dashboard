import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import AuthPage from '@/components/AuthPage';
import Header from '@/components/Header';
import MarketTab from '@/components/MarketTab';
import PortfolioTab from '@/components/PortfolioTab';
import TradeTab from '@/components/TradeTab';
import HistoryTab from '@/components/HistoryTab';
import LeaderboardTab from '@/components/LeaderboardTab';
import EducationTab from '@/components/EducationTab';
import PredictionsTab from '@/components/PredictionsTab';
import ChartsTab from '@/components/ChartsTab';
import { initialCryptos, Crypto, UserBalance, Transaction } from '@/lib/cryptoData';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [balance, setBalance] = useState<UserBalance>({
    usd: 10000,
    portfolio: {}
  });
  const [cryptos] = useState<Crypto[]>(initialCryptos);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'buy',
      cryptoId: selectedCrypto.id,
      cryptoSymbol: selectedCrypto.symbol,
      amount,
      price: selectedCrypto.price,
      total: totalCost,
      timestamp: Date.now()
    };

    setBalance({
      usd: balance.usd - totalCost,
      portfolio: {
        ...balance.portfolio,
        [selectedCrypto.id]: (balance.portfolio[selectedCrypto.id] || 0) + amount
      }
    });
    setTransactions([...transactions, transaction]);
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
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'sell',
      cryptoId: selectedCrypto.id,
      cryptoSymbol: selectedCrypto.symbol,
      amount,
      price: selectedCrypto.price,
      total: totalReceived,
      timestamp: Date.now()
    };

    setBalance({
      usd: balance.usd + totalReceived,
      portfolio: {
        ...balance.portfolio,
        [selectedCrypto.id]: (balance.portfolio[selectedCrypto.id] || 0) - amount
      }
    });
    setTransactions([...transactions, transaction]);
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
    return <AuthPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen">
      <Header 
        totalBalance={formatNumber(getTotalPortfolioValue())} 
        onLogout={() => setIsLoggedIn(false)} 
      />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="market" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="market">
                <Icon name="TrendingUp" size={18} className="mr-2" />
                Рынок
              </TabsTrigger>
              <TabsTrigger value="trade">
                <Icon name="ArrowLeftRight" size={18} className="mr-2" />
                Торговля
              </TabsTrigger>
              <TabsTrigger value="portfolio">
                <Icon name="Briefcase" size={18} className="mr-2" />
                Портфель
              </TabsTrigger>
              <TabsTrigger value="charts">
                <Icon name="BarChart3" size={18} className="mr-2" />
                Графики
              </TabsTrigger>
              <TabsTrigger value="history">
                <Icon name="History" size={18} className="mr-2" />
                История
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                <Icon name="Trophy" size={18} className="mr-2" />
                Рейтинг
              </TabsTrigger>
              <TabsTrigger value="education">
                <Icon name="BookOpen" size={18} className="mr-2" />
                Обучение
              </TabsTrigger>
              <TabsTrigger value="predictions">
                <Icon name="Sparkles" size={18} className="mr-2" />
                Предсказания
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="market">
            <MarketTab 
              cryptos={cryptos}
              formatNumber={formatNumber}
              onSelectCrypto={setSelectedCrypto}
            />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioTab 
              balance={balance}
              cryptos={cryptos}
              formatNumber={formatNumber}
              totalPortfolioValue={getTotalPortfolioValue()}
            />
          </TabsContent>

          <TabsContent value="trade">
            <TradeTab 
              selectedCrypto={selectedCrypto}
              tradeAmount={tradeAmount}
              balance={balance}
              formatNumber={formatNumber}
              onTradeAmountChange={setTradeAmount}
              onBuy={handleBuy}
              onSell={handleSell}
            />
          </TabsContent>

          <TabsContent value="charts">
            <ChartsTab cryptos={cryptos} formatNumber={formatNumber} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab transactions={transactions} formatNumber={formatNumber} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardTab formatNumber={formatNumber} />
          </TabsContent>

          <TabsContent value="education">
            <EducationTab />
          </TabsContent>

          <TabsContent value="predictions">
            <PredictionsTab cryptos={cryptos} formatNumber={formatNumber} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;