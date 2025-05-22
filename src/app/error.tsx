"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-background text-foreground">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-3xl font-semibold mb-2 text-destructive">Something went wrong!</h2>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        We encountered an unexpected issue. Please try again. If the problem persists, contact support.
      </p>
      <p className="text-sm text-muted-foreground mb-1">Error details (for debugging):</p>
      <pre className="text-xs bg-muted p-2 rounded-md max-w-full overflow-auto mb-6">{error.message}</pre>
      <Button
        onClick={() => reset()}
        variant="destructive"
        size="lg"
      >
        Try again
      </Button>
    </div>
  );
}
