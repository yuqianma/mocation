import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import QueryPanel from '@/components/QueryPanel';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const didInit = useRef(false);
  const { fetchPointsForCurrentRange, isFetchingPoints, logoutUser, setBlur, hidePicker } = useApp();

  useEffect(() => {
    hidePicker();
    setBlur(false);

    if (!didInit.current) {
      didInit.current = true;
      fetchPointsForCurrentRange().catch(() => {
        // errors are surfaced through global alert state
      });
    }
  }, [fetchPointsForCurrentRange, hidePicker, setBlur]);

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute right-6 top-6 z-20">
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-panel backdrop-blur">
          <Button
            variant="secondary"
            onClick={() => {
              fetchPointsForCurrentRange().catch(() => {
                // errors are surfaced through global alert state
              });
            }}
            disabled={isFetchingPoints}
          >
            {isFetchingPoints ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="ghost" onClick={logoutUser}>
            Logout
          </Button>
        </div>
      </div>
      <QueryPanel />
    </div>
  );
}
