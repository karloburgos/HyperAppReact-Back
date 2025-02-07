import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Pencil, Trash2, X, Sparkle, CreditCard, CircleDollarSign,  Users, AlertCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/lib/appointment-context';
import { initialClients } from '@/components/clients/clients-page';
import { initialTeamMembers } from '@/components/business/team-page';
import { initialServices } from '@/components/catalog/services-page';
import { useAppointments } from '@/lib/appointment-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { PaymentModal } from './payment-modal';

interface AppointmentOverlayProps {
  appointment: Appointment;
  position: { x: number; y: number };
  onClose: () => void;
}

const statusColors = {
  pending: 'bg-yellow-500/10 border-yellow-500 text-yellow-500',
  confirmed: 'bg-green-500/10 border-green-500 text-green-500',
  cancelled: 'bg-red-500/10 border-red-500 text-red-500',
};

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
};

export function AppointmentOverlay({ appointment, position, onClose }: AppointmentOverlayProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { deleteAppointment, addAppointment } = useAppointments();
  
  const client = initialClients.find(c => c.id.toString() === appointment.clients[0].id);
  const professional = initialTeamMembers.find(p => p.id.toString() === appointment.professional);
  const services = appointment.services.map(s => 
    initialServices.find(service => service.id === parseInt(s.id))
  );

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateEndTime = (startTime: string, duration: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let durationMinutes = 0;
    
    if (duration.includes('hr')) {
      const parts = duration.split(' ');
      if (parts[0].includes('y')) {
        const hrPart = parts[0].replace('hr', '');
        const minPart = parts[2];
        durationMinutes = parseInt(hrPart) * 60 + parseInt(minPart);
      } else {
        const hrs = parseInt(parts[0]);
        durationMinutes = hrs * 60;
      }
    } else {
      durationMinutes = parseInt(duration);
    }
    
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const calculateDeposit = () => {
    return appointment.services.reduce((total, service) => {
      if (service.deposit) {
        if (service.deposit.type === 'fixed') {
          return total + service.deposit.amount;
        } else {
          const servicePrice = services.find(s => s?.id === parseInt(service.id))?.price || 0;
          return total + (servicePrice * service.deposit.amount / 100);
        }
      }
      return total;
    }, 0);
  };

  const handleDelete = () => {
    deleteAppointment(appointment.id);
    toast.success('Cita eliminada exitosamente');
    onClose();
  };

  const handleDuplicate = () => {
    const { id, ...appointmentWithoutId } = appointment;
    addAppointment(appointmentWithoutId);
    toast.success('Cita duplicada exitosamente');
    onClose();
  };

  return (
    <>
           <div 
        className="fixed z-50 w-[400px] backdrop-blur supports-[backdrop-filter]:bg-background/75 border rounded-xl shadow-lg overflow-hidden"
        style={{ 
          top: position.y,
          left: position.x,
        }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="text-lg font-medium">
            {formatTime(appointment.startTime)} - {services[0] && formatTime(calculateEndTime(appointment.startTime, services[0].duration))}
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar cita</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleDuplicate}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicar cita</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar cita</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Client Info */}
        <div className="p-2">
          <div className="flex items-center gap-4 p-4 border rounded-xl">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client?.image} />
              <AvatarFallback>
                {client?.firstName[0]}{client?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium truncate">
                    {client?.firstName} {client?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {client?.countryCode} {client?.phone}
                  </p>
                </div>
                <Badge 
                  variant="outline"
                  className={cn("border", statusColors[appointment.status])}
                >
                  {statusLabels[appointment.status]}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor común para Services, Deposit, Extra Charge, Notes y Staff */}
        <div className="p-4 space-y-4">
          {/* Services */}
          {services.length > 0 && (
            <div>
              {services.map((service, index) => (
                service && (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{service.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {service.duration}
                      </p>
                      <p className="text-sm">${service.price}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Deposit */}
          {appointment.services.some(s => s.deposit) && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Anticipo</p>
              </div>
              <p className="text-sm">${calculateDeposit()}</p>
            </div>
          )}

          {/* Cargo extra */}
          {appointment.extraCharge && (
            <div className="flex items-center justify-between border-t pt-2">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{appointment.extraCharge.description}</p>
              </div>
              <span>${appointment.extraCharge.amount}</span>
            </div>
          )}

          {/* Profesional */}
          {professional && (
            <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
             <p className="text-sm">{professional.name}</p>
            </div>
          )}
          
          {/* Notas */}
          {appointment.notes && (
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-muted/5 border-t">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowPaymentModal(true)}
          >
            Cobrar cita
          </Button>
        </div>
      </div>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la cita
              del {format(appointment.date, "d 'de' MMMM", { locale: es })} a las {formatTime(appointment.startTime)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        appointment={appointment}
      />
    </>
  );
}