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
import { Plus, Trash2, Edit, Briefcase, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    image_url?: string;
    project_url?: string;
    category?: string;
    student_name?: string;
    year?: number;
    is_featured: boolean;
    order_position: number;
    created_at: string;
}

export default function PortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        project_url: '',
        category: '',
        student_name: '',
        year: new Date().getFullYear(),
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
                .from('portfolio_items')
                .select('*')
                .order('order_position', { ascending: true });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching portfolio items:', error);
            toast.error('Gagal memuat portfolio');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit() {
        try {
            const supabase = createClient();

            if (editingItem) {
                const { error } = await supabase
                    .from('portfolio_items')
                    .update(formData)
                    .eq('id', editingItem.id);

                if (error) throw error;
                toast.success('Portfolio berhasil diupdate');
            } else {
                const { error } = await supabase
                    .from('portfolio_items')
                    .insert([formData]);

                if (error) throw error;
                toast.success('Portfolio berhasil ditambahkan');
            }

            setDialogOpen(false);
            resetForm();
            fetchItems();
        } catch (error) {
            console.error('Error saving portfolio item:', error);
            toast.error('Gagal menyimpan portfolio');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus portfolio ini?')) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('portfolio_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Portfolio berhasil dihapus');
            fetchItems();
        } catch (error) {
            console.error('Error deleting portfolio item:', error);
            toast.error('Gagal menghapus portfolio');
        }
    }

    function handleEdit(item: PortfolioItem) {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description || '',
            image_url: item.image_url || '',
            project_url: item.project_url || '',
            category: item.category || '',
            student_name: item.student_name || '',
            year: item.year || new Date().getFullYear(),
            is_featured: item.is_featured,
        });
        setDialogOpen(true);
    }

    function resetForm() {
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            image_url: '',
            project_url: '',
            category: '',
            student_name: '',
            year: new Date().getFullYear(),
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
                    <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
                    <p className="text-gray-500 mt-1">Kelola karya dan portfolio siswa</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Portfolio
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit Portfolio' : 'Tambah Portfolio Baru'}</DialogTitle>
                            <DialogDescription>
                                {editingItem ? 'Perbarui informasi portfolio' : 'Tambahkan portfolio baru'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Judul Project</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Website E-Commerce"
                                />
                            </div>
                            <div>
                                <Label>Nama Siswa</Label>
                                <Input
                                    value={formData.student_name}
                                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                                    placeholder="Ahmad Rizki"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Kategori</Label>
                                    <Input
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Web Development"
                                    />
                                </div>
                                <div>
                                    <Label>Tahun</Label>
                                    <Input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                                        placeholder="2024"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>URL Gambar</Label>
                                <Input
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div>
                                <Label>URL Project (opsional)</Label>
                                <Input
                                    value={formData.project_url}
                                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                                    placeholder="https://project-demo.com"
                                />
                            </div>
                            <div>
                                <Label>Deskripsi</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Deskripsi singkat project"
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
                    <CardTitle>Daftar Portfolio</CardTitle>
                    <CardDescription>Total: {items.length} project</CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada portfolio. Klik tombol "Tambah Portfolio" untuk menambahkan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <div key={item.id} className="group relative border rounded-lg overflow-hidden">
                                    <div className="h-48 bg-gray-100 relative">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Briefcase className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                        {item.is_featured && (
                                            <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.student_name}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-400">{item.category} • {item.year}</span>
                                            <div className="flex gap-1">
                                                {item.project_url && (
                                                    <Button size="sm" variant="ghost" asChild>
                                                        <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
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