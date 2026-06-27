import { MapPinOff, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-8">
        <MapPinOff className="w-10 h-10" />
      </div>
      
      <h1 className="text-4xl font-semibold tracking-tight mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
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
