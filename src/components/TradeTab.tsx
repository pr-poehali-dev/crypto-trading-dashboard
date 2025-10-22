import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CryptoChart from '@/components/CryptoChart';

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

interface TradeTabProps {
  selectedCrypto: Crypto | null;
  tradeAmount: string;
  balance: UserBalance;
  formatNumber: (num: number) => string;
  onTradeAmountChange: (value: string) => void;
  onBuy: () => void;
  onSell: () => void;
}

const TradeTab = ({ 
  selectedCrypto, 
  tradeAmount, 
  balance, 
  formatNumber, 
  onTradeAmountChange,
  onBuy,
  onSell
}: TradeTabProps) => {
  if (!selectedCrypto) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Торговля</h2>
        <div className="text-center py-12 text-muted-foreground">
          Выберите криптовалюту на вкладке "Рынок" для начала торговли
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Торговля</h2>
      
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

        <CryptoChart data={selectedCrypto.chartData} change24h={selectedCrypto.change24h} height={256} strokeWidth={3} />

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
                onChange={(e) => onTradeAmountChange(e.target.value)}
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
              onClick={onBuy}
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
                onChange={(e) => onTradeAmountChange(e.target.value)}
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
              onClick={onSell}
              disabled={!tradeAmount || parseFloat(tradeAmount) > (balance.portfolio[selectedCrypto.id] || 0)}
            >
              Продать
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TradeTab;
