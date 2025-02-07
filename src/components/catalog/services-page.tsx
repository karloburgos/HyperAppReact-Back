import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Clock, DollarSign, Pencil, Package2, ChevronDown, ChevronRight } from 'lucide-react';
import { NewServiceModal } from './new-service-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { initialCategories } from '@/components/business/categories-page';

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  deposit: {
    required: boolean;
    type: 'fixed' | 'percentage';
    amount: number;
  };
  status: 'active' | 'inactive';
  category: string;
}

export const initialServices: Service[] = [ 
  // Servicio 1
  {
    id: 1,
    name: 'Express',
    duration: '45 min',
    price: 800,
    description: 'Descripción del servicio',
    category: 'Maquillaje',
    deposit: {
      required: true,
      type: 'fixed',
      amount: 200
    },
    status: 'active'
  },
  // Servicio 2
  {
    id: 2,
    name: 'Social',
    duration: '1hr',
    price: 1000,
    description: 'Descripción del servicio',
    category: 'Maquillaje',
    deposit: {
      required: true,
      type: 'percentage',
      amount: 10
    },
    status: 'inactive'
  },
  // Servicio 3
  {
    id: 3,
    name: 'Ondas',
    duration: '45 min',
    price: 800,
    description: 'Descripción del servicio',
    category: 'Peinado',
    deposit: {
      required: true,
      type: 'fixed',
      amount: 200
    },
    status: 'active'
  },
  // Servicio 4
  {
    id: 4,
    name: 'Semirecogido',
    duration: '1hr',
    price: 1000,
    description: 'Descripción del servicio',
    category: 'Peinado',
    deposit: {
      required: true,
      type: 'percentage',
      amount: 10
    },
    status: 'inactive'
  }
];

const statusColors = {
  active: 'bg-green-500/10 text-green-500',
  inactive: 'bg-gray-500/10 text-gray-500',
};

type TabType = 'todos' | 'activos' | 'inactivos';

export function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [services] = useState<Service[]>(initialServices);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
                         
    if (!matchesSearch) return false;
    
    switch (activeTab) {
      case 'activos':
        return service.status === 'active';
      case 'inactivos':
        return service.status === 'inactive';
      default:
        return true;
    }
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <h1 className="text-2xl font-semibold">Servicios</h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="relative w-full sm:w-64 lg:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar servicio..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Servicio
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowNewServiceModal(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Servicio individual
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Package2 className="h-4 w-4 mr-2" />
                  Paquete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 space-y-4 min-w-0">
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList className="w-auto overflow-x-auto">
            <TabsTrigger value="services">Servicios individuales</TabsTrigger>
            <TabsTrigger value="packages">Paquetes</TabsTrigger>
            <TabsTrigger value="extras">Extras</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            {/* Group services by category */}
            {Object.entries(
              services.reduce((acc, service) => {
                if (!acc[service.category]) {
                  acc[service.category] = [];
                }
                acc[service.category].push(service);
                return acc;
              }, {} as Record<string, Service[]>)
            ).map(([category, categoryServices]) => (
              <Collapsible
                key={category}
                open={expandedCategories.includes(category)}
                onOpenChange={() => toggleCategory(category)}
                className="space-y-2"
              >
                <div className="flex items-center justify-between group">
                  <CollapsibleTrigger className="flex items-center gap-2 hover:text-accent-foreground">
                    {expandedCategories.includes(category) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <h3 className="flex items-center gap-2 text-lg font-medium hover:text-accent-foreground">
                      <span className={`block w-2 h-2 rounded-full ${initialCategories.catalog.find(cat => cat.name === category)?.color || 'bg-gray-500'}`} />
                      {category}
                    </h3>
                  </CollapsibleTrigger>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      Opciones
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Descripción de la categoría</p>

                <CollapsibleContent className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {categoryServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4 min-w-0"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h4 className="font-me">{service.name}</h4>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                  <DropdownMenuItem>Eliminar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{service.duration}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>${service.price}</span>
                              </div>
                            </div>
                            <Badge className={statusColors[service.status]}>
                              {service.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
              </Collapsible>
            ))}
          </TabsContent>

          <TabsContent value="packages">
            <div className="text-center py-8 text-muted-foreground">
              No hay paquetes disponibles
            </div>
          </TabsContent>

          <TabsContent value="extras">
            <div className="text-center py-8 text-muted-foreground">
              No hay extras disponibles
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <NewServiceModal 
        open={showNewServiceModal}
        onOpenChange={setShowNewServiceModal}
      />
    </div>
  );
}