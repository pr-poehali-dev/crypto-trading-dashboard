import { Card } from '@/components/ui/card';

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

interface PortfolioTabProps {
  balance: UserBalance;
  cryptos: Crypto[];
  formatNumber: (num: number) => string;
  totalPortfolioValue: number;
}

const PortfolioTab = ({ balance, cryptos, formatNumber, totalPortfolioValue }: PortfolioTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Мой портфель</h2>
      
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="text-sm text-muted-foreground">Общий баланс</div>
        <div className="text-3xl font-bold">{formatNumber(totalPortfolioValue)}</div>
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
  );
};

export default PortfolioTab;
