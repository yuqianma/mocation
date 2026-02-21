import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useApp } from '@/context/AppContext';
import QueryPanel from '@/components/QueryPanel';

function formatBoundary(value) {
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MM-DD HH:mm') : '--';
}

export default function DashboardPage() {
  const didInit = useRef(false);
  const { fetchPointsForCurrentRange, setBlur, hidePicker, range } = useApp();

  const fromLabel = formatBoundary(range[0]);
  const toLabel = formatBoundary(range[1]);

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

  return (
    <div className="pointer-events-none relative h-full w-full">
      <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 sm:top-6">
        <div className="rounded-xl border border-white/55 bg-white/35 px-4 py-2 text-xs text-slate-700 shadow-lg backdrop-blur-sm sm:px-5">
          <div className="h-1 w-44 rounded-full bg-gradient-to-r from-blue-600 via-lime-400 to-red-500 sm:w-60" />
          <div className="mt-1.5 flex items-center justify-between gap-6 font-medium">
            <span>{fromLabel}</span>
            <span>{toLabel}</span>
          </div>
        </div>
      </div>
      <QueryPanel />
    </div>
  );
}
