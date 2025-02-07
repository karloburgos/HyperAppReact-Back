import { useState } from 'react';
import { Search, Plus, Filter, Download, MoreHorizontal, DollarSign, Calendar, Clock, User2, Tag, Receipt, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Banknote, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Income {
  id: number;
  date: string;
  time: string;
  type: 'service' | 'product' | 'course';
  description: string;
  client: {
    name: string;
    image?: string;
  };
  professional: {
    name: string;
    image?: string;
  };
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'completed' | 'pending' | 'cancelled';
  category: string;
  reference: string;
}

const initialIncomes: Income[] = [
  {
    id: 1,
    date: '2024-03-20',
    time: '10:30',
    type: 'service',
    description: 'Maquillaje Express',
    client: {
      name: 'María García',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&auto=format&fit=crop'
    },
    professional: {
      name: 'Isabella Martínez',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    },
    amount: 800,
    paymentMethod: 'card',
    status: 'completed',
    category: 'Maquillaje',
    reference: 'SERV-001'
  },
  {
    id: 2,
    date: '2024-03-20',
    time: '11:45',
    type: 'product',
    description: 'Productos de cuidado facial',
    client: {
      name: 'Carlos Rodríguez',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop'
    },
    professional: {
      name: 'Daniel Rodríguez',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
    },
    amount: 450,
    paymentMethod: 'cash',
    status: 'completed',
    category: 'Productos',
    reference: 'PROD-001'
  }
];

const statusColors = {
  completed: 'bg-green-500/10 text-green-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
  cancelled: 'bg-red-500/10 text-red-500'
};

const statusLabels = {
  completed: 'Completado',
  pending: 'Pendiente',
  cancelled: 'Cancelado'
};

const paymentMethodIcons = {
  cash: Banknote,
  card: CreditCard,
  transfer: ArrowLeftRight
};

type TabType = 'todos' | 'servicios' | 'productos' | 'cursos';

export function IncomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [selectedIncomes, setSelectedIncomes] = useState<number[]>([]);
  const [incomes] = useState<Income[]>(initialIncomes);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIncomes(checked ? filteredIncomes.map(income => income.id) : []);
  };

  const handleSelectIncome = (incomeId: number, checked: boolean) => {
    setSelectedIncomes(prev => 
      checked ? [...prev, incomeId] : prev.filter(id => id !== incomeId)
    );
  };

  const filteredIncomes = incomes.filter(income => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.reference.toLowerCase().includes(searchTerm.toLowerCase());
                         
    if (!matchesSearch) return false;
    
    switch (activeTab) {
      case 'servicios':
        return income.type === 'service';
      case 'productos':
        return income.type === 'product';
      case 'cursos':
        return income.type === 'course';
      default:
        return true;
    }
  });

  const totalAmount = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const completedAmount = filteredIncomes
    .filter(income => income.status === 'completed')
    .reduce((sum, income) => sum + income.amount, 0);
  const pendingAmount = filteredIncomes
    .filter(income => income.status === 'pending')
    .reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col gap-4 p-4">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Ingresos</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gestiona y analiza los ingresos del negocio
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Ingreso
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <h3 className="text-2xl font-bold">${totalAmount.toLocaleString()}</h3>
                </div>
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completado</p>
                  <h3 className="text-2xl font-bold text-green-500">${completedAmount.toLocaleString()}</h3>
                </div>
                <ArrowUpRight className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendiente</p>
                  <h3 className="text-2xl font-bold text-yellow-500">${pendingAmount.toLocaleString()}</h3>
                </div>
                <ArrowDownRight className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs defaultValue="todos" className="w-full">
              <TabsList>
                <TabsTrigger value="todos" className="flex items-center gap-2">
                  Todos
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {incomes.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="servicios" className="flex items-center gap-2">
                  Servicios
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {incomes.filter(i => i.type === 'service').length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="productos" className="flex items-center gap-2">
                  Productos
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {incomes.filter(i => i.type === 'product').length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="cursos" className="flex items-center gap-2">
                  Cursos
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {incomes.filter(i => i.type === 'course').length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ingreso..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 p-4 min-h-0">
        <div className="h-full border rounded-lg bg-background">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectedIncomes.length === filteredIncomes.length}
                      className="checkbox"
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Profesional</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncomes.map((income) => {
                  const PaymentIcon = paymentMethodIcons[income.paymentMethod];
                  return (
                    <TableRow key={income.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIncomes.includes(income.id)}
                          className="checkbox"
                          onCheckedChange={(checked) => handleSelectIncome(income.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(income.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{income.time}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{income.description}</p>
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{income.reference}</span>
                          </div>
                          <Badge variant="secondary">
                            {income.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={income.client.image} />
                            <AvatarFallback>{income.client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{income.client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={income.professional.image} />
                            <AvatarFallback>{income.professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{income.professional.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${income.amount.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PaymentIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{income.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[income.status]}>
                          {statusLabels[income.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Descargar recibo</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}