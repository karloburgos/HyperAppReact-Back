import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Banknote, CreditCard, Gift, MoreHorizontal, Pencil, CirclePlus, CircleCheckBig, Trash2, Users, ArrowLeftRight, DollarSign, Sparkle, Package, Ticket, HeartHandshake, SplitSquareHorizontal, MessageCirclePlus, Tags, Clock, BadgeDollarSign, CirclePercent, GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment } from '@/lib/appointment-context';
import { initialClients } from '@/components/clients/clients-page';
import { initialTeamMembers } from '@/components/business/team-page';
import { initialServices } from '@/components/catalog/services-page';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
}

interface PaymentMethod {
  id: string;
  type: 'cash' | 'card' | 'transfer' | 'gift';
  amount: number;
}

interface PaymentSummary {
  subtotal: number;
  deposit: number;
  discount: number;
  tax: number;
  tip: number;
  total: number;
}

export default function PaymentModal({ open, onOpenChange, appointment }: PaymentModalProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [splitPayment, setSplitPayment] = useState(false);
  const [tip, setTip] = useState(0);

  // Get client and service details
  const clients = appointment.clients.map(client => 
    initialClients.find(c => c.id.toString() === client.id)
  );

  const services = appointment.services.map(service => {
    const serviceDetails = initialServices.find(s => s.id === parseInt(service.id));
    const professional = initialTeamMembers.find(p => p.id.toString() === appointment.professional);
    return {
      ...serviceDetails,
      professional,
      deposit: service.deposit
    };
  });

  // Calculate payment summary
  const calculateSummary = (): PaymentSummary => {
    const subtotal = services.reduce((total, service) => total + (service?.price || 0), 0);
    const deposit = services.reduce((total, service) => {
      if (service?.deposit) {
        if (service.deposit.type === 'fixed') {
          return total + service.deposit.amount;
        } else {
          return total + ((service?.price || 0) * service.deposit.amount / 100);
        }
      }
      return total;
    }, 0);
    const discount = 0; // Implement discount logic
    const tax = (subtotal - deposit - discount) * 0.16;
    const total = subtotal - deposit - discount + tax + tip;

    return {
      subtotal,
      deposit,
      discount,
      tax,
      tip,
      total
    };
  };

  const summary = calculateSummary();

  const handlePaymentMethodSelect = (type: 'cash' | 'card' | 'transfer' | 'gift') => {
    if (splitPayment) {
      const newMethod: PaymentMethod = {
        id: crypto.randomUUID(),
        type,
        amount: 0
      };
      setPaymentMethods(prev => [...prev, newMethod]);
    } else {
      setPaymentMethods([{
        id: crypto.randomUUID(),
        type,
        amount: summary.total
      }]);
    }
  };

  const handlePaymentMethodAmountChange = (id: string, amount: number) => {
    setPaymentMethods(prev => prev.map(method =>
      method.id === id ? { ...method, amount } : method
    ));
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleTipChange = (amount: number) => {
    setTip(amount);
  };

  const handlePayment = () => {
    const totalPaid = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    
    if (totalPaid !== summary.total) {
      toast.error('El monto total no coincide con el pago');
      return;
    }

    toast.success('Venta realizada exitosamente');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 h-full">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 border-b">
            <SheetHeader>
              <SheetTitle>Cobrar cita</SheetTitle>
            </SheetHeader>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Clients */}
            <div className="p-4 space-y-4">
              <Label>Clientes</Label>
              <div className="space-y-2">
                {clients.map((client, index) => (
                  client && (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={client.image} />
                        <AvatarFallback>
                          {client.firstName[0]}{client.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {client.countryCode} {client.phone}
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="p-4 space-y-4">
              <Label>Servicios</Label>
              <div className="space-y-2">
                {services.map((service, index) => (
                  service && (
                    <div 
                      key={index} 
                      className="group flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-1 h-10 rounded-full',
                          service.professional?.calendarColor?.replace('ring-', 'bg-')
                        )} />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <div className="flex grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{service.duration}</span>
                              </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{service.professional?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Add buttons */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button
                          variant="ghost"
                          className="w-full mt-2 text-sm"
                        >
                          <CirclePlus className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Sparkle className="h-4 w-4 mr-2" />
                    Servicio
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="h-4 w-4 mr-2" />
                    Producto
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Curso
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Cargo extra
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>


            {/* Payment Methods */}
            <div className="p-4 space-y-4">
              <Label>Método de pago</Label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-4",
                    paymentMethods.some(m => m.type === 'cash') && "bg-primary/10 text-primary hover:bg-primary/20 border-primary"
                  )}
                  onClick={() => handlePaymentMethodSelect('cash')}
                >
                  <Banknote className="h-5 w-5" />
                  <span className="truncate w-full text-center">Efectivo</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-4",
                    paymentMethods.some(m => m.type === 'card') && "bg-primary/10 text-primary hover:bg-primary/20 border-primary"
                  )}
                  onClick={() => handlePaymentMethodSelect('card')}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="truncate w-full text-center">Tarjeta</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-4",
                    paymentMethods.some(m => m.type === 'transfer') && "bg-primary/10 text-primary hover:bg-primary/20 border-primary"
                  )}
                  onClick={() => handlePaymentMethodSelect('transfer')}
                >
                  <ArrowLeftRight className="h-5 w-5" />
                  <span className="truncate w-full text-center">Transferencia</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "flex flex-col items-center gap-2 h-auto py-4",
                    paymentMethods.some(m => m.type === 'gift') && "bg-primary/10 text-primary hover:bg-primary/20 border-primary"
                  )}
                  onClick={() => handlePaymentMethodSelect('gift')}
                >
                  <Gift className="h-5 w-5" />
                  <span className="truncate w-full text-center">Tarjeta de regalo</span>
                </Button>
              </div>

              {/* Payment Methods List */}
              {paymentMethods.length > 0 && (
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      {method.type === 'cash' && <Banknote className="h-4 w-4" />}
                      {method.type === 'card' && <CreditCard className="h-4 w-4" />}
                      {method.type === 'transfer' && <ArrowLeftRight className="h-4 w-4" />}
                      {method.type === 'gift' && <Gift className="h-4 w-4" />}
                      <div className="flex-1">
                        <p className="font-medium capitalize">{method.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={method.amount}
                          onChange={(e) => handlePaymentMethodAmountChange(method.id, parseFloat(e.target.value))}
                          className="w-24"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePaymentMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-4 space-y-4">
            <div className="p-4 space-y-4 bg-accent/50 border rounded-lg">
              <Label>Resumen</Label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                {summary.deposit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Anticipo</span>
                    <span>-${summary.deposit.toFixed(2)}</span>
                  </div>
                )}
                {summary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Descuento</span>
                    <span>-${summary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (16%)</span>
                  <span>${summary.tax.toFixed(2)}</span>
                </div>
                {summary.tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Propina</span>
                    <span>${summary.tip.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
           <div className="p-8 space-y-8">
              </div>
          </div>
        </div>
           </div>

       <div className="border-t p-4 flex justify-end gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 absolute bottom-0 left-0 right-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="w-auto" 
                size="lg"
                variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSplitPayment(!splitPayment)}>
                <SplitSquareHorizontal className="h-4 w-4 mr-2" />
                Dividir pago
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCirclePlus className="h-4 w-4 mr-2" />
                Agregar comentario
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BadgeDollarSign className="h-4 w-4 mr-2" />
                Agregar propina
              </DropdownMenuItem>
               <DropdownMenuItem>
                <Ticket className="h-4 w-4 mr-2" />
                Aplicar cupón
              </DropdownMenuItem>
               <DropdownMenuItem>
                <CirclePercent className="h-4 w-4 mr-2" />
                Aplicar promoción
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handlePayment}>
            <CircleCheckBig className="h-4 w-4 mr-2" />
            Realizar venta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { PaymentModal }