import { CalendarRange, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/context/AppContext';

function hourToLabel(hour) {
  return `${String(hour).padStart(2, '0')}:00`;
}

function TickScale() {
  return (
    <div className="mt-2 grid grid-cols-5 text-xs text-slate-500">
      <span>00</span>
      <span className="text-center">06</span>
      <span className="text-center">12</span>
      <span className="text-center">18</span>
      <span className="text-right">24</span>
    </div>
  );
}

export default function QueryPanel() {
  const {
    picking,
    showPicker,
    hidePicker,
    dateRange,
    setDateRange,
    timeFrom,
    setTimeFrom,
    timeTo,
    setTimeTo,
    fetchPointsForCurrentRange,
    isFetchingPoints,
  } = useApp();

  const fromHour = Number(timeFrom.split(':')[0] || 0);
  const toHour = Number(timeTo.split(':')[0] || 0);

  const startDate = dateRange[0] || '';
  const endDate = dateRange[1] || dateRange[0] || '';

  const onDateChange = (index, value) => {
    const nextRange = [startDate, endDate];
    nextRange[index] = value;
    setDateRange(nextRange);
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
        <div className="pointer-events-auto absolute bottom-8 right-6">
          <Button size="icon" className="h-14 w-14 rounded-full shadow-panel" onClick={showPicker}>
            <CalendarRange className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-auto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          hidePicker();
        }
      }}
    >
      <div
        className="absolute left-1/2 top-4 w-[min(96vw,520px)] -translate-x-1/2"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4" />
              GPS Query
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date-from">Date From</Label>
                <Input id="date-from" type="date" value={startDate} onChange={(event) => onDateChange(0, event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">Date To</Label>
                <Input id="date-to" type="date" value={endDate} onChange={(event) => onDateChange(1, event.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time-from">Time From</Label>
                <span className="text-sm text-slate-500">{hourToLabel(fromHour)}</span>
              </div>
              <Slider
                id="time-from"
                min={0}
                max={24}
                step={1}
                value={[fromHour]}
                onValueChange={([value]) => setTimeFrom(value)}
              />
              <TickScale />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="time-to">Time To</Label>
                <span className="text-sm text-slate-500">{hourToLabel(toHour)}</span>
              </div>
              <Slider id="time-to" min={0} max={24} step={1} value={[toHour]} onValueChange={([value]) => setTimeTo(value)} />
              <TickScale />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
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
