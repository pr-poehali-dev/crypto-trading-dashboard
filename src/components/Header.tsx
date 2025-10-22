import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  totalBalance: string;
  onLogout: () => void;
}

const Header = ({ totalBalance, onLogout }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">CRYPTO EXCHANGE</h1>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Баланс портфеля</div>
            <div className="text-xl font-bold">{totalBalance}</div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <Icon name="LogOut" size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
