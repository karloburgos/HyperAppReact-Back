import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, EyeOff, Settings } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { initialTeamMembers } from '../business/team-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CalendarSidebar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showProfessionals, setShowProfessionals] = useState(true);
  const [showReminders, setShowReminders] = useState(true);
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Llamar a cliente pendiente', completed: false },
    { id: 2, text: 'Confirmar cita de mañana', completed: false },
    { id: 3, text: 'Revisar inventario', completed: true },
  ]);
  
  const professionals = initialTeamMembers.filter(member => 
    member.type === 'professional' && member.status === 'active'
  );

  const toggleReminder = (id: number) => {
    setReminders(prev => prev.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const addReminder = () => {
    const newReminder = {
      id: reminders.length + 1,
      text: 'Nuevo recordatorio',
      completed: false
    };
    setReminders(prev => [...prev, newReminder]);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="rounded-lg border">
          <Calendar
            className="p-3"
            mode="single"
            selected={date}
            onSelect={setDate}
          />
        </div>

        <Collapsible
          open={showProfessionals}
          onOpenChange={setShowProfessionals}
          className="space-y-2"
        >
          <div className="flex items-center justify-between group">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                {showProfessionals ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <h3 className="font-medium">Profesionales</h3>
              </div>
            </CollapsibleTrigger>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('pageChange', { detail: { page: 'team' } })
                  );
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem><EyeOff className="h-4 w-4 mr-2" />Ocultar todas las agendas</DropdownMenuItem>
                  <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Configuración de profesionales</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CollapsibleContent className="space-y-4">
            {professionals.map((pro) => (
              <div key={pro.id} className="flex items-center gap-2 group">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Avatar className={`h-8 w-8 ring-2 ring-offset-2 ${pro.calendarColor} ring-offset-background`}>
                    <AvatarImage src={pro.image} />
                    <AvatarFallback>{pro.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm truncate">{pro.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{pro.position}</span>
                  </div>
                  </div>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={showReminders}
          onOpenChange={setShowReminders}
          className="space-y-2"
        >
          <div className="flex items-center justify-between group">
            <CollapsibleTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                {showReminders ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <h3 className="font-medium">Recordatorios</h3>
              </div>
            </CollapsibleTrigger>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={addReminder}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Ocultar todos los recordatorios
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar recordatorios
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CollapsibleContent className="space-y-2">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-start gap-2 group">
                <Checkbox 
                  checked={reminder.completed}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                />
                <span className={`text-sm ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {reminder.text}
                </span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
  );
}