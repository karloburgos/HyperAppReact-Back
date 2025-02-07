import { createContext, useContext, useState } from 'react';
import { Appointment } from '@/lib/appointment-context';

interface AppointmentState {
  selectedAppointment: {
    appointment: Appointment;
    position: { x: number; y: number };
  } | null;
  setSelectedAppointment: (data: { appointment: Appointment; position: { x: number; y: number; } } | null) => void;
}

const AppointmentContext = createContext<AppointmentState | undefined>(undefined);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [selectedAppointment, setSelectedAppointment] = useState<{
    appointment: Appointment;
    position: { x: number; y: number };
  } | null>(null);

  return (
    <AppointmentContext.Provider value={{ selectedAppointment, setSelectedAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointmentState() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentState must be used within an AppointmentProvider');
  }
  return context;
}