import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Trader {
  rank: number;
  name: string;
  profit: number;
  profitPercent: number;
  trades: number;
}

interface LeaderboardTabProps {
  formatNumber: (num: number) => string;
}

const mockTraders: Trader[] = [
  { rank: 1, name: 'CryptoKing', profit: 45230, profitPercent: 452.3, trades: 342 },
  { rank: 2, name: 'MoonTrader', profit: 38750, profitPercent: 387.5, trades: 289 },
  { rank: 3, name: 'DiamondHands', profit: 32100, profitPercent: 321.0, trades: 234 },
  { rank: 4, name: 'BTCWhale', profit: 28900, profitPercent: 289.0, trades: 198 },
  { rank: 5, name: 'EthMaster', profit: 24650, profitPercent: 246.5, trades: 176 },
  { rank: 6, name: 'AltcoinPro', profit: 21340, profitPercent: 213.4, trades: 154 },
  { rank: 7, name: 'HODLer2025', profit: 18920, profitPercent: 189.2, trades: 132 },
  { rank: 8, name: 'DayTraderX', profit: 16580, profitPercent: 165.8, trades: 521 },
  { rank: 9, name: 'SwingMaster', profit: 14230, profitPercent: 142.3, trades: 98 },
  { rank: 10, name: 'ScalpKing', profit: 12450, profitPercent: 124.5, trades: 687 }
];

const LeaderboardTab = ({ formatNumber }: LeaderboardTabProps) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Рейтинг трейдеров</h2>
      
      <div className="space-y-3">
        {mockTraders.map((trader) => (
          <div 
            key={trader.rank} 
            className={`p-4 border rounded-lg ${
              trader.rank <= 3 ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-12 text-center">
                  {getRankIcon(trader.rank)}
                </div>
                <div>
                  <div className="font-bold text-lg">{trader.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon name="ArrowLeftRight" size={14} />
                    {trader.trades} сделок
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg text-profit">
                  +{formatNumber(trader.profit)}
                </div>
                <Badge variant="outline" className="text-profit border-profit">
                  +{trader.profitPercent.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LeaderboardTab;
