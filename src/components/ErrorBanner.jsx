import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

function stringifyError(error) {
  if (!error) {
    return '';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object') {
    return error.error || error.message || JSON.stringify(error);
  }
  return String(error);
}

export default function ErrorBanner() {
  const { errorMsg, clearError } = useApp();

  if (!errorMsg) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-1/2 top-3 z-30 w-full max-w-2xl -translate-x-1/2 px-3">
      <Alert variant="destructive" className="pointer-events-auto flex items-start justify-between gap-2">
        <div>
          <AlertTitle>Request Error</AlertTitle>
          <AlertDescription>{stringifyError(errorMsg)}</AlertDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={clearError} className="text-red-800 hover:text-red-900">
          Dismiss
        </Button>
      </Alert>
    </div>
  );
}
