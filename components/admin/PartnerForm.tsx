'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { FileUploader } from '@/components/admin/FileUploader';
import { createPartner, updatePartner } from '@/lib/actions/partners';
import { Partner } from '@/lib/supabase';

interface PartnerFormProps {
    partner?: Partner; // If provided, we're editing; otherwise, creating
}

export function PartnerForm({ partner }: PartnerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: partner?.name || '',
        logo_url: partner?.logo_url || '',
        link_url: partner?.link_url || '',
        sort_order: partner?.sort_order ?? 0,
        is_active: partner?.is_active ?? true,
        category: partner?.category || '',
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Client-side validation
        if (!formData.name.trim()) {
            toast.error('Nama mitra harus diisi');
            return;
        }

        if (!formData.logo_url && !logoFile) {
            toast.error('Logo harus diupload');
            return;
        }

        setLoading(true);

        try {
            let result;

            if (partner) {
                // Update existing partner
                result = await updatePartner(partner.id, {
                    name: formData.name,
                    logo_url: formData.logo_url,
                    link_url: formData.link_url,
                    sort_order: formData.sort_order,
                    is_active: formData.is_active,
                    category: formData.category,
                }, logoFile || undefined);
            } else {
                // Create new partner
                result = await createPartner({
                    name: formData.name,
                    logo_url: formData.logo_url,
                    link_url: formData.link_url,
                    sort_order: formData.sort_order,
                    is_active: formData.is_active,
                    category: formData.category,
                }, logoFile || undefined);
            }

            if (result.success) {
                toast.success(partner ? 'Mitra berhasil diperbarui' : 'Mitra berhasil ditambahkan');
                router.push('/admin/mitra');
                router.refresh();
            } else {
                toast.error(result.error || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{partner ? 'Edit Mitra' : 'Tambah Mitra Baru'}</CardTitle>
                    <CardDescription>
                        {partner
                            ? 'Perbarui informasi mitra di bawah ini'
                            : 'Tambahkan mitra baru untuk ditampilkan di slider'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Mitra *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Contoh: Bank Mandiri"
                            required
                        />
                    </div>

                    {/* Logo */}
                    <div className="space-y-2">
                        <Label>Logo Mitra *</Label>
                        {formData.logo_url && !logoFile ? (
                            <div className="relative inline-block">
                                <img
                                    src={formData.logo_url}
                                    alt="Logo preview"
                                    className="h-20 w-32 object-contain border rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-0 right-0"
                                    onClick={() => setFormData({ ...formData, logo_url: '' })}
                                >
                                    Hapus
                                </Button>
                            </div>
                        ) : logoFile ? (
                            <div className="relative inline-block">
                                <img
                                    src={URL.createObjectURL(logoFile)}
                                    alt="Logo preview"
                                    className="h-20 w-32 object-contain border rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-0 right-0"
                                    onClick={() => setLogoFile(null)}
                                >
                                    Hapus
                                </Button>
                            </div>
                        ) : (
                            <FileUploader
                                bucket="partner-logos"
                                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                maxSize={2097152} // 2MB
                                onUploadComplete={(url) => {
                                    setFormData({ ...formData, logo_url: url });
                                    setLogoFile(null);
                                }}
                                onUploadError={(error) => {
                                    toast.error(error.message);
                                }}
                                className="w-full"
                            />
                        )}
                        <p className="text-xs text-muted-foreground">
                            Format yang didukung: PNG, JPG, SVG, WebP. Maksimal 2MB.
                        </p>
                    </div>

                    {/* Link URL */}
                    <div className="space-y-2">
                        <Label htmlFor="link_url">Link Website (Opsional)</Label>
                        <Input
                            id="link_url"
                            type="url"
                            value={formData.link_url}
                            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                            placeholder="https://contoh.com"
                        />
                        <p className="text-xs text-muted-foreground">
                            Kosongkan jika tidak ada website
                        </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Kategori</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Contoh: Perbankan, Otomotif, Energi"
                        />
                        <p className="text-xs text-muted-foreground">
                            Kategori ditampilkan saat hover pada logo
                        </p>
                    </div>

                    {/* Sort Order */}
                    <div className="space-y-2">
                        <Label htmlFor="sort_order">Urutan Tampilan *</Label>
                        <Input
                            id="sort_order"
                            type="number"
                            min="0"
                            value={formData.sort_order}
                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">
                            Angka lebih kecil muncul lebih awal di slider. Contoh: 1 muncul sebelum 2.
                        </p>
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Tampilkan di slider</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/mitra">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                    </Link>
                </Button>

                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4" />
                            {partner ? 'Perbarui Mitra' : 'Tambah Mitra'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
