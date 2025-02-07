import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Pen, Phone, UserRound, Briefcase } from 'lucide-react';
import { NewProfessionalModal } from './new-professional-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { initialCategories } from '@/components/business/categories-page';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  email: string;
  image: string;
  type: 'employee' | 'professional';
  services?: {
    name: string;
    categoryColor: string;
    textColor: string;
  }[];
  calendarColor?: string;
  status?: 'active' | 'inactive';
}

export const initialTeamMembers: TeamMember[] = [
  {
  id: 1,
  name: 'Isabella Martínez',
  position: 'Maquillista',
  email: 'isabella.martinez@example.com',
  image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&auto=format&fit=crop',
  type: 'professional',
  status: 'active',
  calendarColor: 'ring-purple-500',
  services: [
    { name: 'Express', categoryColor: 'bg-blue-500', textColor: 'text-blue-500' }, // Maquillaje - azul
    { name: 'Social', categoryColor: 'bg-blue-500', textColor: 'text-blue-500' }  // Maquillaje - azul
  ]
},
{
  id: 2,
  name: 'Daniel Rodríguez',
  position: 'Peinador',
  email: 'daniel.rodriguez@example.com',
  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
  type: 'professional',
  status: 'active',
  calendarColor: 'ring-blue-500',
  services: [
    { name: 'Ondas', categoryColor: 'bg-pink-500', textColor: 'text-pink-500' }, // Peinado - rosa
    { name: 'Semirecogido', categoryColor: 'bg-pink-500', textColor: 'text-pink-500' }  // Peinado - rosa
  ]
},
];

type TabType = 'employees' | 'professionals';

export function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('professionals');
  const [showNewProfessionalModal, setShowNewProfessionalModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (activeTab) {
      case 'professionals':
        return member.type === 'professional';
      case 'employees':
        return member.type === 'employee';
      default:
        return true;
    }
  });

  const professionalsCount = teamMembers.filter(m => m.type === 'professional').length;
  const employeesCount = teamMembers.filter(m => m.type === 'employee').length;

  const handleNewProfessional = (professional: TeamMember) => {
    setTeamMembers(prev => [...prev, professional]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Equipo</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Administra tu equipo de trabajo y horarios
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-4 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar miembro
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowNewProfessionalModal(true)}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Profesional
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserRound className="h-4 w-4 mr-2" />
                  Empleado/a
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 space-y-4 min-w-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
          <TabsList>
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              Profesionales
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                {professionalsCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              Empleados
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                {employeesCount}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar miembro del equipo..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TabsContent value="professionals" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card min-w-0 relative">
                  <Avatar className={`h-12 w-12 ring-2 ring-offset-2 ${member.calendarColor} ring-offset-background`}>
                    <AvatarImage src={member.image} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{member.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{member.position}</p>
                        {member.type === 'professional' && member.services && (
                          <div className="flex flex-wrap gap-1 mt-2 max-w-full">
                            {member.services.map((service, index) => (
                              <span
                                key={index}
                                className={`text-xs px-2 py-0.5 rounded-full ${service.categoryColor} bg-opacity-20 ${service.textColor}`}
                              >
                                {service.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar mensaje
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pen className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="employees" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card min-w-0 relative">
                  <Avatar className={`h-12 w-12 ring-2 ring-offset-2 ${member.calendarColor} ring-offset-background`}>
                    <AvatarImage src={member.image} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{member.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{member.position}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar mensaje
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pen className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <NewProfessionalModal
        open={showNewProfessionalModal}
        onOpenChange={setShowNewProfessionalModal}
        onSave={handleNewProfessional}
      />
    </div>
  );
}