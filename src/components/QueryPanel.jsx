import dayjs from 'dayjs';
import { CalendarRange, Clock3, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/context/AppContext';

const QUICK_RANGES = [
  { key: '3d', label: '3天', amount: 3, unit: 'day' },
  { key: '1d', label: '1天', amount: 1, unit: 'day' },
  { key: '2h', label: '2小时', amount: 2, unit: 'hour' },
];

function toInputValue(date, time) {
  const parsed = dayjs(`${date}T${time}`);
  return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm') : '';
}

function parseInputValue(value) {
  const parsed = dayjs(value);
  if (!parsed.isValid()) {
    return null;
  }
  return {
    date: parsed.format('YYYY-MM-DD'),
    time: parsed.format('HH:mm'),
  };
}

function formatDurationLabel(fromValue, toValue) {
  const from = dayjs(fromValue);
  const to = dayjs(toValue);
  if (!from.isValid() || !to.isValid()) {
    return '--';
  }

  const totalMinutes = Math.max(0, Math.abs(to.diff(from, 'minute')));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (days) {
    parts.push(`${days}天`);
  }
  if (hours) {
    parts.push(`${hours}小时`);
  }
  if (minutes || parts.length === 0) {
    parts.push(`${minutes}分钟`);
  }

  return parts.join(' ');
}

export default function QueryPanel() {
  const {
    picking,
    showPicker,
    hidePicker,
    logoutUser,
    dateRange,
    setDateRange,
    timeFrom,
    setTimeFrom,
    timeTo,
    setTimeTo,
    fetchPointsForCurrentRange,
    isFetchingPoints,
  } = useApp();

  const today = dayjs().format('YYYY-MM-DD');
  const startDate = dateRange[0] || today;
  const endDate = dateRange[1] || startDate;
  const fromValue = toInputValue(startDate, timeFrom);
  const toValue = toInputValue(endDate, timeTo);
  const durationLabel = formatDurationLabel(fromValue, toValue);

  const onDateTimeChange = (boundary, value) => {
    const parsed = parseInputValue(value);
    if (!parsed) {
      return;
    }

    if (boundary === 'from') {
      setDateRange([parsed.date, endDate]);
      setTimeFrom(parsed.time);
      return;
    }

    setDateRange([startDate, parsed.date]);
    setTimeTo(parsed.time);
  };

  const applyQuickRange = ({ amount, unit }) => {
    const end = dayjs().second(0).millisecond(0);
    const start = end.subtract(amount, unit);
    setDateRange([start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')]);
    setTimeFrom(start.format('HH:mm'));
    setTimeTo(end.format('HH:mm'));
  };

  const query = () => {
    fetchPointsForCurrentRange()
      .then(() => {
        hidePicker();
      })
      .catch(() => {
        // errors are surfaced through global alert state
      });
  };

  if (!picking) {
    return (
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto absolute bottom-6 right-4 sm:bottom-8 sm:right-6">
          <Button size="icon" className="h-14 w-14 rounded-full shadow-panel" onClick={showPicker}>
            <CalendarRange className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-auto bg-slate-900/20"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          hidePicker();
        }
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 mx-auto w-full px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:bottom-4 sm:w-[min(96vw,620px)] sm:px-0 sm:pb-0"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Card className="rounded-t-2xl border-slate-200 shadow-2xl sm:rounded-2xl">
          <CardHeader className="space-y-3 pb-4">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4" />
              GPS Query
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>快捷范围</Label>
              <div className="flex flex-wrap gap-2">
                {QUICK_RANGES.map((rangePreset) => (
                  <Button
                    key={rangePreset.key}
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="min-w-16"
                    onClick={() => applyQuickRange(rangePreset)}
                  >
                    {rangePreset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="time-range-from">开始时间</Label>
                <Input
                  id="time-range-from"
                  type="datetime-local"
                  step={60}
                  value={fromValue}
                  onChange={(event) => onDateTimeChange('from', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-range-to">结束时间</Label>
                <Input
                  id="time-range-to"
                  type="datetime-local"
                  step={60}
                  value={toValue}
                  onChange={(event) => onDateTimeChange('to', event.target.value)}
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  时间跨度
                </span>
                <span className="font-medium text-slate-700">{durationLabel}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" className="mr-auto" onClick={logoutUser}>
              Logout
            </Button>
            <Button variant="secondary" onClick={hidePicker}>
              Cancel
            </Button>
            <Button onClick={query} disabled={isFetchingPoints}>
              {isFetchingPoints ? 'Querying...' : 'Query'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
