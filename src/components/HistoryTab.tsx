import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Transaction } from '@/lib/cryptoData';

interface HistoryTabProps {
  transactions: Transaction[];
  formatNumber: (num: number) => string;
}

const HistoryTab = ({ transactions, formatNumber }: HistoryTabProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">История операций</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          История операций пуста. Совершите первую сделку!
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice().reverse().map((tx) => (
            <div key={tx.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'buy' ? 'bg-profit/10' : 'bg-loss/10'}`}>
                    <Icon 
                      name={tx.type === 'buy' ? 'TrendingUp' : 'TrendingDown'} 
                      className={tx.type === 'buy' ? 'text-profit' : 'text-loss'}
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <Badge variant={tx.type === 'buy' ? 'default' : 'destructive'}>
                        {tx.type === 'buy' ? 'Покупка' : 'Продажа'}
                      </Badge>
                      <span>{tx.cryptoSymbol}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">
                    {tx.amount.toFixed(8)} {tx.cryptoSymbol}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @ {formatNumber(tx.price)}
                  </div>
                  <div className={`text-sm font-semibold ${tx.type === 'buy' ? 'text-loss' : 'text-profit'}`}>
                    {tx.type === 'buy' ? '-' : '+'}{formatNumber(tx.total)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default HistoryTab;
