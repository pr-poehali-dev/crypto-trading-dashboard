import { Card } from '@/components/ui/card';
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

interface MarketTabProps {
  cryptos: Crypto[];
  formatNumber: (num: number) => string;
  onSelectCrypto: (crypto: Crypto) => void;
}

const MarketTab = ({ cryptos, formatNumber, onSelectCrypto }: MarketTabProps) => {
  return (
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
          onClick={() => onSelectCrypto(crypto)}
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

            <CryptoChart data={crypto.chartData} change24h={crypto.change24h} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MarketTab;
