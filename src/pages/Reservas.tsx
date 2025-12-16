import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, CheckCircle2, AlertCircle, Trash2, LogIn, User, Phone, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSpaces } from "@/hooks/useSpaces";
import { useUserReservations, useCreateReservation, useCancelReservation } from "@/hooks/useReservations";
import { supabase } from "@/integrations/supabase/client";

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

export default function Reservas() {
  const [searchParams] = useSearchParams();
  const preselectedSpace = searchParams.get("espaco");
  const navigate = useNavigate();

  const { user, profile, loading: authLoading } = useAuth();
  const { data: spaces, isLoading: spacesLoading } = useSpaces();
  const { data: reservations, isLoading: reservationsLoading } = useUserReservations();
  const createReservation = useCreateReservation();
  const cancelReservation = useCancelReservation();

  const [selectedSpace, setSelectedSpace] = useState(preselectedSpace || "");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [allowNotifications, setAllowNotifications] = useState(true);
  
  // Campos para nome e telefone
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  // Estado para confirmação de cancelamento
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Verificar se precisa preencher perfil
  useEffect(() => {
    if (user && profile) {
      const needsProfile = !profile.nome || !profile.telefone;
      setShowProfileForm(needsProfile);
      if (needsProfile) {
        setNome(profile.nome || "");
        setTelefone(profile.telefone || "");
      }
    }
  }, [user, profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !telefone) {
      toast.error("Preencha nome e telefone");
      return;
    }

    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ nome, telefone })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      setShowProfileForm(false);
      // Recarregar página para atualizar o perfil
      window.location.reload();
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const triggerN8nWebhook = async (reservationData: {
    reservationId: string;
    // Informações do usuário
    nome: string;
    telefone: string;
    email: string;
    // Informações do espaço
    spaceName: string;
    spaceType: string;
    spaceCapacity: number;
    spaceDescription: string | null;
    // Informações da reserva
    date: string;
    startTime: string;
    endTime: string;
    horarioCompleto: string;
    notes: string;
  }) => {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      return;
    }

    try {
      const payload = {
        // Informações do usuário
        nome: reservationData.nome,
        telefone: reservationData.telefone,
        email: reservationData.email,
        // Informações do espaço
        espaco: reservationData.spaceName,
        tipoEspaco: reservationData.spaceType,
        capacidade: reservationData.spaceCapacity,
        descricaoEspaco: reservationData.spaceDescription || "",
        // Informações da reserva
        data: reservationData.date,
        horarioInicio: reservationData.startTime,
        horarioFim: reservationData.endTime,
        horarioCompleto: reservationData.horarioCompleto,
        observacoes: reservationData.notes || "",
        reservationId: reservationData.reservationId,
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook falhou: ${response.statusText}`);
      }
    } catch (error) {
      // Erro silencioso - não mostrar para o usuário
    }
  };

  const triggerN8nCancelWebhook = async (reservationData: {
    reservationId: string;
    // Informações do usuário
    nome: string;
    telefone: string;
    email: string;
    // Informações do espaço
    spaceName: string;
    spaceType: string;
    spaceCapacity: number;
    spaceDescription: string | null;
    // Informações da reserva
    date: string;
    startTime: string;
    endTime: string;
    horarioCompleto: string;
    notes: string;
  }) => {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOKCANCEL_URL;
    
    if (!webhookUrl) {
      return;
    }

    try {
      const payload = {
        // Informações do usuário
        nome: reservationData.nome,
        telefone: reservationData.telefone,
        email: reservationData.email,
        // Informações do espaço
        espaco: reservationData.spaceName,
        tipoEspaco: reservationData.spaceType,
        capacidade: reservationData.spaceCapacity,
        descricaoEspaco: reservationData.spaceDescription || "",
        // Informações da reserva
        data: reservationData.date,
        horarioInicio: reservationData.startTime,
        horarioFim: reservationData.endTime,
        horarioCompleto: reservationData.horarioCompleto,
        observacoes: reservationData.notes || "",
        reservationId: reservationData.reservationId,
        acao: "cancelada",
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook falhou: ${response.statusText}`);
      }
    } catch (error) {
      // Erro silencioso - não mostrar para o usuário
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para fazer uma reserva");
      navigate("/auth");
      return;
    }

    // Verificar se tem nome e telefone
    if (!profile?.nome || !profile?.telefone) {
      toast.error("Por favor, complete seu perfil com nome e telefone antes de fazer uma reserva");
      setShowProfileForm(true);
      return;
    }

    if (!selectedSpace || !selectedDate || !startTime || !endTime) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (startTime >= endTime) {
      toast.error("O horário de término deve ser maior que o de início");
      return;
    }

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const dataInicio = new Date(selectedDate);
    dataInicio.setHours(startHour, startMin, 0, 0);

    const dataFim = new Date(selectedDate);
    dataFim.setHours(endHour, endMin, 0, 0);

    try {
      const reservation = await createReservation.mutateAsync({
        space_id: selectedSpace,
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
      });

      const selectedSpaceData = spaces?.find(s => s.id === selectedSpace);
      const spaceName = selectedSpaceData?.nome || "Espaço";
      
      // Se o usuário permitiu notificações, acionar webhook do n8n
      if (allowNotifications && profile?.telefone && profile?.nome) {
        const horarioCompleto = `${format(selectedDate, "dd/MM/yyyy")} das ${startTime} às ${endTime}`;
        
        await triggerN8nWebhook({
          reservationId: reservation.id,
          // Informações do usuário
          nome: profile.nome,
          telefone: profile.telefone,
          email: profile.email,
          // Informações do espaço
          spaceName: spaceName,
          spaceType: selectedSpaceData?.tipo || "",
          spaceCapacity: selectedSpaceData?.capacidade || 0,
          spaceDescription: selectedSpaceData?.descricao || null,
          // Informações da reserva
          date: format(selectedDate, "dd/MM/yyyy"),
          startTime: startTime,
          endTime: endTime,
          horarioCompleto: horarioCompleto,
          notes: notes,
        });
      }

      toast.success("Reserva realizada com sucesso!", {
        description: `${spaceName} - ${format(selectedDate, "dd/MM/yyyy")} das ${startTime} às ${endTime}`,
      });

      setSelectedSpace("");
      setSelectedDate(undefined);
      setStartTime("");
      setEndTime("");
      setNotes("");
      setAllowNotifications(true);
    } catch (error: any) {
      if (error.message?.includes("Conflito de horário")) {
        toast.error("Este espaço já está reservado neste horário");
      } else {
        toast.error("Erro ao criar reserva: " + error.message);
      }
    }
  };

  const handleCancelClick = (reservationId: string) => {
    setReservationToCancel(reservationId);
    setShowCancelDialog(true);
  };

  const handleCancelReservation = async () => {
    if (!reservationToCancel) return;

    try {
      // Buscar os dados completos da reserva antes de cancelar
      const reservation = reservations?.find(r => r.id === reservationToCancel);
      
      if (!reservation) {
        toast.error("Reserva não encontrada");
        setShowCancelDialog(false);
        setReservationToCancel(null);
        return;
      }

      // Cancelar a reserva
      await cancelReservation.mutateAsync(reservationToCancel);

      // Se o usuário tem telefone e perfil, acionar webhook de cancelamento
      if (profile?.telefone && profile?.nome && reservation.spaces) {
        const dataInicio = new Date(reservation.data_inicio);
        const dataFim = new Date(reservation.data_fim);
        const date = format(dataInicio, "dd/MM/yyyy");
        const startTime = format(dataInicio, "HH:mm");
        const endTime = format(dataFim, "HH:mm");
        const horarioCompleto = `${date} das ${startTime} às ${endTime}`;

        // Buscar informações completas do espaço
        const spaceData = spaces?.find(s => s.id === reservation.space_id);

        await triggerN8nCancelWebhook({
          reservationId: reservation.id,
          // Informações do usuário
          nome: profile.nome,
          telefone: profile.telefone,
          email: profile.email,
          // Informações do espaço
          spaceName: reservation.spaces.nome || "Espaço",
          spaceType: reservation.spaces.tipo || "",
          spaceCapacity: spaceData?.capacidade || 0,
          spaceDescription: spaceData?.descricao || null,
          // Informações da reserva
          date: date,
          startTime: startTime,
          endTime: endTime,
          horarioCompleto: horarioCompleto,
          notes: "",
        });
      }

      toast.success("Reserva cancelada com sucesso");
      setShowCancelDialog(false);
      setReservationToCancel(null);
    } catch (error: any) {
      toast.error("Erro ao cancelar reserva: " + error.message);
      setShowCancelDialog(false);
      setReservationToCancel(null);
    }
  };

  const activeReservations = reservations?.filter(r => r.status !== "cancelada") ?? [];

  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-primary">Reserve</span> seu Espaço
            </h1>
            <p className="text-lg text-muted-foreground">
              Preencha o formulário para solicitar sua reserva. 
              A confirmação será enviada por e-mail.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reservation Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Nova Reserva
                </h2>

                {!authLoading && !user && (
                  <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                    <p className="text-foreground mb-3">
                      Você precisa estar logado para fazer uma reserva.
                    </p>
                    <Link to="/auth">
                      <Button variant="accent" className="gap-2">
                        <LogIn className="w-4 h-4" />
                        Fazer Login
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Formulário de perfil */}
                {user && showProfileForm && (
                  <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Complete seu perfil
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Precisamos do seu nome e telefone para confirmar sua reserva e enviar lembretes.
                    </p>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile-nome">Nome completo *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="profile-nome"
                            type="text"
                            placeholder="Seu nome completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profile-telefone">Telefone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="profile-telefone"
                            type="tel"
                            placeholder="(79) 99999-9999"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Usaremos este número para enviar lembretes sobre sua reserva.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        variant="accent"
                        disabled={isUpdatingProfile}
                        className="w-full"
                      >
                        {isUpdatingProfile ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-accent-foreground border-t-transparent" />
                            Salvando...
                          </span>
                        ) : (
                          "Salvar e Continuar"
                        )}
                      </Button>
                    </form>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Space Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="space">Espaço *</Label>
                    <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                      <SelectTrigger id="space">
                        <SelectValue placeholder="Selecione um espaço" />
                      </SelectTrigger>
                      <SelectContent>
                        {spacesLoading ? (
                          <SelectItem value="loading" disabled>Carregando...</SelectItem>
                        ) : (
                          spaces?.map((space) => (
                            <SelectItem key={space.id} value={space.id}>
                              {space.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label>Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={ptBR}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Horário Início *</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger id="startTime">
                          <SelectValue placeholder="Início" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Horário Término *</Label>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger id="endTime">
                          <SelectValue placeholder="Término" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Conflict Warning */}
                  {startTime && endTime && startTime >= endTime && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="text-sm">O horário de término deve ser maior que o de início</span>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      placeholder="Informações adicionais sobre sua reserva..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Notifications Permission */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="notifications" className="text-sm font-semibold text-foreground cursor-pointer">
                          Permitir receber notificações e lembretes sobre as reservas?
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receba lembretes por WhatsApp sobre sua reserva, confirmações e avisos importantes.
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="notifications"
                      checked={allowNotifications}
                      onCheckedChange={setAllowNotifications}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={createReservation.isPending || !user}
                  >
                    {createReservation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-accent-foreground border-t-transparent" />
                        Processando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Confirmar Reserva
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* User Reservations */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border/50 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Minhas Reservas
                </h2>

                {!user ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <LogIn className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      Faça login para ver suas reservas
                    </p>
                    <Link to="/auth">
                      <Button variant="outline" size="sm">
                        Fazer Login
                      </Button>
                    </Link>
                  </div>
                ) : reservationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-xl">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))}
                  </div>
                ) : activeReservations.length > 0 ? (
                  <div className="space-y-4">
                    {activeReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="p-4 bg-muted/50 rounded-xl border border-border/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {reservation.spaces?.nome}
                          </h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              reservation.status === "confirmada" && "bg-success/10 text-success border-success/30",
                              reservation.status === "pendente" && "bg-warning/10 text-warning border-warning/30"
                            )}
                          >
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {format(new Date(reservation.data_inicio), "dd/MM/yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {format(new Date(reservation.data_inicio), "HH:mm")} - {format(new Date(reservation.data_fim), "HH:mm")}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                          onClick={() => handleCancelClick(reservation.id)}
                          disabled={cancelReservation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Você ainda não tem reservas
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dialog de Confirmação de Cancelamento */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
              {reservationToCancel && (() => {
                const reservation = reservations?.find(r => r.id === reservationToCancel);
                if (reservation) {
                  return (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="font-semibold text-sm mb-2">{reservation.spaces?.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(reservation.data_inicio), "dd/MM/yyyy")} - {format(new Date(reservation.data_inicio), "HH:mm")} às {format(new Date(reservation.data_fim), "HH:mm")}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCancelDialog(false);
              setReservationToCancel(null);
            }}>
              Não, manter reserva
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelReservation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelReservation.isPending}
            >
              {cancelReservation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-destructive-foreground border-t-transparent" />
                  Cancelando...
                </span>
              ) : (
                "Sim, cancelar reserva"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
