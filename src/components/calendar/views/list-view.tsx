import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MapPin, User2, Users } from 'lucide-react';
import { useAppointments } from '@/lib/appointment-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { initialClients } from '@/components/clients/clients-page';
import { initialTeamMembers } from '@/components/business/team-page';
import { initialServices } from '@/components/catalog/services-page';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusColors = {
  pending: 'border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  confirmed: 'border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/20',
  cancelled: 'border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20',
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
};

export function ListView() {
  const { appointments } = useAppointments();
  const today = new Date();
  
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

  const getServiceDuration = (serviceId: string) => {
    return initialServices.find(s => s.id === parseInt(serviceId))?.duration || '';
  };

  return (
    <div className="h-full p-4">
      <div className="h-full border rounded-lg bg-background">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            {format(today, "EEEE d 'de' MMMM", { locale: es })}
          </h2>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="divide-y">
            {appointments.map((appointment) => {
              const professional = initialTeamMembers.find(p => p.id.toString() === appointment.professional);
              const calendarColor = professional?.calendarColor?.replace('ring-', 'bg-');
              const clientName = getClientName(appointment.clients[0].id);
              return (
                <div key={appointment.id} className="p-4 hover:bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-normal">{clientName}</span>
                </div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatTime(appointment.startTime)}</span>
                      <span className="text-muted-foreground">
                        {getServiceDuration(appointment.services[0].id)}
                      </span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "border",
                        statusColors[appointment.status]
                      )}
                    >
                      {statusLabels[appointment.status]}
                    </Badge>
                  </div>
                  <div className="space-y-1">
<div className="flex items-center gap-2 mb-2">
                               {professional && (
            <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
             <span className="font-normal">{professional.name}</span>
            </div>
          )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-normal">Sucursal Principal</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}