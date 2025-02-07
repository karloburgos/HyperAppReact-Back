import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface NewCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CategoryFormData {
  name: string;
  type: string;
  color: string;
  description: string;
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

export function NewCategoryModal({ open, onOpenChange }: NewCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    type: '',
    color: '',
    description: '',
  });

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name) {
      toast.error('El nombre de la categoría es obligatorio');
      return false;
    }
    if (!formData.type) {
      toast.error('El tipo de categoría es obligatorio');
      return false;
    }
    if (!formData.color) {
      toast.error('El color es obligatorio');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Categoría guardada exitosamente');
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al guardar la categoría');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 h-full">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 border-b">
            <SheetHeader>
              <SheetTitle>Nueva Categoría</SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la categoría</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej. VIP, Peluquería, Ingresos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Ingresos</SelectItem>
                    <SelectItem value="expense">Egresos</SelectItem>
                    <SelectItem value="service">Servicios</SelectItem>
                    <SelectItem value="reminder">Recordatorios</SelectItem>
                    <SelectItem value="product">Productos</SelectItem>
                    <SelectItem value="client">Clientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => handleInputChange('color', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.value}`} />
                          <span>{color.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe la categoría..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Categoría
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}