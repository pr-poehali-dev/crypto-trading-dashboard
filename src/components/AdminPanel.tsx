import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Crypto, UserBalance } from '@/lib/cryptoData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AdminUser {
  id: string;
  name: string;
  balance: number;
  totalValue: number;
  joined: string;
}

interface AdminPanelProps {
  cryptos: Crypto[];
  balance: UserBalance;
  formatNumber: (num: number) => string;
  onUpdateCrypto: (cryptoId: string, updates: Partial<Crypto>) => void;
  onUpdateBalance: (usd: number) => void;
  onClose: () => void;
}

const AdminPanel = ({ 
  cryptos, 
  balance, 
  formatNumber, 
  onUpdateCrypto, 
  onUpdateBalance,
  onClose 
}: AdminPanelProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>(cryptos[0]?.id || 'btc');
  const [newPrice, setNewPrice] = useState('');
  const [newChange, setNewChange] = useState('');
  const [newVolume, setNewVolume] = useState('');
  const [newBalance, setNewBalance] = useState('');
  
  const mockUsers: AdminUser[] = [
    { id: '1', name: 'CryptoKing', balance: 15420, totalValue: 45230, joined: '2024-01-15' },
    { id: '2', name: 'MoonTrader', balance: 8750, totalValue: 38750, joined: '2024-02-03' },
    { id: '3', name: 'DiamondHands', balance: 12100, totalValue: 32100, joined: '2024-01-28' },
    { id: '4', name: 'Вы (Текущий)', balance: balance.usd, totalValue: balance.usd, joined: '2024-03-10' }
  ];

  const crypto = cryptos.find(c => c.id === selectedCrypto);

  const handleUpdatePrice = () => {
    if (!crypto || !newPrice) return;
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      alert('Введите корректную цену');
      return;
    }
    onUpdateCrypto(selectedCrypto, { price });
    setNewPrice('');
  };

  const handleUpdateChange = () => {
    if (!crypto || !newChange) return;
    const change24h = parseFloat(newChange);
    if (isNaN(change24h)) {
      alert('Введите корректное изменение');
      return;
    }
    onUpdateCrypto(selectedCrypto, { change24h });
    setNewChange('');
  };

  const handleUpdateVolume = () => {
    if (!crypto || !newVolume) return;
    const volume = parseFloat(newVolume);
    if (isNaN(volume) || volume <= 0) {
      alert('Введите корректный объём');
      return;
    }
    onUpdateCrypto(selectedCrypto, { volume });
    setNewVolume('');
  };

  const handleUpdateUserBalance = () => {
    if (!newBalance) return;
    const usd = parseFloat(newBalance);
    if (isNaN(usd) || usd < 0) {
      alert('Введите корректный баланс');
      return;
    }
    onUpdateBalance(usd);
    setNewBalance('');
  };

  const handleQuickChange = (percent: number) => {
    if (!crypto) return;
    const newPrice = crypto.price * (1 + percent / 100);
    onUpdateCrypto(selectedCrypto, { 
      price: newPrice,
      change24h: percent 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Icon name="ShieldAlert" className="text-destructive" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Панель администратора</h2>
              <p className="text-sm text-muted-foreground">Управление платформой</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <Tabs defaultValue="crypto" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto">
              <Icon name="Bitcoin" size={18} className="mr-2" />
              Криптовалюты
            </TabsTrigger>
            <TabsTrigger value="users">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <Label>Выберите криптовалюту</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="mt-2">
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

            {crypto && (
              <>
                <Card className="p-4 bg-muted/30">
                  <h3 className="font-bold mb-3">Текущие значения {crypto.symbol}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Цена</div>
                      <div className="font-bold">{formatNumber(crypto.price)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Изменение 24ч</div>
                      <div className={`font-bold ${crypto.change24h >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Объём</div>
                      <div className="font-bold">{formatNumber(crypto.volume)}</div>
                    </div>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <Label className="mb-2 block">Изменить цену</Label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="number"
                        placeholder={`Текущая: ${crypto.price}`}
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        step="0.01"
                      />
                      <Button onClick={handleUpdatePrice}>
                        <Icon name="Check" size={18} />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Быстрое изменение</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-loss border-loss/50 hover:bg-loss/10"
                          onClick={() => handleQuickChange(-10)}
                        >
                          -10%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-loss border-loss/50 hover:bg-loss/10"
                          onClick={() => handleQuickChange(-5)}
                        >
                          -5%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-profit border-profit/50 hover:bg-profit/10"
                          onClick={() => handleQuickChange(5)}
                        >
                          +5%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-profit border-profit/50 hover:bg-profit/10"
                          onClick={() => handleQuickChange(10)}
                        >
                          +10%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-profit border-profit/50 hover:bg-profit/10"
                          onClick={() => handleQuickChange(25)}
                        >
                          +25%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-profit border-profit/50 hover:bg-profit/10"
                          onClick={() => handleQuickChange(50)}
                        >
                          +50%
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <Label className="mb-2 block">Изменить % изменения</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`Текущее: ${crypto.change24h}%`}
                        value={newChange}
                        onChange={(e) => setNewChange(e.target.value)}
                        step="0.01"
                      />
                      <Button onClick={handleUpdateChange}>
                        <Icon name="Check" size={18} />
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 md:col-span-2">
                    <Label className="mb-2 block">Изменить объём торгов</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`Текущий: ${crypto.volume}`}
                        value={newVolume}
                        onChange={(e) => setNewVolume(e.target.value)}
                        step="1000000"
                      />
                      <Button onClick={handleUpdateVolume}>
                        <Icon name="Check" size={18} />
                      </Button>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="p-4">
              <h3 className="font-bold mb-4">Список пользователей</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Свободный баланс</TableHead>
                    <TableHead>Общая стоимость</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {user.name}
                          {user.name.includes('Текущий') && (
                            <Badge variant="secondary">Это вы</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(user.balance)}</TableCell>
                      <TableCell className="text-profit font-semibold">
                        {formatNumber(user.totalValue)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-4">
              <h3 className="font-bold mb-4">Управление вашим балансом</h3>
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Текущий баланс</div>
                  <div className="text-2xl font-bold">{formatNumber(balance.usd)}</div>
                </div>

                <div>
                  <Label className="mb-2 block">Установить новый баланс</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Введите сумму"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      step="100"
                    />
                    <Button onClick={handleUpdateUserBalance}>
                      Применить
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateBalance(1000)}
                  >
                    $1,000
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateBalance(10000)}
                  >
                    $10,000
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateBalance(100000)}
                  >
                    $100,000
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onUpdateBalance(1000000)}
                  >
                    $1,000,000
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminPanel;
