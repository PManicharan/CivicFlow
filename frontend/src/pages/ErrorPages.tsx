import { ShieldAlert, ServerCrash, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Error403() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center text-error mb-8">
        <ShieldAlert className="w-10 h-10" />
      </div>
      
      <h1 className="text-4xl font-semibold tracking-tight mb-4">403 - Access Denied</h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
        You do not have permission to access this resource. Please log in with an authorized account.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/workspace/login')} 
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go to Login
        </Button>
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function Error500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center text-error mb-8">
        <ServerCrash className="w-10 h-10" />
      </div>
      
      <h1 className="text-4xl font-semibold tracking-tight mb-4">500 - Server Error</h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
        An unexpected internal error has occurred. Our engineers have been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Reload Page
        </Button>
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
