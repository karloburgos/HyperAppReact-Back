import { useState } from 'react';
import { Plus, MoreHorizontal, BookOpen, DollarSign, Calendar, UserRound, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewCategoryModal } from './new-category-modal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  items: number;
  status: 'active' | 'inactive';
}

export const initialCategories: Record<string, Category[]> = {
  catalog: [
    {
      id: 1,
      name: 'Maquillaje',
      type: 'service',
      description: 'Servicios especializados para el cuidado del cabello',
      color: 'bg-blue-500',
      items: 8,
      status: 'active',
    },
    {
      id: 2,
      name: 'Peinado',
      type: 'service',
      description: 'Servicios de cuidado y tratamiento facial',
      color: 'bg-pink-500',
      items: 6,
      status: 'active',
    },
  ],
  finances: [
    {
      id: 1,
      name: 'Ventas de Servicios',
      type: 'income',
      description: 'Ingresos por servicios prestados',
      color: 'bg-green-500',
      items: 15,
      status: 'active',
    },
    {
      id: 2,
      name: 'Gastos Operativos',
      type: 'expense',
      description: 'Gastos relacionados con la operación diaria',
      color: 'bg-red-500',
      items: 10,
      status: 'active',
    },
  ],
  calendar: [
    {
      id: 1,
      name: 'Citas Premium',
      type: 'reminder',
      description: 'Recordatorios para servicios especiales',
      color: 'bg-purple-500',
      items: 12,
      status: 'active',
    },
    {
      id: 2,
      name: 'Mantenimiento',
      type: 'reminder',
      description: 'Recordatorios de mantenimiento de equipos',
      color: 'bg-yellow-500',
      items: 5,
      status: 'active',
    },
  ],
  clients: [
    {
      id: 1,
      name: 'Clientes Frecuentes',
      type: 'client',
      description: 'Clientes con visitas regulares',
      color: 'bg-indigo-500',
      items: 25,
      status: 'active',
    },
    {
      id: 2,
      name: 'Nuevos Clientes',
      type: 'client',
      description: 'Clientes en su primera visita',
      color: 'bg-cyan-500',
      items: 18,
      status: 'active',
    },
  ],
};

const categoryIcons = {
  catalog: <BookOpen className="h-4 w-4" />,
  finances: <DollarSign className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  clients: <UserRound className="h-4 w-4" />,
};

export function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);

  // Filter categories based on type
  const getFilteredCategories = (tab: string) => {
    const categories = initialCategories[tab] || [];
    return categories.filter(category => {
      switch (tab) {
        case 'catalog':
          return category.type === 'service' || category.type === 'product';
        case 'finances':
          return category.type === 'income' || category.type === 'expense';
        case 'calendar':
          return category.type === 'reminder';
        case 'clients':
          return category.type === 'client';
        default:
          return true;
      }
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Categorías</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Administra las categorías de tu negocio
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4 flex-wrap">
            <Button onClick={() => setShowNewCategoryModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 space-y-4 min-w-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-auto overflow-x-auto">
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Catálogo
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Finanzas
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              Clientes
            </TabsTrigger>
          </TabsList>

          {Object.keys(initialCategories).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="space-y-4">
              <div className="rounded-md border">
                {getFilteredCategories(tabKey).length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No hay categorías para mostrar
                  </div>
                ) : (
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Nombre de la categoría</TableHead>
                        <TableHead className="whitespace-nowrap">Tipo</TableHead>
                        <TableHead className="whitespace-nowrap">Color</TableHead>
                        <TableHead className="whitespace-nowrap">Descripción</TableHead>
                        <TableHead className="whitespace-nowrap">Elementos</TableHead>
                        <TableHead className="whitespace-nowrap">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredCategories(tabKey).map((category) => (
                        <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {category.type === 'income' ? 'Ingresos' :
                           category.type === 'expense' ? 'Egresos' :
                           category.type === 'service' ? 'Servicios' :
                           category.type === 'reminder' ? 'Recordatorios' :
                           category.type === 'product' ? 'Productos' :
                           category.type === 'client' ? 'Clientes' : ''}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${category.color}`} />
                            <span className="text-sm">
                              {category.color.replace('bg-', '').replace('-500', '')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {category.items} {tabKey === 'catalog' ? 'servicios' :
                                           tabKey === 'finances' ? 'transacciones' :
                                           tabKey === 'calendar' ? 'eventos' : 'clientes'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                    </Table>
                  </div>
                </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <NewCategoryModal
        open={showNewCategoryModal}
        onOpenChange={setShowNewCategoryModal}
      />
    </div>
  );
}