import { useState } from 'react';
import { Search, Plus, Filter, Download, MoreHorizontal, Tag, Calendar, Clock, Percent, Copy, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Wallet, BadgePercent, Sparkle, Package, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  type: 'service' | 'product' | 'course';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usageCount: number;
  status: 'active' | 'expired' | 'depleted';
  featured: boolean;
  image: string;
  category: string;
}

const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: 'BEAUTY25',
    title: 'Descuento en Maquillaje',
    description: 'Obtén un 25% de descuento en servicios de maquillaje',
    type: 'service',
    discountType: 'percentage',
    discountValue: 25,
    validFrom: '2024-03-01',
    validUntil: '2024-04-30',
    usageLimit: 100,
    usageCount: 45,
    status: 'active',
    featured: true,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop',
    category: 'Maquillaje'
  },
  {
    id: 2,
    code: 'PROD50',
    title: 'Mitad de precio en productos',
    description: 'Descuento del 50% en productos seleccionados',
    type: 'product',
    discountType: 'percentage',
    discountValue: 50,
    validFrom: '2024-03-15',
    validUntil: '2024-03-31',
    usageLimit: 50,
    usageCount: 50,
    status: 'depleted',
    featured: false,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=200&fit=crop',
    category: 'Productos'
  },
  {
    id: 3,
    code: 'CURSO100',
    title: 'Descuento en cursos',
    description: '$100 de descuento en cursos de maquillaje',
    type: 'course',
    discountType: 'fixed',
    discountValue: 100,
    validFrom: '2024-02-01',
    validUntil: '2024-03-15',
    usageLimit: 30,
    usageCount: 12,
    status: 'expired',
    featured: false,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop',
    category: 'Cursos'
  }
];

const statusColors = {
  active: 'bg-green-500/10 text-green-500',
  expired: 'bg-yellow-500/10 text-yellow-500',
  depleted: 'bg-red-500/10 text-red-500'
};

const statusLabels = {
  active: 'Activo',
  expired: 'Expirado',
  depleted: 'Agotado'
};

type TabType = 'todos' | 'servicios' | 'productos' | 'cursos';

export function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [coupons] = useState<Coupon[]>(initialCoupons);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado al portapapeles');
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
                         
    if (!matchesSearch) return false;
    
    switch (activeTab) {
      case 'servicios':
        return coupon.type === 'service';
      case 'productos':
        return coupon.type === 'product';
      case 'cursos':
        return coupon.type === 'course';
      default:
        return true;
    }
  });

  const activeCoupons = coupons.filter(c => c.status === 'active').length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const totalSavings = coupons.reduce((sum, c) => {
    if (c.discountType === 'fixed') {
      return sum + (c.discountValue * c.usageCount);
    } else {
      // Estimado para descuentos porcentuales (asumiendo un valor promedio de $100)
      return sum + ((100 * c.discountValue / 100) * c.usageCount);
    }
  }, 0);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col gap-4 p-4">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Cupones</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gestiona los cupones y descuentos de tu negocio
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
                Nuevo Cupón
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cupones Activos</p>
                  <h3 className="text-2xl font-bold">{activeCoupons}</h3>
                </div>
                <BadgePercent className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usos Totales</p>
                  <h3 className="text-2xl font-bold">{totalUsage}</h3>
                </div>
                <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ahorro Total</p>
                  <h3 className="text-2xl font-bold">${totalSavings.toLocaleString()}</h3>
                </div>
                <Wallet className="h-8 w-8 text-muted-foreground" />
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
                    {coupons.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="servicios" className="flex items-center gap-2">
                  Servicios
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {coupons.filter(c => c.type === 'service').length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="productos" className="flex items-center gap-2">
                  Productos
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {coupons.filter(c => c.type === 'product').length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="cursos" className="flex items-center gap-2">
                  Cursos
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {coupons.filter(c => c.type === 'course').length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cupón..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Coupons */}
      {filteredCoupons.some(c => c.featured) && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Cupones Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoupons
              .filter(c => c.featured)
              .map(coupon => (
                <div
                  key={coupon.id}
                  className="relative group overflow-hidden border rounded-lg bg-card transition-all hover:shadow-lg"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src={coupon.image}
                      alt={coupon.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="uppercase">
                        {coupon.category}
                      </Badge>
                      <Badge className={statusColors[coupon.status]}>
                        {statusLabels[coupon.status]}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{coupon.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{coupon.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Hasta {new Date(coupon.validUntil).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode(coupon.code)}
                        className="gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        {coupon.code}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Coupons Grid */}
      <div className="flex-1 p-4 min-h-0">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCoupons
              .filter(c => !c.featured)
              .map(coupon => (
                <div
                  key={coupon.id}
                  className="border rounded-lg bg-card p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="uppercase">
                      {coupon.category}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Ver estadísticas</DropdownMenuItem>
                        <DropdownMenuItem>Destacar cupón</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <h3 className="font-semibold">{coupon.title}</h3>
                    <p className="text-sm text-muted-foreground">{coupon.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {coupon.type === 'service' && <Sparkle className="h-4 w-4 text-muted-foreground" />}
                    {coupon.type === 'product' && <Package className="h-4 w-4 text-muted-foreground" />}
                    {coupon.type === 'course' && <GraduationCap className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm capitalize">{coupon.type}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% de descuento`
                        : `$${coupon.discountValue} de descuento`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Hasta {new Date(coupon.validUntil).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[coupon.status]}>
                      {statusLabels[coupon.status]}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(coupon.code)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {coupon.code}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Usos: {coupon.usageCount}/{coupon.usageLimit}</span>
                    <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}