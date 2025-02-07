import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Plus, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface NewClientDrawerProps {
  children: React.ReactNode;
  onClientSaved?: (clientData: ClientFormData) => void;
}

interface SocialNetwork {
  type: 'facebook' | 'instagram' | 'whatsapp';
  username: string;
}

export interface ClientFormData {
  avatar: string | undefined;
  firstName: string;
  membership: string;
  lastName: string;
  countryCode: string;
  phone: string;
  socialNetworks: SocialNetwork[];
  email: string;
  birthDate: Date | undefined;
  gender: string;
  nickname: string;
  origin: string;
  relatedClient: string;
  occupation: string;
  country: string;
  emergency: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export function NewClientDrawer({ children, onClientSaved }: NewClientDrawerProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    avatar: undefined,
    firstName: '',
    lastName: '',
    countryCode: '+52',
    phone: '',
    socialNetworks: [],
    email: '',
    birthDate: undefined,
    gender: '',
    nickname: '',
    origin: '',
    relatedClient: '',
    occupation: '',
    country: '',
    membership: undefined,
    emergency: {
      name: '',
      phone: '',
      relationship: '',
    }
  });

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

  const handleInputChange = (field: keyof ClientFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (field: keyof typeof formData.emergency, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergency: { ...prev.emergency, [field]: value }
    }));
  };

  const handleAddSocialNetwork = () => {
    setFormData(prev => ({
      ...prev,
      socialNetworks: [...prev.socialNetworks, { type: 'facebook', username: '' }]
    }));
  };

  const handleSocialNetworkChange = (index: number, field: keyof SocialNetwork, value: any) => {
    setFormData(prev => ({
      ...prev,
      socialNetworks: prev.socialNetworks.map((network, i) =>
        i === index ? { ...network, [field]: value } : network
      )
    }));
  };

  const handleRemoveSocialNetwork = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialNetworks: prev.socialNetworks.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('El nombre y apellido son obligatorios');
      return false;
    }
    if (!formData.phone) {
      toast.error('El teléfono es obligatorio');
      return false;
    }
    if (formData.email && !formData.email.includes('@')) {
      toast.error('El correo electrónico debe ser válido');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      toast.success('Cliente guardado exitosamente');
  
      if (onClientSaved) {
        onClientSaved(formData);
      }
  
      setOpen(false);
      setFormData({
        avatar: undefined,
        firstName: '',
        lastName: '',
        countryCode: '+52',
        phone: '',
        socialNetworks: [],
        email: '',
        birthDate: undefined,
        gender: '',
        nickname: '',
        origin: '',
        relatedClient: '',
        occupation: '',
        country: '',
        membership: '',
        emergency: {
          name: '',
          phone: '',
          relationship: '',
        }
      });
    } catch (error) {
      toast.error('Error al guardar el cliente');
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 h-full">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 border-b">
            <SheetHeader>
              <SheetTitle>Nuevo Cliente</SheetTitle>
            </SheetHeader>
          </div>

          <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Perfil</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="emergency">Emergencia</TabsTrigger>
                <TabsTrigger value="files">Archivos</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">
              <TabsContent value="basic" className="space-y-6 mt-4 pb-6">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback>
                        {formData.firstName && formData.lastName 
                          ? `${formData.firstName[0]}${formData.lastName[0]}`
                          : 'CN'}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor="avatar" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer">
                      <Plus className="h-4 w-4" />
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept=".jpg,.png"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Ej. María"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Ej. García"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="countryCode">LADA</Label>
                    <Select 
                      value={formData.countryCode}
                      onValueChange={(value) => handleInputChange('countryCode', value)}
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
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input 
                      id="phone" 
                      placeholder="555 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                {/* Social Networks */}
                <div className="space-y-4">
                  <Label>Redes Sociales</Label>
                  <div className="space-y-2">
                    {formData.socialNetworks.map((network, index) => (
                      <div key={index} className="flex gap-2">
                        <Select
                          value={network.type}
                          onValueChange={(value: any) => handleSocialNetworkChange(index, 'type', value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="@usuario"
                          className="flex-1"
                          value={network.username}
                          onChange={(e) => handleSocialNetworkChange(index, 'username', e.target.value)}
                        />
                        {formData.socialNetworks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => handleRemoveSocialNetwork(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleAddSocialNetwork}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar red social
                    </Button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label>Fecha de nacimiento</Label>
                  <Input
                    type="date"
                    value={formData.birthDate ? format(formData.birthDate, "yyyy-MM-dd") : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      handleInputChange('birthDate', date);
                    }}
                  />
                </div>

                {/* Gender */}
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
                      <SelectItem value="female">Femenino</SelectItem>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-4 pb-6">
                {/* Membership */}
                <div className="space-y-2">
                  <Label htmlFor="membership">Membresía</Label>
                  <Select
                    value={formData.membership}
                    onValueChange={(value) => handleInputChange('membership', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una membresía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname">Apodo</Label>
                  <Input 
                    id="nickname" 
                    placeholder="Ej. Sra. García"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                  />
                </div>

                {/* Client Origin */}
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen del cliente</Label>
                  <Select
                    value={formData.origin}
                    onValueChange={(value) => handleInputChange('origin', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">Invitado</SelectItem>
                      <SelectItem value="social">Redes Sociales</SelectItem>
                      <SelectItem value="unspecified">Sin especificar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Related Client */}
                <div className="space-y-2">
                  <Label htmlFor="relatedClient">Relación con otro cliente</Label>
                  <Select
                    value={formData.relatedClient}
                    onValueChange={(value) => handleInputChange('relatedClient', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Buscar cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client1">María García</SelectItem>
                      <SelectItem value="client2">Juan Pérez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="occupation">Ocupación</Label>
                  <Input 
                    id="occupation" 
                    placeholder="Ej. Profesora"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mx">México</SelectItem>
                      <SelectItem value="us">Estados Unidos</SelectItem>
                      <SelectItem value="es">España</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-6 mt-4 pb-6">
                {/* Emergency Contact */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Nombre</Label>
                    <Input 
                      id="emergencyName" 
                      placeholder="Nombre del contacto"
                      value={formData.emergency.name}
                      onChange={(e) => handleEmergencyChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Teléfono</Label>
                    <Input 
                      id="emergencyPhone" 
                      placeholder="Teléfono de emergencia"
                      value={formData.emergency.phone}
                      onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Parentesco</Label>
                    <Input 
                      id="relationship" 
                      placeholder="Ej. Padre, Madre, Hermano/a"
                      value={formData.emergency.relationship}
                      onChange={(e) => handleEmergencyChange('relationship', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files" className="space-y-6 mt-4 pb-6">
                {/* File Uploads */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Documentos PDF</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Arrastra archivos PDF o haz clic para seleccionar
                        </span>
                        <Input
                          id="pdf-upload"
                          type="file"
                          accept=".pdf,.docx"
                          className="hidden"
                        />
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Imágenes</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Arrastra imágenes o haz clic para seleccionar
                        </span>
                        <Input
                          id="image-upload"
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          className="hidden"
                        />
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="border-t p-4 flex justify-end gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 absolute bottom-0 left-0 right-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cliente
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}