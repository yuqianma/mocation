import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useApp } from '@/context/AppContext';
import QueryPanel from '@/components/QueryPanel';

export default function DashboardPage() {
  const didInit = useRef(false);
  const { fetchPointsForCurrentRange, setBlur, hidePicker, range } = useApp();

  useEffect(() => {
    hidePicker();
    setBlur(false);

    if (!didInit.current) {
      didInit.current = true;
      fetchPointsForCurrentRange().catch(() => {
        // errors are surfaced through global alert state
      });
    }
    // run only on first mount; range changes should not auto-close panel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fromLabel = dayjs(range[0]).format('MM-DD HH:mm');
  const toLabel = dayjs(range[1]).format('MM-DD HH:mm');

  return (
    <div className="pointer-events-none relative h-full w-full">
      <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center gap-1 text-xs text-slate-800/90">
          <div className="h-1 w-44 rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-lime-400 via-yellow-400 to-red-500" />
          <div className="flex w-full justify-between">
            <span>{fromLabel}</span>
            <span>{toLabel}</span>
          </div>
        </div>
      </div>
      <QueryPanel />
    </div>
  );
}
