import { CalendarView } from './calendar-page';
import { MonthView } from './views/month-view';
import { WeekView } from './views/week-view';
import { DayView } from './views/day-view';
import { ListView } from './views/list-view';

interface CalendarMainProps {
  view: CalendarView;
}

export function CalendarMain({ view }: CalendarMainProps) {
  switch (view) {
    case 'month':
      return <MonthView />;
    case 'week':
      return <WeekView />;
    case 'day':
      return <DayView />;
    case 'list':
      return <ListView />;
    default:
      return <MonthView />;
  }
}