import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CalendarPage from '@/components/calendar/calendar-page';
import { ClientsPage } from '@/components/clients/clients-page';
import { ServicesPage } from '@/components/catalog/services-page';
import { IncomePage } from '@/components/finances/income-page';
import { TeamPage } from '@/components/business/team-page';
import { CouponsPage } from '@/components/marketing/coupons-page';
import { CategoriesPage } from '@/components/business/categories-page';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('clients');

  useEffect(() => {
    const handlePageChange = (event: CustomEvent) => {
      setCurrentPage(event.detail.page);
    };

    window.addEventListener('pageChange' as any, handlePageChange);
    return () => window.removeEventListener('pageChange' as any, handlePageChange);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navigation currentPage={currentPage} />
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden absolute left-4 top-[1.4rem]">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <Navigation currentPage={currentPage} />
          </SheetContent>
        </Sheet>

        <main className="flex-1">
          {currentPage === 'calendar' && <CalendarPage />}
          {currentPage === 'clients' && <ClientsPage />}
          {currentPage === 'services' && <ServicesPage />}
          {currentPage === 'income' && <IncomePage />}
          {currentPage === 'team' && <TeamPage />}
          {currentPage === 'coupons' && <CouponsPage />}
          {currentPage === 'categories' && <CategoriesPage />}
        </main>
      </div>
    </div>
  );
}