import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Plus, CreditCard, Building2, Landmark, User2, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { initialTeamMembers } from './team-page';
import { initialServices } from '../catalog/services-page';

interface NewProfessionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (professional: any) => void;
}

const categoryColors = [
  { name: 'Rojo', value: 'bg-red-500' },
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Verde', value: 'bg-green-500' },
  { name: 'Amarillo', value: 'bg-yellow-500' },
  { name: 'Morado', value: 'bg-purple-500' },
  { name: 'Rosa', value: 'bg-pink-500' },
  { name: 'Naranja', value: 'bg-orange-500' },
  { name: 'Cian', value: 'bg-cyan-500' },
  { name: 'Lima', value: 'bg-lime-500' },
  { name: 'Índigo', value: 'bg-indigo-500' },
];

interface ProfessionalFormData {
  avatar: string | undefined;
  firstName: string;
  lastName: string;
  gender: string;
  position: string;
  calendarColor: string;
  services: Array<{
    id: string;
    commission: {
      type: 'fixed' | 'percentage';
      value: string;
    };
  }>;
  branch: string;
  status: boolean;
  bankInfo: {
    accountType: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    cardType: string;
  };
  birthDate: Date | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  comments: string;
  address: {
    street: string;
    exteriorNumber: string;
    interiorNumber: string;
    neighborhood: string;
    zipCode: string;
  };
  emergency: {
    firstName: string;
    lastName: string;
    countryCode: string;
    phone: string;
    relationship: string;
  };
}

export function NewProfessionalModal({ open, onOpenChange, onSave }: NewProfessionalModalProps) {
  const [formData, setFormData] = useState<ProfessionalFormData>({
    avatar: undefined,
    firstName: '',
    lastName: '',
    gender: '',
    position: '',
    calendarColor: '',
    services: [],
    branch: '',
    status: true,
    bankInfo: {
      accountType: '',
      accountName: '',
      accountNumber: '',
      bankName: '',
      cardType: '',
    },
    birthDate: undefined,
    startDate: undefined,
    endDate: undefined,
    comments: '',
    address: {
      street: '',
      exteriorNumber: '',
      interiorNumber: '',
      neighborhood: '',
      zipCode: '',
    },
    emergency: {
      firstName: '',
      lastName: '',
      countryCode: '+52',
      phone: '',
      relationship: '',
    },
  });

  // Get already used calendar colors
  const usedCalendarColors = initialTeamMembers
    .filter(member => member.type === 'professional' && member.calendarColor)
    .map(member => member.calendarColor?.replace('ring-', 'bg-'));

  // Filter available colors
  const availableColors = categoryColors.filter(
    color => !usedCalendarColors.includes(color.value)
  );

  // Get already selected services
  const selectedServiceIds = formData.services.map(s => s.id).filter(Boolean);

  // Filter available services for dropdown
  const getAvailableServices = (currentServiceId: string = '') => {
    return initialServices.filter(service => 
      !selectedServiceIds.includes(service.id.toString()) || 
      service.id.toString() === currentServiceId
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof ProfessionalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBankInfoChange = (field: keyof typeof formData.bankInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      bankInfo: { ...prev.bankInfo, [field]: value }
    }));
  };

  const handleAddressChange = (field: keyof typeof formData.address, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleEmergencyChange = (field: keyof typeof formData.emergency, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergency: { ...prev.emergency, [field]: value }
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('El nombre y apellido son obligatorios');
      return false;
    }
    if (!formData.position) {
      toast.error('El puesto es obligatorio');
      return false;
    }
    if (!formData.calendarColor) {
      toast.error('El color de agenda es obligatorio');
      return false;
    }
    if (formData.services.some(service => !service.id)) {
      toast.error('Todos los servicios deben estar seleccionados');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      // Create new team member from form data
      const newTeamMember = {
        id: Date.now(), // Simple ID generation
        name: `${formData.firstName} ${formData.lastName}`,
        position: formData.position,
        email: '', // Could be added to form if needed
        image: formData.avatar,
        type: 'professional' as const,
        status: formData.status ? 'active' as const : 'inactive' as const,
        calendarColor: formData.calendarColor.replace('bg-', 'ring-'),
        services: formData.services.map(service => {
          const serviceDetails = initialServices.find(s => s.id.toString() === service.id);
          const color = service.id ? service.id.toString() === '1' ? 'blue' : 
                                   service.id.toString() === '2' ? 'pink' :
                                   service.id.toString() === '3' ? 'purple' :
                                   service.id.toString() === '4' ? 'orange' : 'gray' : 'gray';
          return {
            name: serviceDetails?.name || '',
            categoryColor: `bg-${color}-500`,
            textColor: `text-${color}-500`
          };
        })
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(newTeamMember);
      }
      
      toast.success('Profesional guardado exitosamente');
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al guardar el profesional');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 h-full">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 border-b">
            <SheetHeader>
              <SheetTitle>Nuevo Profesional</SheetTitle>
            </SheetHeader>
          </div>

          <Tabs defaultValue="data" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="data">Datos</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
                 <TabsTrigger value="payment">Inf. Pago</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">
              <TabsContent value="data" className="space-y-6 mt-4 pb-6">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback>
                        {formData.firstName && formData.lastName 
                          ? `${formData.firstName[0]}${formData.lastName[0]}`
                          : 'PR'}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor="avatar" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer">
                      <Plus className="h-4 w-4" />
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Información</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input 
                        id="firstName"
                        placeholder="Ej. Marisela"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Ej. Félix"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Mujer</SelectItem>
                        <SelectItem value="male">Hombre</SelectItem>
                        <SelectItem value="unspecified">Sin especificar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Workspace */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Espacio de trabajo</h3>

                  <div className="space-y-2">
                    <Label htmlFor="position">Puesto</Label>
                    <Input 
                      id="position" 
                      placeholder="Ej. Maquillista, Barbero"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Color de agenda</Label>
                    <Select
                      value={formData.calendarColor}
                      onValueChange={(value) => handleInputChange('calendarColor', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un color" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No hay colores disponibles
                          </div>
                        ) : (
                          availableColors.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${color.value}`} />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Servicios y comisiones</Label>
                    <div className="space-y-2">
                      {formData.services.map((service, index) => (
                        <div key={index} className="flex items-start gap-2 border rounded-lg p-2">
                          <div className="flex-1 space-y-2">
                            <Select
                              value={service.id}
                              onValueChange={(value) => {
                                const newServices = [...formData.services];
                                newServices[index] = {
                                  id: value,
                                  commission: service.commission
                                };
                                handleInputChange('services', newServices);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableServices(service.id).map((availableService) => (
                                  <SelectItem key={availableService.id} value={availableService.id.toString()}>
                                    {availableService.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {service.id && (
                              <div className="flex gap-2">
                                <Select
                                  value={service.commission.type}
                                  onValueChange={(value: 'fixed' | 'percentage') => {
                                    const newServices = [...formData.services];
                                    newServices[index] = {
                                      ...service,
                                      commission: {
                                        ...service.commission,
                                        type: value
                                      }
                                    };
                                    handleInputChange('services', newServices);
                                  }}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="fixed">Precio fijo</SelectItem>
                                    <SelectItem value="percentage">Porcentaje</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  type="number"
                                  placeholder={service.commission.type === 'fixed' ? "$0.00" : "0%"}
                                  value={service.commission.value}
                                  onChange={(e) => {
                                    const newServices = [...formData.services];
                                    newServices[index] = {
                                      ...service,
                                      commission: {
                                        ...service.commission,
                                        value: e.target.value
                                      }
                                    };
                                    handleInputChange('services', newServices);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newServices = formData.services.filter((_, i) => i !== index);
                              handleInputChange('services', newServices);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const newServices = [...formData.services, {
                            id: '',
                            commission: {
                              type: 'percentage',
                              value: ''
                            }
                          }];
                          handleInputChange('services', newServices);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar servicio
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Sucursal</Label>
                    <Select
                      value={formData.branch}
                      onValueChange={(value) => handleInputChange('branch', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Matriz</SelectItem>
                        <SelectItem value="secondary">Secundaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6 mt-4 pb-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de cuenta</Label>
                    <Select
                      value={formData.bankInfo.accountType}
                      onValueChange={(value) => handleBankInfoChange('accountType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de cuenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Número de cuenta</SelectItem>
                        <SelectItem value="card">Número de tarjeta</SelectItem>
                        <SelectItem value="clabe">CLABE Interbancaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">
                      Nombre de la cuenta
                    </Label>
                    <Input
                      placeholder="Ej. Marisela Félix"
                      id="accountName"
                      value={formData.bankInfo.accountName}
                      onChange={(e) => handleBankInfoChange('accountName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">
                      <CreditCard className="h-4 w-4 inline-block mr-2" />
                      Número
                    </Label>
                    <Input
                      id="accountNumber"
                      placeholder="Ej. 5256 7890 1234 5678"
                      value={formData.bankInfo.accountNumber}
                      onChange={(e) => handleBankInfoChange('accountNumber', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">
                    <Landmark className="h-4 w-4 inline-block mr-2" />
                      Nombre de banco
                    </Label>
                    <Input
                      id="bankName"
                      placeholder="Ej. BBVA, Banamex, etc"
                      value={formData.bankInfo.bankName}
                      onChange={(e) => handleBankInfoChange('bankName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Tipo de cuenta
                    </Label>
                    <Select
                      value={formData.bankInfo.cardType}
                      onValueChange={(value) => handleBankInfoChange('cardType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debit">Débito</SelectItem>
                        <SelectItem value="credit">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-4 pb-6">
                {/* Professional Details */}
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Estado del profesional</Label>
                      <div className="text-sm text-muted-foreground">
                        {formData.status ? 'Activo' : 'Inactivo'}
                      </div>
                    </div>
                    <Switch
                      checked={formData.status}
                      onCheckedChange={(checked) => handleInputChange('status', checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha de cumpleaños</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.birthDate 
                            ? format(formData.birthDate, "PPP", { locale: es }) 
                            : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.birthDate}
                          onSelect={(date) => handleInputChange('birthDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de inicio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate 
                            ? format(formData.startDate, "PPP", { locale: es }) 
                            : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => handleInputChange('startDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de finalización</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate 
                            ? format(formData.endDate, "PPP", { locale: es }) 
                            : "Selecciona una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => handleInputChange('endDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments">Comentarios</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => handleInputChange('comments', e.target.value)}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dirección</h3>

                  <div className="space-y-2">
                    <Label htmlFor="street">Calle</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exteriorNumber">Número exterior</Label>
                      <Input
                        id="exteriorNumber"
                        value={formData.address.exteriorNumber}
                        onChange={(e) => handleAddressChange('exteriorNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interiorNumber">Número interior</Label>
                      <Input
                        id="interiorNumber"
                        value={formData.address.interiorNumber}
                        onChange={(e) => handleAddressChange('interiorNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Colonia</Label>
                    <Input
                      id="neighborhood"
                      value={formData.address.neighborhood}
                      onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">C.P.</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contacto de emergencia</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyFirstName">Nombre</Label>
                      <Input
                        id="emergencyFirstName"
                        value={formData.emergency.firstName}
                        onChange={(e) => handleEmergencyChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyLastName">Apellido</Label>
                      <Input
                        id="emergencyLastName"
                        value={formData.emergency.lastName}
                        onChange={(e) => handleEmergencyChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>LADA</Label>
                      <Select
                        value={formData.emergency.countryCode}
                        onValueChange={(value) => handleEmergencyChange('countryCode', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+52">+52 (MX)</SelectItem>
                          <SelectItem value="+1">+1 (US)</SelectItem>
                          <SelectItem value="+34">+34 (ES)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="emergencyPhone">Teléfono</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergency.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleEmergencyChange('phone', value);
                        }}
                        placeholder="10 dígitos"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Parentesco</Label>
                    <Input
                      id="relationship"
                      placeholder="Ej. Padre, Madre, etc"
                      value={formData.emergency.relationship}
                      onChange={(e) => handleEmergencyChange('relationship', e.target.value)}
                    />
                  </div>
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
            Guardar Profesional
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}