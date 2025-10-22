import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Crypto } from '@/lib/cryptoData';

interface PredictionsTabProps {
  cryptos: Crypto[];
  formatNumber: (num: number) => string;
}

interface Prediction {
  cryptoId: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  targetPrice: number;
  timeframe: string;
  reasoning: string;
}

const PredictionsTab = ({ cryptos, formatNumber }: PredictionsTabProps) => {
  const predictions: Prediction[] = [
    {
      cryptoId: 'btc',
      action: 'buy',
      confidence: 78,
      targetPrice: 45200,
      timeframe: '24-48 часов',
      reasoning: 'Технический анализ показывает формирование восходящего треугольника. Объём торгов растёт, RSI в нейтральной зоне (55). Исторически после подобных паттернов Bitcoin рос на 3-5%.'
    },
    {
      cryptoId: 'eth',
      action: 'hold',
      confidence: 62,
      targetPrice: 2350,
      timeframe: '3-5 дней',
      reasoning: 'Ethereum консолидируется после недавнего падения. Ожидается обновление сети через 2 недели, что может дать импульс. Рекомендуется держать текущие позиции.'
    },
    {
      cryptoId: 'sol',
      action: 'buy',
      confidence: 85,
      targetPrice: 105,
      timeframe: '12-24 часа',
      reasoning: 'Solana показывает сильный импульс роста +5.12% за сутки. Пробит уровень сопротивления $98. Объём на 40% выше среднего. Высокая вероятность продолжения роста к $105.'
    },
    {
      cryptoId: 'xrp',
      action: 'sell',
      confidence: 71,
      targetPrice: 0.58,
      timeframe: '24-72 часа',
      reasoning: 'XRP формирует медвежий паттерн "голова и плечи". RSI в зоне перекупленности (72). Рекомендуется фиксация прибыли или сокращение позиции.'
    },
    {
      cryptoId: 'bnb',
      action: 'buy',
      confidence: 68,
      targetPrice: 325,
      timeframe: '2-4 дня',
      reasoning: 'BNB растёт на фоне увеличения активности на Binance Smart Chain. Объём DeFi-протоколов вырос на 25%. Техническая картина поддерживает рост.'
    }
  ];

  const getActionColor = (action: string) => {
    if (action === 'buy') return 'text-profit';
    if (action === 'sell') return 'text-loss';
    return 'text-muted-foreground';
  };

  const getActionBadge = (action: string) => {
    if (action === 'buy') return { text: 'Покупать', variant: 'default' as const };
    if (action === 'sell') return { text: 'Продавать', variant: 'destructive' as const };
    return { text: 'Держать', variant: 'secondary' as const };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'text-profit';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">ИИ Предсказания</h2>
        <p className="text-muted-foreground text-sm">
          Анализ рынка на основе технических индикаторов, объёмов торгов и исторических данных
        </p>
      </div>

      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" className="text-primary mt-1" size={20} />
          <div className="text-sm">
            <p className="font-semibold text-primary mb-1">Важно помнить</p>
            <p className="text-muted-foreground">
              ИИ-предсказания основаны на анализе данных, но не гарантируют прибыль. Рынок криптовалют волатилен. 
              Всегда проводите собственный анализ и не инвестируйте больше, чем можете потерять.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {predictions.map((prediction) => {
          const crypto = cryptos.find(c => c.id === prediction.cryptoId);
          if (!crypto) return null;
          
          const badge = getActionBadge(prediction.action);
          
          return (
            <div key={prediction.cryptoId} className="border border-border rounded-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="font-bold text-lg">{crypto.name}</div>
                  <Badge variant={badge.variant}>{badge.text}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Уверенность</div>
                  <div className={`text-xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}%
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Текущая цена</div>
                  <div className="font-semibold">{formatNumber(crypto.price)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Целевая цена</div>
                  <div className={`font-semibold ${getActionColor(prediction.action)}`}>
                    {formatNumber(prediction.targetPrice)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Таймфрейм</div>
                  <div className="font-semibold">{prediction.timeframe}</div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Icon name="Brain" size={14} />
                  Анализ ИИ
                </div>
                <p className="text-sm">{prediction.reasoning}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PredictionsTab;
