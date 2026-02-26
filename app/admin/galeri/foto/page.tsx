'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryItem {
    id: string;
    title: string;
    description?: string;
    media_type: string;
    media_url: string;
    thumbnail_url?: string;
    category?: string;
    is_featured: boolean;
    created_at: string;
}

export default function GaleriFotoPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        media_url: '',
        thumbnail_url: '',
        category: 'umum',
        is_featured: false,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    async function fetchItems() {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('gallery_items')
                .select('*')
                .eq('media_type', 'foto')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
            toast.error('Gagal memuat galeri foto');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit() {
        try {
            const supabase = createClient();

            if (editingItem) {
                const { error } = await supabase
                    .from('gallery_items')
                    .update({
                        ...formData,
                        media_type: 'foto',
                    })
                    .eq('id', editingItem.id);

                if (error) throw error;
                toast.success('Foto berhasil diupdate');
            } else {
                const { error } = await supabase
                    .from('gallery_items')
                    .insert([{ ...formData, media_type: 'foto' }]);

                if (error) throw error;
                toast.success('Foto berhasil ditambahkan');
            }

            setDialogOpen(false);
            resetForm();
            fetchItems();
        } catch (error) {
            console.error('Error saving gallery item:', error);
            toast.error('Gagal menyimpan foto');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus foto ini?')) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('gallery_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Foto berhasil dihapus');
            fetchItems();
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            toast.error('Gagal menghapus foto');
        }
    }

    function handleEdit(item: GalleryItem) {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description || '',
            media_url: item.media_url,
            thumbnail_url: item.thumbnail_url || '',
            category: item.category || 'umum',
            is_featured: item.is_featured,
        });
        setDialogOpen(true);
    }

    function resetForm() {
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            media_url: '',
            thumbnail_url: '',
            category: 'umum',
            is_featured: false,
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Galeri Foto</h2>
                    <p className="text-gray-500 mt-1">Kelola foto-foto sekolah</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Foto
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit Foto' : 'Tambah Foto Baru'}</DialogTitle>
                            <DialogDescription>
                                {editingItem ? 'Perbarui informasi foto' : 'Tambahkan foto baru ke galeri'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Judul</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Judul foto"
                                />
                            </div>
                            <div>
                                <Label>URL Foto</Label>
                                <Input
                                    value={formData.media_url}
                                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>
                            <div>
                                <Label>Deskripsi</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Deskripsi foto"
                                />
                            </div>
                            <div>
                                <Label>Kategori</Label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="umum, kegiatan, prestasi, dll"
                                />
                            </div>
                            <Button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700">
                                {editingItem ? 'Update' : 'Simpan'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Foto</CardTitle>
                    <CardDescription>Total: {items.length} foto</CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada foto. Klik tombol "Tambah Foto" untuk menambahkan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {items.map((item) => (
                                <div key={item.id} className="group relative border rounded-lg overflow-hidden">
                                    <img
                                        src={item.media_url}
                                        alt={item.title}
                                        className="w-full h-40 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/><text x="50%" y="50%" fill="%23999" text-anchor="middle">No Image</text></svg>';
                                        }}
                                    />
                                    <div className="p-3">
                                        <p className="font-medium text-sm truncate">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}