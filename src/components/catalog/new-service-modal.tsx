import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { NewCategoryModal } from '../business/new-category-modal';
import { initialCategories } from '../business/categories-page';
import { initialTeamMembers } from '../business/team-page';

interface NewServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  duration: string;
  priceType: 'fixed' | 'free' | 'from';
  currency: 'MXN' | 'USD';
  price: string;
  requiresDeposit: boolean;
  depositType: 'fixed' | 'percentage';
  depositAmount: string;
  cost: {
    type: 'fixed' | 'free' | 'from';
    currency: 'MXN' | 'USD';
    amount: string;
  };
  taxes: string;
  branch: string;
  sku: string;
  status: boolean;
  professionals: string[];
  onlineReservation: boolean;
  availableFor: 'all' | 'women' | 'men';
}

const durationOptions = [
  '15 min',
  '30 min',
  '45 min',
  '1hr',
  '1hr y 30 min',
  '2hrs',
  '2hrs y 30 min',
  '3hrs',
];

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

export function NewServiceModal({ open, onOpenChange }: NewServiceModalProps) {
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    category: '',
    description: '',
    duration: '',
    priceType: 'fixed',
    currency: 'MXN',
    price: '',
    requiresDeposit: false,
    depositType: 'fixed',
    depositAmount: '',
    cost: {
      type: 'fixed',
      currency: 'MXN',
      amount: '',
    },
    taxes: '',
    branch: '',
    sku: '',
    professionals: [],
    status: true,
    onlineReservation: true,
    availableFor: 'all',
  });

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCostChange = (field: keyof typeof formData.cost, value: any) => {
    setFormData(prev => ({
      ...prev,
      cost: { ...prev.cost, [field]: value }
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name) {
      toast.error('El nombre del servicio es obligatorio');
      return false;
    }
    if (!formData.category && !showNewCategoryModal) {
      toast.error('La categoría es obligatoria');
      return false;
    }
    if (!formData.duration) {
      toast.error('La duración es obligatoria');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Servicio guardado exitosamente');
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al guardar el servicio');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 h-full">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 border-b">
            <SheetHeader>
              <SheetTitle>Nuevo Servicio Individual</SheetTitle>
            </SheetHeader>
          </div>

          <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="settings">Ajustes</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">
              <TabsContent value="info" className="space-y-6 mt-4 pb-6">
                {/* Service Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Servicio</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del servicio</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej. Corte de cabello"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-normal"
                          onClick={() => setShowNewCategoryModal(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Crear nueva categoría
                        </Button>
                        {initialCategories.catalog
                          .filter(cat => cat.type === 'service' || cat.type === 'product')
                          .filter(cat => cat.type === 'service')
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                {category.name}
                              </div>
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe el servicio..."
                    />
                  </div>
                </div>

                {/* Prices and Duration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Precios y duración</h3>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => handleInputChange('duration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la duración" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {durationOptions.map((duration) => (
                          <SelectItem key={duration} value={duration}>
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Precio</Label>
                    <Select
                      value={formData.priceType}
                      onValueChange={(value: 'fixed' | 'free' | 'from') => handleInputChange('priceType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fijo</SelectItem>
                        <SelectItem value="free">Gratis</SelectItem>
                        <SelectItem value="from">Desde</SelectItem>
                      </SelectContent>
                    </Select>

                    {formData.priceType !== 'free' && (
                      <div className="flex gap-2 mt-2">
                        <Select
                          value={formData.currency}
                          onValueChange={(value: 'MXN' | 'USD') => handleInputChange('currency', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MXN">MXN</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Deposit */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Anticipos</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="deposit">¿Se necesita Anticipo?</Label>
                    <Switch
                      id="deposit"
                      checked={formData.requiresDeposit}
                      onCheckedChange={(checked) => handleInputChange('requiresDeposit', checked)}
                    />
                  </div>

                  {formData.requiresDeposit && (
                    <div className="space-y-2">
                      <Select
                        value={formData.depositType}
                        onValueChange={(value: 'fixed' | 'percentage') => handleInputChange('depositType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fijo</SelectItem>
                          <SelectItem value="percentage">Porcentaje</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        type="number"
                        placeholder={formData.depositType === 'fixed' ? "0.00" : "0"}
                        value={formData.depositAmount}
                        onChange={(e) => handleInputChange('depositAmount', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-4 pb-6">
                {/* Professionals Assignment */}
                <div className="space-y-2">
                  <Label>Asignar profesionales</Label>
                  <Select
                    value={formData.professionals.join(',')}
                    onValueChange={(value) => handleInputChange('professionals', value.split(',').filter(Boolean))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona profesionales" />
                    </SelectTrigger>
                    <SelectContent>
                      {initialTeamMembers
                        .filter(member => member.type === 'professional' && member.status === 'active')
                        .map((professional) => (
                          <SelectItem key={professional.id} value={professional.id.toString()}>
                            {professional.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Cost */}
                <div className="space-y-2">
                  <Label>Costo del servicio</Label>
                  <Select
                    value={formData.cost.type}
                    onValueChange={(value: 'fixed' | 'free' | 'from') => handleCostChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fijo</SelectItem>
                      <SelectItem value="free">Gratis</SelectItem>
                      <SelectItem value="from">Desde</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.cost.type !== 'free' && (
                    <div className="flex gap-2 mt-2">
                      <Select
                        value={formData.cost.currency}
                        onValueChange={(value: 'MXN' | 'USD') => handleCostChange('currency', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MXN">MXN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.cost.amount}
                        onChange={(e) => handleCostChange('amount', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Taxes */}
                <div className="space-y-2">
                  <Label htmlFor="taxes">Impuestos</Label>
                  <Input
                    id="taxes"
                    value={formData.taxes}
                    onChange={(e) => handleInputChange('taxes', e.target.value)}
                    placeholder="Ej. IVA 16%"
                  />
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <Label htmlFor="branch">Asignar sucursal</Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) => handleInputChange('branch', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Sucursal Principal</SelectItem>
                      <SelectItem value="north">Sucursal Norte</SelectItem>
                      <SelectItem value="south">Sucursal Sur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Ej. SERV-001"
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-4 pb-6">
                {/* Service Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="status">Estado del servicio</Label>
                    <div className="text-sm text-muted-foreground">
                      {formData.status ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => handleInputChange('status', checked)}
                  />
                </div>

                {/* Online Reservation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="online">Reservación online</Label>
                      <div className="text-sm text-muted-foreground">
                        Permitir reservaciones en línea
                      </div>
                    </div>
                    <Switch
                      id="online"
                      checked={formData.onlineReservation}
                      onCheckedChange={(checked) => handleInputChange('onlineReservation', checked)}
                    />
                  </div>

                  {formData.onlineReservation && (
                    <div className="space-y-2">
                      <Label>Disponible para</Label>
                      <Select
                        value={formData.availableFor}
                        onValueChange={(value: 'all' | 'women' | 'men') => handleInputChange('availableFor', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="women">Sólo mujeres</SelectItem>
                          <SelectItem value="men">Sólo hombres</SelectItem>
                        </SelectContent>
                      </Select>
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
            Guardar Servicio
          </Button>
        </div>
      </SheetContent>
      {showNewCategoryModal && (
      <NewCategoryModal
        open={showNewCategoryModal}
        onOpenChange={setShowNewCategoryModal}
      />
      )}
    </Sheet>
  );
}
