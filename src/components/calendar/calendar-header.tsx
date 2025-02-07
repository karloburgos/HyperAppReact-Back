import { ChevronLeft, ChevronRight, Search as SearchIcon, ListFilter, Settings, MoreHorizontal, Plus, Contact, AlarmClockCheck, CircleSlash, CopyCheck, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewAppointmentModal } from './new-appointment-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppointments } from '@/lib/appointment-context';

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarHeader({ view, onViewChange }: CalendarHeaderProps) {
  const currentMonth = new Date().toLocaleString('es', { month: 'long' });
  const pendingReminders = 3; // Example value
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { isSelectionMode, toggleSelectionMode, selectedAppointments, clearSelection } = useAppointments();
  const { searchTerm, setSearchTerm } = useAppointments();

  return (
    <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold capitalize">{currentMonth}</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {view === 'month' ? 'Mensual' : view === 'week' ? 'Semanal' : 'Diario'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onViewChange('list')}>Agenda</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('month')}>Mensual</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('week')}>Semanal</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('day')}>Diario</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-sm text-muted-foreground">
          {pendingReminders} recordatorios pendientes
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex items-center">
          {isSearching ? (
            <div className="flex items-center animate-in slide-in-from-left-5 duration-200">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px] pl-8 h-9"
                  autoFocus
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearching(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearching(true)}
              className="animate-in fade-in duration-200"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="ghost" size="icon">
          <ListFilter className="h-4 w-4" />
        </Button>
        <Button 
          variant={isSelectionMode ? "default" : "ghost"} 
          size="icon"
          onClick={toggleSelectionMode}
        >
          {isSelectionMode ? <X className="h-4 w-4" /> : <CopyCheck className="h-4 w-4" />}
        </Button>
        {isSelectionMode && selectedAppointments.length > 0 && (
          <span className="text-sm">
            {selectedAppointments.length} seleccionados
          </span>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowNewAppointmentModal(true)}>
            <Contact className="h-4 w-4 mr-2" />
            Cita para servicio
            </DropdownMenuItem>
            <DropdownMenuItem>
            <AlarmClockCheck className="h-4 w-4 mr-2" />
            Recordatorio</DropdownMenuItem>
            <DropdownMenuItem>
            <CircleSlash className="h-4 w-4 mr-2" />  
            Horario no disponible
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Importar eventos</DropdownMenuItem>
            <DropdownMenuItem>Exportar calendario</DropdownMenuItem>
            <DropdownMenuItem>Configuración de calendario</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <NewAppointmentModal
        open={showNewAppointmentModal}
        onOpenChange={setShowNewAppointmentModal}
      />
    </div>
  );
}