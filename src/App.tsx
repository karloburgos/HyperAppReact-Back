import { ThemeProvider } from '@/components/theme-provider';
import { Layout } from '@/components/layout';
import { Toaster } from '@/components/ui/sonner';
import { AppointmentProvider } from '@/lib/appointment-context';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="salon-theme">
      <AppointmentProvider>
      <Layout />
      <Toaster />
      </AppointmentProvider>
    </ThemeProvider>
  );
}

export default App;