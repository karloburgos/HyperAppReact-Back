import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, ChevronsUpDown, Check, CirclePlus, Clock, MoreHorizontal, Plus, UserRound, UserRoundPlus, Users, UserRoundX, Sparkle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { initialClients } from '../clients/clients-page';
import { initialServices } from '../catalog/services-page';
import { initialTeamMembers } from '../business/team-page';
import { useAppointments } from '@/lib/appointment-context';
import { NewClientDrawer } from '../clients/new-client-drawer';

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AppointmentFormData {
  date: Date;
  startTime: string;
  endTime: string;
  professional: string;
  clients: {
    id: string;
    isGuest?: boolean;
  }[];
  guestName?: string;
  services: {
    id: string;
    deposit?: {
      type: 'fixed' | 'percentage';
      amount: number;
    };
  }[];
  notes?: string;
  extraCharge?: {
    description: string;
    amount: number;
  };
}

export default function NewAppointmentModal({ open, onOpenChange }: NewAppointmentModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: new Date(),
    startTime: format(new Date(), 'HH:mm'),
    professional: '',
    endTime: '',
    clients: [],
    services: [],
    notes: '',
    extraCharge: {
      description: '',
      amount: 0
    }
  });

  const [openClientCombobox, setOpenClientCombobox] = useState(false);
  const [openServiceCombobox, setOpenServiceCombobox] = useState(false);
  const [showExtraChargeInput, setShowExtraChargeInput] = useState(false);
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [showNewClientDrawer, setShowNewClientDrawer] = useState(false);
  const [showGuestPopover, setShowGuestPopover] = useState(false);
  const { addAppointment } = useAppointments();

  const handleInputChange = (field: keyof Omit<AppointmentFormData, 'clients' | 'services'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddClient = (clientId: string, isGuest: boolean = false) => {
    setFormData(prev => ({
      ...prev,
      clients: [...prev.clients, { id: clientId, isGuest }]
    }));
  };

  const handleRemoveClient = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      clients: prev.clients.filter(client => client.id !== clientId)
    }));
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

  const handleAddService = (serviceId: string) => {
    const service = initialServices.find(s => s.id === parseInt(serviceId));
    if (service) {
      const endTime = calculateEndTime(formData.startTime, service.duration);
      setFormData(prev => ({
        ...prev,
        endTime,
        services: [...prev.services, {
          id: serviceId,
          deposit: service.deposit.required ? {
            type: service.deposit.type,
            amount: service.deposit.amount
          } : undefined
        }]
      }));
    }
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleStartTimeChange = (time: string) => {
    const endTime = formData.services[0] 
      ? calculateEndTime(time, initialServices.find(s => s.id === parseInt(formData.services[0].id))?.duration || '')
      : '';

    setFormData(prev => ({
      ...prev,
      startTime: time,
      endTime
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.date) {
      toast.error('La fecha es obligatoria');
      return false;
    }
    if (!formData.startTime) {
      toast.error('La hora de inicio es obligatoria');
      return false;
    }
    if (formData.clients.length === 0) {
      toast.error('Debes seleccionar un cliente');
      return false;
    }
    if (formData.services.length === 0) {
      toast.error('Debes seleccionar al menos un servicio');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      addAppointment({
        date: formData.date,
        startTime: formData.startTime,
        professional: formData.professional,
        clients: formData.clients,
        services: formData.services,
        notes: formData.notes,
        extraCharge: formData.extraCharge,
      });

      toast.success('Cita agendada exitosamente');
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al agendar la cita');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 h-full">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 border-b">
            <SheetHeader>
              <SheetTitle>Nueva Cita</SheetTitle>
            </SheetHeader>
          </div>

          <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Información de cita</TabsTrigger>
                <TabsTrigger value="details">Detalles de cita</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">
              <TabsContent value="info" className="space-y-6 mt-4 pb-6">

{/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    Fecha
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {formData.date ? (
                          format(formData.date, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && handleInputChange('date', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Hora de inicio
                    </Label>
                    <div className="relative">
                      <Input
                        min="00:00"
                        max="23:59"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    {formData.endTime && (
                      <div className="text-sm text-muted-foreground">
                        Finaliza a las {formData.endTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Client Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-muted-foreground" />
                      Cliente
                    </Label>
                  </div>

                  <Popover open={openClientCombobox} onOpenChange={setOpenClientCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClientCombobox}
                        className={cn(
                          "w-full justify-between",
                          formData.clients.length > 0 && "hidden"
                        )}
                      >
                        Seleccionar cliente
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandList>
                          <CommandEmpty>
                            <div className="p-4 text-center">
                              <p className="text-sm text-muted-foreground mb-2">
                                No se encontraron clientes
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setOpenClientCombobox(false);
                                  setShowNewClientDrawer(true);
                                }}
                              >
                                <UserRoundPlus className="h-4 w-4 mr-2" />
                                Crear nuevo cliente
                              </Button>
                            </div>
                          </CommandEmpty>
                          <CommandGroup>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-flex justify-start m-2"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, clients: [] }));
                                setOpenClientCombobox(false);
                              }}
                            >
                              <UserRoundX className="h-4 w-4 mr-2" />
                              Sin cliente
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-flex justify-start mx-2 mb-2"
                              onClick={() => {
                                setOpenClientCombobox(false);
                                setShowNewClientDrawer(true);
                              }}
                            >
                              <UserRoundPlus className="h-4 w-4 mr-2" />
                              Crear nuevo cliente
                            </Button>
                            {initialClients.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={client.id.toString()}
                                onSelect={(currentValue) => {
                                  handleAddClient(currentValue);
                                  setOpenClientCombobox(false);
                                }}
                              >
                                <div className="flex items-center flex-1 justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={client.image} />
                                      <AvatarFallback className="text-xs">
                                        {client.firstName[0]}{client.lastName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{client.firstName} {client.lastName}</span>
                                  </div>
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      formData.clients.some(c => c.id === client.id.toString()) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Selected Clients */}
                  {formData.clients.length > 0 && (
                    <div className="space-y-2">
                      {formData.clients.map((selectedClient) => {
                        const client = initialClients.find(c => c.id.toString() === selectedClient.id);
                        if (!client) return null;
                        return (
                          <div key={client.id} className="flex items-center justify-between p-2 border rounded-lg">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={client.image} />
                                <AvatarFallback className="text-xs">
                                  {client.firstName[0]}{client.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{client.firstName} {client.lastName}</span>
                                  {selectedClient.isGuest && (
                                    <span className="text-xs text-muted-foreground">Invitado</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveClient(client.id.toString())}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Guest Button and Popover */}
                  {formData.clients.length > 0 && (
                    <Popover open={showGuestPopover} onOpenChange={setShowGuestPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full mt-2 text-sm"
                        >
                          <CirclePlus className="h-4 w-4 mr-2" />
                          Agregar invitado
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>
                              <div className="p-4 text-center">
                                <p className="text-sm text-muted-foreground mb-2">
                                  No se encontraron clientes
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setShowGuestPopover(false);
                                    setShowNewClientDrawer(true);
                                  }}
                                >
                                  <UserRoundPlus className="h-4 w-4 mr-2" />
                                  Crear nuevo cliente
                                </Button>
                              </div>
                            </CommandEmpty>
                            <CommandGroup>
                              {initialClients
                                .filter(client => !formData.clients.some(c => c.id === client.id.toString()))
                                .map((client) => (
                                  <CommandItem
                                    key={client.id}
                                    value={client.id.toString()}
                                    onSelect={(currentValue) => {
                                      handleAddClient(currentValue, true);
                                      setShowGuestPopover(false);
                                    }}
                                  >
                                    <div className="flex items-center flex-1 justify-between">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={client.image} />
                                          <AvatarFallback className="text-xs">
                                            {client.firstName[0]}{client.lastName[0]}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span>{client.firstName} {client.lastName}</span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "h-4 w-4",
                                          formData.clients.some(c => c.id === client.id.toString()) ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                {/* Professional Selection */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Profesional
                  </Label>
                  <Select
                    value={formData.professional}
                    onValueChange={(value) => handleInputChange('professional', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {initialTeamMembers
                        .filter(member => member.type === 'professional' && member.status === 'active')
                        .map((professional) => (
                          <SelectItem key={professional.id} value={professional.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Avatar className={`h-6 w-6 ${professional.calendarColor}`}>
                                <AvatarImage src={professional.image} />
                                <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span>{professional.name}</span>
                            </div>
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Services */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Sparkle className="h-4 w-4 text-muted-foreground" />
                      Servicios o paquetes
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {formData.services.map((service, index) => {
                      const serviceDetails = initialServices.find(s => s.id === parseInt(service.id));
                      return serviceDetails ? (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{serviceDetails.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{serviceDetails.duration}</span>
                              <span>${serviceDetails.price}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveService(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : null;
                    })}

                    <Popover open={openServiceCombobox} onOpenChange={setOpenServiceCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openServiceCombobox}
                          className="w-full justify-between"
                        >
                          <span>Seleccionar una opción</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={4}>
                        <Command>
                          <CommandInput placeholder="Buscar servicio..." />
                          <CommandList>
                            <CommandEmpty>No se encontraron servicios.</CommandEmpty>
                            <CommandGroup>
                              {initialServices
                                .filter(service => !formData.services.some(s => s.id === service.id.toString()))
                                .map((service) => (
                                  <CommandItem
                                    key={service.id}
                                    value={service.id.toString()}
                                    onSelect={(currentValue) => {
                                      handleAddService(currentValue);
                                      setOpenServiceCombobox(false);
                                    }}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium">{service.name}</p>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{service.duration}</span>
                                        <span>${service.price}</span>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Deposit */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Anticipo</Label>
                    <Switch
                      checked={formData.services.some(s => s.deposit)}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          services: prev.services.map(service => {
                            const serviceDetails = initialServices.find(s => s.id === parseInt(service.id));
                            return {
                              ...service,
                              deposit: checked && serviceDetails?.deposit.required ? {
                                type: serviceDetails.deposit.type,
                                amount: serviceDetails.deposit.amount
                              } : undefined
                            };
                          })
                        }));
                      }}
                    />
                  </div>

                  {formData.services.some(s => s.deposit) && (
                    <div className="space-y-2">
                      {formData.services.map((service, index) => {
                        const serviceDetails = initialServices.find(s => s.id === parseInt(service.id));
                        if (!serviceDetails?.deposit.required) return null;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{serviceDetails.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {serviceDetails.deposit.type === 'fixed'
                                  ? `$${serviceDetails.deposit.amount}`
                                  : `${serviceDetails.deposit.amount}%`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-4 pb-6">
                {/* Branch */}
                <div className="space-y-2">
                  <Label>Sucursal</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Matriz</SelectItem>
                      <SelectItem value="secondary">Secundaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Comentarios</Label>
                  <Textarea 
                    placeholder="Agrega un comentario a la cita"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>

                {/* Extra Charge */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cargo extra</Label>
                      <div className="text-sm text-muted-foreground">
                        Agregar un cargo adicional a la cita
                      </div>
                    </div>
                    <Switch
                      checked={!!formData.extraCharge}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('extraCharge', { description: '', amount: 0 });
                        } else {
                          handleInputChange('extraCharge', undefined);
                        }
                      }}
                    />
                  </div>
                  {formData.extraCharge && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="text"
                          placeholder="$0.00"
                          value={formData.extraCharge.amount ? `$${formData.extraCharge.amount.toFixed(2)}` : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d.]/g, '');
                            const amount = parseFloat(value);
                            handleInputChange('extraCharge', {
                              ...formData.extraCharge,
                              amount: isNaN(amount) ? 0 : Math.round(amount * 100) / 100
                            });
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Concepto"
                          value={formData.extraCharge.description}
                          onChange={(e) => {
                            handleInputChange('extraCharge', {
                              ...formData.extraCharge,
                              description: e.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <div className="border-t p-4 flex justify-end gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 absolute bottom-0 left-0 right-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Agendar Cita
          </Button>
        </div>
      </SheetContent>
      <NewClientDrawer
        open={showNewClientDrawer}
        onOpenChange={(open) => {
          setShowNewClientDrawer(open);
          if (!open) {
            setOpenClientCombobox(true);
          }
        }}
        onClientSaved={(clientData) => {
          setShowNewClientDrawer(false);
          setOpenClientCombobox(true);
        }}
      />
    </Sheet>
  );
}

export { NewAppointmentModal }