import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Pet, PetDocument } from "@/types/api";
import {
  ArrowLeft,
  Camera,
  FileText,
  Loader2,
  PawPrint,
  Save,
  Trash2,
  Upload,
  AlertTriangle,
} from "lucide-react";

const DashboardPetEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [documents, setDocuments] = useState<PetDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: "",
    raca: "",
    peso: "",
    aniversario: "",
    frequenta_creche: false,
    adestrado: false,
    castrado: false,
    alimentacao: "",
    observacoes: "",
  });

  const loadPet = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.getPet(id);
      setPet(data);
      setFormData({
        nome: data.nome,
        raca: data.raca,
        peso: String(data.peso),
        aniversario: data.aniversario || "",
        frequenta_creche: data.frequenta_creche,
        adestrado: data.adestrado,
        castrado: data.castrado,
        alimentacao: data.alimentacao || "",
        observacoes: data.observacoes || "",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel carregar o pet.",
        variant: "destructive",
      });
      navigate("/dashboard/pets");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  const loadDocuments = useCallback(async () => {
    if (!id) return;
    setLoadingDocs(true);
    try {
      const data = await api.listPetDocuments(id);
      setDocuments(data || []);
    } catch {
      // ignore
    } finally {
      setLoadingDocs(false);
    }
  }, [id]);

  useEffect(() => {
    loadPet();
    loadDocuments();
  }, [loadPet, loadDocuments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await api.updatePet(id, {
        nome: formData.nome,
        raca: formData.raca,
        peso: parseFloat(formData.peso),
        aniversario: formData.aniversario || undefined,
        frequenta_creche: formData.frequenta_creche,
        adestrado: formData.adestrado,
        castrado: formData.castrado,
        alimentacao: formData.alimentacao || undefined,
        observacoes: formData.observacoes || undefined,
      });
      toast({
        title: "Pet atualizado!",
        description: "Os dados do seu pet foram salvos.",
      });
      await loadPet();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar pet",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id || !user?.email) return;

    setUploadingPhoto(true);
    try {
      const url = await api.uploadPetPhoto(user.email, id, file);
      // Persist that the pet has a photo
      await api.updatePet(id, {
        nome: formData.nome,
        raca: formData.raca,
        peso: parseFloat(formData.peso) || pet?.peso || 0,
        aniversario: formData.aniversario || undefined,
        frequenta_creche: formData.frequenta_creche,
        adestrado: formData.adestrado,
        castrado: formData.castrado,
        alimentacao: formData.alimentacao || undefined,
        observacoes: formData.observacoes || undefined,
        foto: url,
      });
      setPhotoVersion((v) => v + 1);
      await loadPet();
      toast({ title: "Foto enviada!", description: "A foto do pet foi atualizada." });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Nao foi possivel enviar a foto.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setUploadingDoc(true);
    try {
      await api.uploadPetDocument(id, file);
      await loadDocuments();
      toast({ title: "Documento enviado!", description: file.name });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message || "Nao foi possivel enviar o documento.",
        variant: "destructive",
      });
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  const handleDeleteDoc = async (doc: PetDocument) => {
    if (!id) return;
    if (!confirm(`Excluir o documento "${doc.name}"?`)) return;
    try {
      await api.deletePetDocument(id, doc.name);
      await loadDocuments();
      toast({ title: "Documento excluido" });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Nao foi possivel excluir.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const hasPhoto = !!pet?.foto;
  const photoUrl =
    user?.email && id
      ? `${api.getPetPhotoUrl(user.email, id)}?v=${photoVersion}`
      : "";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/dashboard/pets">
            <ArrowLeft className="w-4 h-4" />
            Voltar para meus pets
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <PawPrint className="w-7 h-7 text-primary" />
            Editar Pet
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Atualize as informacoes, foto e documentos do seu pet
          </p>
        </div>

        {!hasPhoto && (
          <Card className="mb-6 border-2 border-honey-gold/50 bg-honey-gold/5">
            <CardContent className="py-4 px-4 sm:px-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-honey-dark flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-honey-dark mb-1">
                    Pet sem foto cadastrada
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Pets sem foto nao podem fazer reservas. Adicione uma foto
                    abaixo para liberar as reservas para este pet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Foto do Pet
            </CardTitle>
            <CardDescription>
              Apenas 1 foto por pet. Sera substituida ao enviar uma nova.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                {hasPhoto ? (
                  <img
                    src={photoUrl}
                    alt={pet?.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <PawPrint className="w-12 h-12 text-primary" />
                )}
              </div>
              <div className="flex-1 w-full">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {hasPhoto ? "Trocar foto" : "Adicionar foto"}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos aceitos: JPG, PNG, WebP. Recomendado: imagem quadrada.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados do Pet</CardTitle>
            <CardDescription>Atualize as informacoes cadastrais</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Pet *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raca">Raca *</Label>
                  <Input
                    id="raca"
                    value={formData.raca}
                    onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg) *</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.peso}
                    onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aniversario">Data de Nascimento</Label>
                  <Input
                    id="aniversario"
                    type="date"
                    value={formData.aniversario}
                    onChange={(e) => setFormData({ ...formData, aniversario: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alimentacao">Tipo de Alimentacao</Label>
                <Input
                  id="alimentacao"
                  placeholder="Ex: Racao premium, alimentacao natural"
                  value={formData.alimentacao}
                  onChange={(e) => setFormData({ ...formData, alimentacao: e.target.value })}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="creche"
                    checked={formData.frequenta_creche}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, frequenta_creche: checked as boolean })
                    }
                  />
                  <label htmlFor="creche" className="text-sm font-medium cursor-pointer">
                    Frequenta creche
                  </label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="adestrado"
                    checked={formData.adestrado}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, adestrado: checked as boolean })
                    }
                  />
                  <label htmlFor="adestrado" className="text-sm font-medium cursor-pointer">
                    Adestrado
                  </label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="castrado"
                    checked={formData.castrado}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, castrado: checked as boolean })
                    }
                  />
                  <label htmlFor="castrado" className="text-sm font-medium cursor-pointer">
                    Castrado
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observacoes</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informacoes adicionais sobre o pet, comportamento, alergias, medicacoes, etc."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Salvar Alteracoes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Documentos
            </CardTitle>
            <CardDescription>
              Carteira de vacinacao, convenio e outros documentos do pet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={docInputRef}
              type="file"
              onChange={handleDocUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => docInputRef.current?.click()}
              disabled={uploadingDoc}
            >
              {uploadingDoc ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Adicionar Documento
                </>
              )}
            </Button>

            {loadingDocs ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando documentos...
              </div>
            ) : documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum documento cadastrado.
              </p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.key}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium truncate hover:underline"
                      >
                        {doc.name}
                      </a>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDoc(doc)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPetEdit;
