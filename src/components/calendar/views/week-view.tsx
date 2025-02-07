import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppointments } from '@/lib/appointment-context';
import { useAppointmentState } from '../appointment-state';
import { initialTeamMembers } from '@/components/business/team-page';
import { initialServices } from '@/components/catalog/services-page';
import { initialClients } from '@/components/clients/clients-page';
import { cn } from '@/lib/utils';
import { Users, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const HOUR_HEIGHT = 80;

const statusColors = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusBackgrounds = {
  pending: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  cancelled: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

  const getClientName = (clientId: string) => {
    const client = initialClients.find(c => c.id.toString() === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Cliente no encontrado';
  };

interface PositionedAppointment {
  appointment: Appointment;
  width: number;
  left: number;
}

export function WeekView() {
  const { getFilteredAppointments, isSelectionMode, selectedAppointments, toggleAppointmentSelection } = useAppointments();
  const { setSelectedAppointment } = useAppointmentState();
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getAppointmentsForDate = (date: Date) => {
    return getFilteredAppointments().filter(appointment => 
      isSameDay(appointment.date, date)
    );
  };

  const positionAppointments = (appointments: Appointment[]): PositionedAppointment[] => {
    if (appointments.length === 0) return [];

    // Sort appointments by start time
    const sorted = [...appointments].sort((a, b) => {
      const timeA = parseInt(a.startTime.replace(':', ''));
      const timeB = parseInt(b.startTime.replace(':', ''));
      return timeA - timeB;
    });

    // Find overlapping groups
    const groups: Appointment[][] = [];
    let currentGroup: Appointment[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = sorted[i - 1];
      
      // Check if appointments overlap (same hour)
      if (current.startTime.split(':')[0] === previous.startTime.split(':')[0]) {
        currentGroup.push(current);
      } else {
        groups.push(currentGroup);
        currentGroup = [current];
      }
    }
    groups.push(currentGroup);

    // Position appointments within their groups
    return groups.flatMap(group => {
      const width = `${100 / group.length}%`;
      return group.map((appointment, index) => ({
        appointment,
        width: 100 / group.length,
        left: (100 / group.length) * index
      }));
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateAppointmentHeight = (serviceId: string) => {
    const service = initialServices.find(s => s.id === parseInt(serviceId));
    if (!service) return HOUR_HEIGHT;

    let durationMinutes = 0;
    const duration = service.duration;
    
    if (duration.includes('hr')) {
      const parts = duration.split(' ');
      if (parts[0].includes('y')) {
        const hrPart = parseInt(parts[0].replace('hr', ''));
        const minPart = parseInt(parts[2]);
        durationMinutes = hrPart * 60 + minPart;
      } else {
        const hrs = parseInt(parts[0]);
        durationMinutes = hrs * 60;
      }
    } else {
      durationMinutes = parseInt(duration);
    }
    
    return (durationMinutes / 60) * HOUR_HEIGHT;
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
        <div className="grid grid-cols-[auto_repeat(7,1fr)] text-center py-2 border-b sticky top-0 bg-background">
          <div className="pr-4"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-sm">
              <div className="font-medium">
                {format(day, 'EEEE', { locale: es })}
              </div>
              <div className="text-muted-foreground">
                {format(day, 'd MMM', { locale: es })}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[auto_repeat(7,1fr)] divide-x h-[calc(100%-5rem)] overflow-auto">
          <div className="text-sm text-muted-foreground pr-4">
            {hours.map((hour) => (
              <div key={hour} className="border-b relative" style={{ height: HOUR_HEIGHT }}>
                <span className="absolute -top-3 left-2">
                  {format(new Date().setHours(hour, 0), 'h:mm a')}
                </span>
              </div>
            ))}
          </div>

          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="relative">
              {hours.map((hour) => {
                const hourAppointments = getAppointmentsForDate(day)
                  .filter(appointment => parseInt(appointment.startTime.split(':')[0]) === hour);
                
                const positionedAppointments = positionAppointments(hourAppointments);

                return (
                  <div key={hour} className="border-b relative" style={{ height: HOUR_HEIGHT }}>
                    {positionedAppointments.map(({ appointment, width, left }) => {
                      const professional = initialTeamMembers.find(p => p.id.toString() === appointment.professional);
                      const calendarColor = professional?.calendarColor?.replace('ring-', 'bg-');
                    const clientName = getClientName(appointment.clients[0].id);
                      return (
                        <div
                          key={appointment.id}
                          className={cn(
                            "absolute rounded text-sm cursor-pointer overflow-hidden flex",
                            isSelectionMode ? (
                              selectedAppointments.includes(appointment.id)
                                ? `${calendarColor} ring-2 ring-primary`
                                : `${calendarColor}`
                            ) : (
                              calendarColor ? `${calendarColor} bg-opacity-50 hover:bg-opacity-25` : statusBackgrounds[appointment.status]
                            )
                          )}
                          style={{
                            top: `${parseInt(appointment.startTime.split(':')[1]) / 60 * 100}%`,
                            height: `${calculateAppointmentHeight(appointment.services[0].id)}px`,
                            width: `calc(${width}% - 8px)`,
                            left: `calc(${left}% + 4px)`
                          }}
                          onClick={(e) => handleAppointmentClick(appointment, e)}
                        >
                          {!isSelectionMode && <div className={cn('w-1 shrink-0', statusColors[appointment.status])} />}
                          {isSelectionMode && (
                            <div className="absolute top-1 right-1">
                              <Checkbox
                                checked={selectedAppointments.includes(appointment.id)}
                                onCheckedChange={() => toggleAppointmentSelection(appointment.id)}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </div>
                          )}
                         <div className="p-1 flex-1 text-xs">
                          <div className="flex items-center gap-1 justify-between">
                            <span>{clientName} - {formatTime(appointment.startTime)}</span>
                            {appointment.professional && <Users className="h-3 w-3" />}
                          </div>
                        </div>
                        </div>
                      );
                    })}
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