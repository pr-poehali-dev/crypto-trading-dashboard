import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">CRYPTO EXCHANGE</h1>
          <p className="text-muted-foreground">Обучающая платформа трейдинга</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full h-12 text-lg"
            onClick={onLogin}
          >
            <Icon name="LogIn" className="mr-2" size={20} />
            Войти
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 text-lg"
            onClick={onLogin}
          >
            Создать аккаунт
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
