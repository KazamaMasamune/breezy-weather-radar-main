
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, InfoIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiKey, saveApiKey } from '@/services/weatherApi';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyFormProps {
  onApiKeySet: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    const savedApiKey = getApiKey();
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    saveApiKey(apiKey.trim());
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
    onApiKeySet();
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('openweather_api_key');
    toast({
      title: "API key cleared",
      description: "Your API key has been removed from this device",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenWeatherMap API Key</CardTitle>
        <CardDescription>
          Enter your API key to fetch weather data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription className="text-sm">
                You need a free API key from OpenWeatherMap to use this app.
                Your key will be stored locally on your device only.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </label>
              <Input
                id="apiKey"
                type="text"
                placeholder="Enter your OpenWeatherMap API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Don't have an API key?{' '}
                <a 
                  href="https://home.openweathermap.org/users/sign_up" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline inline-flex items-center"
                >
                  Sign up here <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </p>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClear}
                disabled={!apiKey}
              >
                Clear
              </Button>
              <Button 
                type="submit"
                disabled={!apiKey.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-xs text-muted-foreground">
          Note: After signing up, it may take a few hours for your API key to be activated.
          The API key is stored only in your browser's local storage.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyForm;
