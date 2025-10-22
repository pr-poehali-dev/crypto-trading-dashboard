import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CryptoChart from '@/components/CryptoChart';
import { Crypto } from '@/lib/cryptoData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ChartsTabProps {
  cryptos: Crypto[];
  formatNumber: (num: number) => string;
}

const ChartsTab = ({ cryptos, formatNumber }: ChartsTabProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>(cryptos[0]?.id || 'btc');

  const crypto = cryptos.find(c => c.id === selectedCrypto);
  
  if (!crypto) return null;

  const volumeData = crypto.chartData.map((point, idx) => ({
    time: point.time,
    volume: crypto.volume / 6 * (0.8 + Math.random() * 0.4)
  }));

  const marketCapData = crypto.chartData.map(point => ({
    time: point.time,
    marketCap: crypto.marketCap * (point.price / crypto.price)
  }));

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Детальная аналитика</h2>
        
        <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cryptos.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({c.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Цена</div>
          <div className="text-xl font-bold">{formatNumber(crypto.price)}</div>
          <div className={`text-sm ${crypto.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
          </div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Объём 24ч</div>
          <div className="text-xl font-bold">{formatNumber(crypto.volume)}</div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Капитализация</div>
          <div className="text-xl font-bold">{formatNumber(crypto.marketCap)}</div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">Макс. за 24ч</div>
          <div className="text-xl font-bold">
            {formatNumber(Math.max(...crypto.chartData.map(d => d.price)))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="price" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="price">Цена</TabsTrigger>
          <TabsTrigger value="volume">Объём</TabsTrigger>
          <TabsTrigger value="marketcap">Капитализация</TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">График цены</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={crypto.chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={crypto.change24h >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} 
                        stopOpacity={0.3}
                      />
                      <stop 
                        offset="95%" 
                        stopColor={crypto.change24h >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} 
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={crypto.change24h >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">График объёма торгов</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marketcap" className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">График капитализации</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketCapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="marketCap" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ChartsTab;
