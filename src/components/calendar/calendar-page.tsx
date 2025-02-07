import { useState } from 'react';
import { CalendarHeader } from './calendar-header';
import { CalendarSidebar } from './calendar-sidebar';
import { CalendarMain } from './calendar-main';
import { AppointmentProvider } from './appointment-state';
import { AppointmentOverlay } from './appointment-overlay';
import { useAppointmentState } from './appointment-state';

export type CalendarView = 'month' | 'week' | 'day' | 'list';

function CalendarContent() {
  const [view, setView] = useState<CalendarView>('month');
  const { selectedAppointment, setSelectedAppointment } = useAppointmentState();

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <CalendarHeader view={view} onViewChange={setView} />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0">
          <CalendarMain view={view} />
        </div>
        <div className="w-80 border-l hidden lg:block">
          <CalendarSidebar />
        </div>
      </div>
      {selectedAppointment && (
        <AppointmentOverlay
          appointment={selectedAppointment.appointment}
          position={selectedAppointment.position}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}

const CalendarPage = () => {
  return (
    <AppointmentProvider>
      <CalendarContent />
    </AppointmentProvider>
  );
};

export default CalendarPage;

export { CalendarPage }