import {
ListChecks, Tag, Star, Globe, Gift, BarChart3, Target, Receipt, CreditCard, Crown, FileText, UserPlus, Clock, GraduationCap, Store, Palette, Calendar, HelpCircle, Home, MessageCircle, Megaphone, DollarSign, Users, BookOpen, Plus, Settings, BadgeInfo, UserRound, UsersRound, Landmark, Sparkle, ShoppingCart   
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  label: string;
  page?: string;
  icon?: any;
  description?: string;
}

const menuItems = [
  { icon: Home, label: "Inicio", page: "home" },
  {
    icon: Calendar,
    label: "Agenda",
    page: "calendar",
    submenu: [
      { label: "Citas", page: "calendar", icon: Calendar, description: "Gestiona las citas y horarios" },
      { label: "Solicitudes", page: "requests", icon: ListChecks, description: "Revisa las solicitudes pendientes" },
      { label: "Etiquetas", page: "tags", icon: Tag, description: "Organiza con etiquetas personalizadas" }
    ],
  },
  {
    icon: MessageCircle,
    label: "Mensajes",
    page: "messages",
    submenu: [
      { label: "Embudo", page: "sales-messages", icon: DollarSign, description: "Mensajes relacionados con ventas" },
      { label: "Chat", page: "chat", icon: MessageCircle, description: "Chat en tiempo real" }
    ],
  },
  {
    icon: Megaphone,
    label: "Publicidad",
    page: "marketing",
    submenu: [
      { label: "Cupones", page: "coupons", icon: Tag, description: "Gestiona cupones de descuento" },
      { label: "Ofertas", page: "offers", icon: DollarSign, description: "Crea y administra ofertas" },
      { label: "Campañas", page: "campaigns", icon: Megaphone, description: "Campañas de marketing" },
      { label: "Reseñas", page: "reviews", icon: Star, description: "Gestiona las reseñas de clientes" },
      { label: "Posicionamiento web", page: "seo", icon: Globe, description: "Optimización para buscadores" },
      { label: "Giftcards", page: "giftcards", icon: Gift, description: "Tarjetas de regalo" }
    ],
  },
  {
    icon: DollarSign,
    label: "Finanzas",
    page: "finances",
    submenu: [
      { label: "Resumen", page: "finance-summary", icon: BarChart3, description: "Resumen financiero" },
      { label: "Ingresos", page: "income", icon: DollarSign, description: "Gestión de ingresos" },
      { label: "Metas", page: "goals", icon: Target, description: "Objetivos financieros" },
      { label: "Gastos", page: "expenses", icon: Receipt, description: "Control de gastos" },
      { label: "Impuestos", page: "taxes", icon: Landmark, description: "Gestión de impuestos" },
      { label: "Cortes de caja", page: "cash-cuts", icon: CreditCard, description: "Cortes y cierres" }
    ],
  },
  {
    icon: UserRound,
    label: "Clientes",
    page: "clients",
    submenu: [
      { label: "Lista de clientes", page: "clients", icon: UsersRound, description: "Gestiona tus clientes" },
      { label: "Membresías", page: "memberships", icon: Crown, description: "Planes y membresías" },
      { label: "Formularios", page: "forms", icon: FileText, description: "Formularios personalizados" },
      { label: "Prospectos", page: "prospects", icon: UserPlus, description: "Gestión de prospectos" }
    ],
  },
  {
    icon: BookOpen,
    label: "Catálogo",
    page: "catalog",
    submenu: [
      { label: "Servicios", page: "services", icon: Sparkle, description: "Gestiona tus servicios" },
      { label: "Productos", page: "products", icon: ShoppingCart, description: "Inventario de productos" },
      { label: "Cursos", page: "courses", icon: GraduationCap, description: "Cursos y capacitaciones" }
    ],
  },
  {
    icon: Store,
    label: "Negocio",
    page: "business",
    submenu: [
      { label: "Información", page: "business-info", icon: BadgeInfo, description: "Datos del negocio" },
      { label: "Agenda", page: "business-calendar", icon: Calendar, description: "Horarios del negocio" },
      { label: "Equipo", page: "team", icon: Users, description: "Gestión del personal" },
      { label: "Perfil en línea", page: "online-profile", icon: Globe, description: "Presencia en línea" },
      { label: "Venta", page: "business-sale", icon: Receipt, description: "Venta del negocio" },
      { label: "Categorías", page: "categories", icon: Palette, description: "Gestión de categorías" }
    ],
  },
];

function MenuItem({
  icon: Icon,
  label,
  page,
  submenu,
  setSecondaryNav,
  secondaryNav,
  currentPage,
  onPageChange,
}: {
  icon: any;
  label: string;
  page?: string;
  submenu?: SubMenuItem[];
  setSecondaryNav: (submenu: SubMenuItem[] | null) => void;
  secondaryNav: SubMenuItem[] | null;
  currentPage: string;
  onPageChange: (page: string) => void;
}) {
  const handleClick = () => {
    setSecondaryNav(secondaryNav === submenu ? null : submenu);
    if (page) {
      if (submenu && submenu.length > 0) {
        onPageChange(submenu[0].page || page);
      } else {
        onPageChange(page);
      }
    } else if (submenu && submenu.length > 0) {
      onPageChange(submenu[0].page || '');
    }
  };

  const isSelected = page === currentPage;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-full h-10 relative transition-colors",
            isSelected && "bg-primary/10 text-primary hover:bg-primary/20"
          )}
          onClick={handleClick}
        >
          <Icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-tooltip text-tooltip-foreground">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface NavigationProps {
  currentPage: string;
}

export function Navigation({ currentPage }: NavigationProps) {
  const [secondaryNav, setSecondaryNav] = useState<SubMenuItem[] | null>(null);

  const handlePageChange = useCallback((page: string) => {
    window.dispatchEvent(
      new CustomEvent('pageChange', { detail: { page } })
    );
  }, []);

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Primary Nav */}
        <nav className="flex w-20 flex-col border-r bg-background">
          <div className="flex flex-col flex-1 p-4">
            <Button className="mb-6 w-full h-10" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              {menuItems.map(({ icon: Icon, label, page, submenu }) => (
                <MenuItem
                  key={label}
                  icon={Icon}
                  label={label}
                  page={page}
                  submenu={submenu}
                  setSecondaryNav={setSecondaryNav}
                  secondaryNav={secondaryNav}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              ))}
            </div>
            <div className="space-y-1 mt-auto">
              <MenuItem
                icon={HelpCircle}
                label="Ayuda"
                page="help"
                setSecondaryNav={setSecondaryNav}
                secondaryNav={secondaryNav}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              <MenuItem
                icon={Settings}
                label="Ajustes"
                page="settings"
                submenu={[
                  { label: "Mi cuenta", page: "my-account" },
                  { label: "Notificaciones", page: "notifications" },
                  { label: "Seguridad y contraseña", page: "security" },
                  { label: "Pagos", page: "payments" },
                  { label: "Permisos de la app", page: "app-permissions" },
                  { label: "Permisos de usuario", page: "user-permissions" },
                  { label: "Widgets", page: "widgets" }
                ]}
                setSecondaryNav={setSecondaryNav}
                secondaryNav={secondaryNav}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </nav>

        {/* Secondary Nav */}
        {secondaryNav && (
          <nav className="w-[280px] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="p-4 space-y-4">
              {secondaryNav.map((item) => {
                const isSelected = item.page === currentPage;
                return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm h-auto px-4 py-2 relative transition-colors",
                    isSelected && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                  onClick={() => {
                    if (item.page) {
                      handlePageChange(item.page);
                      setSecondaryNav(null);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <div className="flex items-center">
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </div>
                </Button>
              )})}
            </div>
          </nav>
        )}
      </div>
    </TooltipProvider>
  );
}
