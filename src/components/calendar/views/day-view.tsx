import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAppointments } from '@/lib/appointment-context';
import { useAppointmentState } from '../appointment-state';
import { initialTeamMembers } from '@/components/business/team-page';
import { initialServices } from '@/components/catalog/services-page';
import { initialClients } from '@/components/clients/clients-page';
import { cn } from '@/lib/utils';
import { Users, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Appointment } from '@/lib/appointment-context';

const HOUR_HEIGHT = 80; // Height in pixels for one hour

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

export function DayView() {
  const { getFilteredAppointments, isSelectionMode, selectedAppointments, toggleAppointmentSelection } = useAppointments();
  const { setSelectedAppointment } = useAppointmentState();
  const today = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const todayAppointments = getFilteredAppointments().filter(appointment => 
    isSameDay(appointment.date, today)
  );

  const getClientName = (clientId: string) => {
    const client = initialClients.find(c => c.id.toString() === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Cliente no encontrado';
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
    const x = rect.right + 16; // 16px offset from the appointment
    const y = rect.top;
    
    // Adjust position if it would go off screen
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const overlayWidth = 400; // Width of the overlay
    const overlayHeight = 500; // Approximate height of the overlay

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
      <div className="h-full border rounded-lg bg-muted/10">
        {/* Day header */}
        <div className="text-center py-4 border-b sticky top-0 bg-background">
          <div className="text-lg font-medium">
            {format(today, 'EEEE d', { locale: es })}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(today, 'MMMM yyyy', { locale: es })}
          </div>
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[auto_1fr] divide-x h-[calc(100%-5rem)] overflow-auto">
          {/* Time labels */}
          <div className="text-sm text-muted-foreground pr-4">
            {hours.map((hour) => (
              <div key={hour} className="border-b relative" style={{ height: HOUR_HEIGHT }}>
                <span className="absolute -top-3 left-2">
                  {format(new Date().setHours(hour, 0), 'h:mm a')}
                </span>
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="border-b relative" style={{ height: HOUR_HEIGHT }}>
                {todayAppointments
                  .filter(appointment => parseInt(appointment.startTime.split(':')[0]) === hour)
                  .map((appointment) => {
                    const professional = initialTeamMembers.find(p => p.id.toString() === appointment.professional);
                    const calendarColor = professional?.calendarColor?.replace('ring-', 'bg-');
                    const clientName = getClientName(appointment.clients[0].id);
                    return (
                      <div
                        key={appointment.id}
                        className={cn(
                          "absolute w-[calc(100%-8px)] left-1 rounded text-sm cursor-pointer overflow-hidden flex",
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
                        <div className="p-1 truncate flex-1">
                          <div className="flex items-center gap-1 justify-between">
                            <span>{formatTime(appointment.startTime)} - {clientName}</span>
                            {appointment.professional && <Users className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}