import { createContext, useContext, useState, ReactNode } from 'react';
import { initialClients } from '@/components/clients/clients-page';
import { initialTeamMembers } from '@/components/business/team-page';
import { initialServices } from '@/components/catalog/services-page';

export interface Appointment {
  id: string;
  date: Date;
  startTime: string;
  professional: string;
  clients: {
    id: string;
    isGuest?: boolean;
  }[];
  services: {
    id: string;
    deposit?: {
      type: 'fixed' | 'percentage';
      amount: number;
    };
  }[];
  notes?: string;
  extraCharge?: {
    description: string;
    amount: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppointmentContextType {
  appointments: Appointment[];
  selectedAppointments: string[];
  searchTerm: string;
  isSelectionMode: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  toggleSelectionMode: () => void;
  toggleAppointmentSelection: (id: string) => void;
  clearSelection: () => void;
  setSearchTerm: (term: string) => void;
  getFilteredAppointments: () => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Example appointments
const initialAppointments: Appointment[] = [
  {
    id: '1',
    date: new Date(),
    startTime: '10:00',
    professional: '1', // Isabella Martínez
    clients: [{ id: '1' }], // María García
    services: [{ 
      id: '1', // Maquillaje Express
      deposit: {
        type: 'fixed',
        amount: 200
      }
    }],
    status: 'confirmed', // Con depósito, por lo tanto confirmada
    notes: 'Maquillaje para evento social'
  },
  {
    id: '2',
    date: new Date(),
    startTime: '14:30',
    professional: '2', // Daniel Rodríguez
    clients: [{ id: '2' }], // Carlos Rodríguez
    services: [{ 
      id: '3' // Peinado Ondas
    }],
    status: 'pending', // Sin depósito, por lo tanto pendiente
    notes: 'Primera visita'
  },
  {
    id: '3',
    date: new Date(),
    startTime: '16:00',
    professional: '1', // Isabella Martínez
    clients: [{ id: '1' }], // María García
    services: [{ 
      id: '2' // Maquillaje Social
    }],
    status: 'cancelled',
    notes: 'Cliente canceló por emergencia'
  }
];

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const getFilteredAppointments = () => {
    if (!searchTerm) return appointments;
    
    const term = searchTerm.toLowerCase();
    return appointments.filter(appointment => {
      // Get client name
      const client = initialClients.find(c => c.id.toString() === appointment.clients[0].id);
      const clientName = client ? `${client.firstName} ${client.lastName}`.toLowerCase() : '';
      
      // Get professional name
      const professional = initialTeamMembers.find(p => p.id.toString() === appointment.professional);
      const professionalName = professional ? professional.name.toLowerCase() : '';
      
      // Get service names
      const services = appointment.services.map(s => {
        const service = initialServices.find(srv => srv.id.toString() === s.id);
        return service ? service.name.toLowerCase() : '';
      }).join(' ');

      // Search in all relevant fields
      return clientName.includes(term) ||
             professionalName.includes(term) ||
             services.includes(term) ||
             appointment.notes?.toLowerCase().includes(term) ||
             appointment.startTime.includes(term);
    });
  };
  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
    // Check if any service has a deposit
    const hasDeposit = appointmentData.services.some(service => 
      service.deposit && (
        service.deposit.type === 'fixed' ? service.deposit.amount > 0 : service.deposit.amount > 0
      )
    );

    const newAppointment: Appointment = {
      ...appointmentData,
      id: crypto.randomUUID(),
      status: hasDeposit ? 'confirmed' : 'pending',
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, appointmentData: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id
          ? { ...appointment, ...appointmentData }
          : appointment
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => !prev);
    if (isSelectionMode) {
      setSelectedAppointments([]);
    }
  };

  const toggleAppointmentSelection = (id: string) => {
    setSelectedAppointments(prev => 
      prev.includes(id) 
        ? prev.filter(appointmentId => appointmentId !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedAppointments([]);
    setIsSelectionMode(false);
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        selectedAppointments,
        isSelectionMode,
        searchTerm,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        toggleSelectionMode,
        toggleAppointmentSelection,
        clearSelection,
        setSearchTerm,
        getFilteredAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}