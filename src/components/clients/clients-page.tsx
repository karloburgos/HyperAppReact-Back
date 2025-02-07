import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, MoreHorizontal, Mail, Phone, Star, DollarSign, Users, Facebook, Instagram, Twitter, Crown } from 'lucide-react';
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
import { NewClientDrawer, ClientFormData } from './new-client-drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { obtenerClientes, crearCliente } from '../../api';

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
};

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  socialNetworks: { type: string; username: string; }[];
  email: string;
  birthDate: string;
  origin: string;
  relatedClient: string;
  country: string;
  totalSpent: number;
  totalVisits: number;
  reviews: number;
  status: 'active' | 'inactive';
  membershipType: 'VIP' | 'Premium' | 'Deluxe';
  image?: string;
}

export const initialClients: Client[] = [{
  id: 1,
  firstName: 'María',
  lastName: 'García',
  countryCode: '+52',
  phone: '555 123 4567',
  socialNetworks: [
    { type: 'facebook', username: 'maria.garcia' },
    { type: 'instagram', username: '@maria.g' }
  ],
  email: 'maria.garcia@email.com',
  birthDate: '1990-05-15',
  origin: 'Recomendación',
  relatedClient: 'Ana López',
  country: 'mx',
  totalSpent: 4500,
  totalVisits: 12,
  reviews: 4,
  status: 'active',
  membershipType: 'VIP',
  image: '',
},
{
  id: 2,
  firstName: 'Carlos',
  lastName: 'Rodríguez',
  countryCode: '+52',
  phone: '555 987 6543',
  socialNetworks: [
    { type: 'instagram', username: '@carlos.rdz' },
  ],
  email: 'carlos.rodriguez@email.com',
  birthDate: '1988-08-20',
  origin: 'Redes Sociales',
  relatedClient: 'María García',
  country: 'mx',
  totalSpent: 3200,
  totalVisits: 8,
  reviews: 3,
  status: 'active',
  membershipType: 'Premium',
  image: '',
}
];

const membershipColors = {
  VIP: 'bg-purple-500/10 text-purple-500',
  Premium: 'bg-purple-500/10 text-purple-500',
  Deluxe:'bg-purple-500/10 text-purple-500',
};

type TabType = 'todos' | 'membresia' | 'inactivos' | 'premium';

export function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    obtenerClientes().then(setClients);
  }, []);

  const handleSelectAll = (checked: boolean) => {
    setSelectedClients(checked ? filteredClients.map(client => client.id) : []);
  };

  const handleSelectClient = (clientId: number, checked: boolean) => {
    setSelectedClients(prev => 
      checked ? [...prev, clientId] : prev.filter(id => id !== clientId)
    );
  };

  // //Fetch
  // useEffect(() => {
  //   fetch('/../api/clients') // src api clientes
  //     .then(response => response.json())
  //     .then(data => setClients(data))
  //     .catch(error => console.error('Error fetching clients:', error));
  // }, []);

  const handleNewClient = async (clientData: ClientFormData) => {
    const newClient = {
      id: clients.length + 1,
      firstName: clientData.firstName || '',
      lastName: clientData.lastName || '',
      countryCode: clientData.countryCode || '+52',
      phone: clientData.phone || '',
      socialNetworks: clientData.socialNetworks || [],
      email: clientData.email || '',
      birthDate: clientData.birthDate ? clientData.birthDate.toISOString() : '',
      origin: clientData.origin || '',
      relatedClient: clientData.relatedClient || '',
      country: clientData.country || '',
      totalSpent: 0,
      totalVisits: 0,
      reviews: 0,
      status: 'active',
      membershipType: 'Deluxe',
      image: clientData.avatar,
    };

    const response = await fetch('/../api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    });
  
    if (response.ok) {
      const createdClient = await response.json();
      setClients(prev => [...prev, createdClient]);
    } else {
      console.error('Error adding client');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
                         
    if (!matchesSearch) return false;
    
    switch (activeTab) {
      case 'todos':
        return client.status === 'active';
      case 'inactivos':
        return client.status === 'inactive';
      case 'premium':
        return client.membershipType === 'Premium';
      default:
        return true;
    }
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col gap-4 p-4">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Lista de clientes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ver, añadir, editar y eliminar información del cliente.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <NewClientDrawer onClientSaved={handleNewClient}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </NewClientDrawer>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  Todos los clientes
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {clients.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="memberships" className="flex items-center gap-2">
                  Membresías
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {clients.filter(c => c.membershipType !== 'Deluxe').length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
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
                      checked={selectedClients.length === filteredClients.length}
                      className="checkbox"
                      onCheckedChange={handleSelectAll}/>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="hidden lg:table-cell">Redes Sociales</TableHead>
                  <TableHead className="hidden lg:table-cell">Origen</TableHead>
                  <TableHead className="text-left">Estadísticas</TableHead>
                  <TableHead className="w-[100px] text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        className="checkbox"
                        onCheckedChange={(checked) => handleSelectClient(client.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={client.image} />
                        <AvatarFallback>
                          {client.firstName[0]}{client.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{client.firstName} {client.lastName}</p>
                        <Badge className={`badge ${membershipColors[client.membershipType]}`}>
                          {client.membershipType.charAt(0).toUpperCase() + client.membershipType.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{client.countryCode} {client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex gap-1">
                        {client.socialNetworks.map((network, index) => {
                          const Icon = socialIcons[network.type as keyof typeof socialIcons];
                          return Icon ? (
                            <Button key={index} variant="ghost" size="icon" className="h-8 w-8">
                              <Icon className="h-4 w-4" />
                            </Button>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <Badge variant="outline" className="badge">{client.origin}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="space-y-1">
                        <div className="flex items-center justify-start gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${client.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{client.totalVisits} visitas</span>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span>{client.reviews} reseñas</span>
                        </div>
                      </div>
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
                            <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                            <DropdownMenuItem>Enviar mensaje</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}