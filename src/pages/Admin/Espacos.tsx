import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  Users2, 
  Presentation, 
  FlaskConical,
  Shield,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { 
  useAllSpaces, 
  useCreateSpace, 
  useUpdateSpace, 
  useDeleteSpace,
  type Space 
} from "@/hooks/useSpaces";

const spaceTypes = [
  { value: "sala", label: "Sala", icon: Building2 },
  { value: "coworking", label: "Coworking", icon: Users2 },
  { value: "auditorio", label: "Auditório", icon: Presentation },
  { value: "laboratorio", label: "Laboratório", icon: FlaskConical },
];

export default function AdminEspacos() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
  const { data: spaces, isLoading: isLoadingSpaces } = useAllSpaces();
  const createSpace = useCreateSpace();
  const updateSpace = useUpdateSpace();
  const deleteSpace = useDeleteSpace();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "sala" as "sala" | "coworking" | "auditorio" | "laboratorio",
    capacidade: "",
    descricao: "",
    imagem_url: "",
    preco_hora: "",
    ativo: true,
  });

  // Redirecionar se não for admin
  if (!isLoadingAdmin && !isAdmin) {
    navigate("/");
    return null;
  }

  const handleOpenDialog = (space?: Space) => {
    if (space) {
      setEditingSpace(space);
      setFormData({
        nome: space.nome,
        tipo: space.tipo,
        capacidade: space.capacidade.toString(),
        descricao: space.descricao || "",
        imagem_url: space.imagem_url || "",
        preco_hora: space.preco_hora?.toString() || "",
        ativo: space.ativo,
      });
    } else {
      setEditingSpace(null);
      setFormData({
        nome: "",
        tipo: "sala",
        capacidade: "",
        descricao: "",
        imagem_url: "",
        ativo: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSpace(null);
    setFormData({
      nome: "",
      tipo: "sala",
      capacidade: "",
      descricao: "",
      imagem_url: "",
      preco_hora: "",
      ativo: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.capacidade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const capacidade = parseInt(formData.capacidade);
    if (isNaN(capacidade) || capacidade <= 0) {
      toast.error("Capacidade deve ser um número positivo");
      return;
    }

    try {
      if (editingSpace) {
        await updateSpace.mutateAsync({
          id: editingSpace.id,
          nome: formData.nome,
          tipo: formData.tipo,
          capacidade,
          descricao: formData.descricao || null,
          imagem_url: formData.imagem_url || null,
          preco_hora: formData.preco_hora ? parseFloat(formData.preco_hora) : null,
          ativo: formData.ativo,
        });
        toast.success("Espaço atualizado com sucesso!");
      } else {
        await createSpace.mutateAsync({
          nome: formData.nome,
          tipo: formData.tipo,
          capacidade,
          descricao: formData.descricao || null,
          imagem_url: formData.imagem_url || null,
          ativo: formData.ativo,
        });
        toast.success("Espaço criado com sucesso!");
      }
      handleCloseDialog();
    } catch (error: any) {
      toast.error("Erro ao salvar espaço: " + error.message);
    }
  };

  const handleDeleteClick = (spaceId: string) => {
    setSpaceToDelete(spaceId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!spaceToDelete) return;

    try {
      await deleteSpace.mutateAsync(spaceToDelete);
      toast.success("Espaço deletado com sucesso!");
      setIsDeleteDialogOpen(false);
      setSpaceToDelete(null);
    } catch (error: any) {
      toast.error("Erro ao deletar espaço: " + error.message);
    }
  };

  if (isLoadingAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  <span className="text-primary">Admin</span> - Espaços
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Gerencie os espaços disponíveis para locação
              </p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Espaço
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoadingSpaces ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/50 p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : spaces && spaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => {
                const typeInfo = spaceTypes.find((t) => t.value === space.tipo);
                const Icon = typeInfo?.icon || Building2;

                return (
                  <div
                    key={space.id}
                    className={cn(
                      "bg-card rounded-2xl border p-6 transition-all",
                      space.ativo
                        ? "border-border/50 hover:border-primary/50"
                        : "border-destructive/30 bg-muted/30 opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            {space.nome}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "mt-1",
                              space.ativo
                                ? "bg-success/10 text-success border-success/30"
                                : "bg-destructive/10 text-destructive border-destructive/30"
                            )}
                          >
                            {space.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users2 className="w-4 h-4" />
                        Capacidade: {space.capacidade} pessoas
                      </div>
                      {space.descricao && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {space.descricao}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog(space)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteClick(space.id)}
                        disabled={deleteSpace.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum espaço cadastrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Comece criando seu primeiro espaço
              </p>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Primeiro Espaço
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Dialog de Criar/Editar */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSpace ? "Editar Espaço" : "Novo Espaço"}
            </DialogTitle>
            <DialogDescription>
              {editingSpace
                ? "Atualize as informações do espaço"
                : "Preencha os dados para criar um novo espaço"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">
                  Nome do Espaço <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Sala de Reunião Alpha"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">
                  Tipo <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, tipo: value })
                  }
                >
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {spaceTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidade">
                  Capacidade <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="capacidade"
                  type="number"
                  min="1"
                  value={formData.capacidade}
                  onChange={(e) =>
                    setFormData({ ...formData, capacidade: e.target.value })
                  }
                  placeholder="Ex: 10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagem_url">URL da Imagem</Label>
                <Input
                  id="imagem_url"
                  type="url"
                  value={formData.imagem_url}
                  onChange={(e) =>
                    setFormData({ ...formData, imagem_url: e.target.value })
                  }
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Descreva o espaço, equipamentos disponíveis, etc."
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) =>
                  setFormData({ ...formData, ativo: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <Label htmlFor="ativo" className="cursor-pointer">
                Espaço ativo (visível para reservas)
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createSpace.isPending || updateSpace.isPending
                }
              >
                {createSpace.isPending || updateSpace.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : editingSpace ? (
                  "Atualizar"
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Espaço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O espaço será permanentemente
              removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setSpaceToDelete(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSpace.isPending}
            >
              {deleteSpace.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

