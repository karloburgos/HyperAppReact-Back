import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppointments } from '@/lib/appointment-context';
import { useAppointmentState } from '../appointment-state';
import { initialTeamMembers } from '@/components/business/team-page';
import { initialServices } from '@/components/catalog/services-page';
import { initialClients } from '@/components/clients/clients-page';
import { cn } from '@/lib/utils';
import { Users, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

  const getClientName = (clientId: string) => {
    const client = initialClients.find(c => c.id.toString() === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Cliente no encontrado';
  };

const statusBackgrounds = {
  pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

export function MonthView() {
  const { getFilteredAppointments, isSelectionMode, selectedAppointments, toggleAppointmentSelection, searchTerm } = useAppointments();
  const { setSelectedAppointment } = useAppointmentState();

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of the week of the first day (0-6, 0 = Sunday)
  const startDay = monthStart.getDay();
  
  // Add days from previous month to start from Sunday
  const daysWithPadding = Array.from({ length: startDay }).map((_, i) => {
    return addDays(monthStart, -(startDay - i));
  }).concat(days);

  // Add days from next month to complete the grid
  const remainingDays = 42 - daysWithPadding.length; // 6 rows * 7 days = 42
  const daysWithFullPadding = daysWithPadding.concat(
    Array.from({ length: remainingDays }).map((_, i) => {
      return addDays(monthEnd, i + 1);
    })
  );

  // Split days into weeks
  const weeks = Array.from({ length: 6 }).map((_, i) => {
    return daysWithFullPadding.slice(i * 7, (i + 1) * 7);
  });

  const getAppointmentsForDate = (date: Date) => {
    return getFilteredAppointments().filter(appointment => 
      isSameDay(appointment.date, date)
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleAppointmentClick = (appointment: Appointment, event: React.MouseEvent) => {
    if (isSelectionMode) {
      toggleAppointmentSelection(appointment.id);
      event.stopPropagation();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.right + 16;
    const y = rect.top;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const overlayWidth = 400;
    const overlayHeight = 500;

    const adjustedX = x + overlayWidth > windowWidth ? rect.left - overlayWidth - 16 : x;
    const adjustedY = y + overlayHeight > windowHeight ? windowHeight - overlayHeight - 16 : y;

    setSelectedAppointment({
      appointment,
      position: { x: adjustedX, y: adjustedY }
    });
    
    event.stopPropagation();
  };

  return (
    <div className="h-full p-4" onClick={() => setSelectedAppointment(null)}>
      <div className="h-full border rounded-lg bg-background">
        {/* Calendar header */}
        <div className="grid grid-cols-7 text-center py-2 border-b">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-rows-6 h-[calc(100%-2.5rem)]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 h-full">
              {week.map((day, dayIndex) => {
                const dateAppointments = getAppointmentsForDate(day);
                const isCurrentMonth = isSameMonth(day, today);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'border-r border-b p-1 overflow-hidden flex flex-col',
                      !isCurrentMonth && 'bg-muted/25'
                    )}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <span
                        className={cn(
                          'text-xs w-6 h-6 flex items-center justify-center rounded-full',
                          isCurrentDay && 'bg-primary text-primary-foreground',
                          !isCurrentMonth && 'text-muted-foreground'
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      {dateAppointments.map((appointment) => {
                        const professional = initialTeamMembers.find(p => p.id.toString() === appointment.professional);
                        const calendarColor = professional?.calendarColor?.replace('ring-', 'bg-');
                    const clientName = getClientName(appointment.clients[0].id);
                        return (
                          <div
                            key={appointment.id}
                            className={cn(
                              'text-xs px-1.5 py-0.5 rounded truncate cursor-pointer transition-colors',
                              isSelectionMode ? (
                                selectedAppointments.includes(appointment.id)
                                  ? 'ring-2 ring-primary'
                                  : ''
                              ) : (
                                calendarColor ? `${calendarColor} bg-opacity-50 hover:bg-opacity-25` : statusBackgrounds[appointment.status]
                              )
                            )}
                            onClick={(e) => handleAppointmentClick(appointment, e)}
                          >
                            {!isSelectionMode && <div className={cn('w-1 shrink-0', statusColors[appointment.status])} />}
                            <div className="flex items-center gap-1 truncate justify-between">
                              {isSelectionMode && (
                                <Checkbox
                                  checked={selectedAppointments.includes(appointment.id)}
                                  onCheckedChange={() => toggleAppointmentSelection(appointment.id)}
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary mr-1"
                                />
                              )}
                            <span>{formatTime(appointment.startTime)} - {clientName}</span>
                            {appointment.professional && <Users className="h-3 w-3" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}