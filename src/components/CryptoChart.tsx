import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string;
  price: number;
}

interface CryptoChartProps {
  data: ChartData[];
  change24h: number;
  height?: number;
  strokeWidth?: number;
}

const CryptoChart = ({ data, change24h, height = 128, strokeWidth = 2 }: CryptoChartProps) => {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
            stroke={change24h >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} 
            strokeWidth={strokeWidth}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;
