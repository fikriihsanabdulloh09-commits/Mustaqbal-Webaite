'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Briefcase, ExternalLink, Upload, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// DUMMY DATA - Simulasi data dari database
const dummyPortfolios = [
    {
        id: '1',
        title: 'Website E-Commerce',
        student_name: 'Ahmad Rizki',
        program: 'Web Dev & Digital Marketing',
        category: 'Web Development',
        year: 2025,
        description: 'Platform e-commerce dengan fitur payment gateway',
        image_url: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
        project_url: 'https://demo.com',
        is_featured: true
    },
    {
        id: '2',
        title: 'Aplikasi Kasir Android',
        student_name: 'Dina Putri',
        program: 'Web Dev & Digital Marketing',
        category: 'Mobile App',
        year: 2025,
        description: 'Aplikasi kasir untuk UMKM berbasis Android',
        image_url: '',
        project_url: '',
        is_featured: false
    },
    {
        id: '3',
        title: 'Branding Kafe',
        student_name: 'Fajar Nugroho',
        program: 'Product Design & 3D',
        category: 'UI/UX Design',
        year: 2024,
        description: 'Desain branding lengkap untuk kafe lokal',
        image_url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
        project_url: '',
        is_featured: true
    },
    {
        id: '4',
        title: 'Motion Graphics Profil Sekolah',
        student_name: 'Lisa Anggraini',
        program: 'Product Design & 3D',
        category: 'Multimedia',
        year: 2024,
        description: 'Video profil sekolah dengan animasi motion graphics',
        image_url: '',
        project_url: '',
        is_featured: false
    },
];

// Program options (sesuai dengan data sekolah)
const programOptions = [
    'Teknik Otomasi & Robotik',
    'Product Design & 3D',
    'IT Support & Network',
    'Web Dev & Digital Marketing',
];

// Category options
const categoryOptions = [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'Multimedia',
    'Networking',
    'IoT',
    'Robotik',
    'Teknik',
    'Design',
];

export default function MasterPortfolioPage() {
    const [items, setItems] = useState(dummyPortfolios);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        title: '',
        student_name: '',
        program: '',
        category: '',
        year: new Date().getFullYear(),
        description: '',
        image_url: '',
        project_url: '',
        is_featured: false,
    });

    const openAdd = () => {
        setEditing(null);
        setForm({
            title: '',
            student_name: '',
            program: '',
            category: '',
            year: new Date().getFullYear(),
            description: '',
            image_url: '',
            project_url: '',
            is_featured: false,
        });
        setDialogOpen(true);
    };

    const openEdit = (item: any) => {
        setEditing(item);
        setForm({
            title: item.title,
            student_name: item.student_name,
            program: item.program,
            category: item.category,
            year: item.year,
            description: item.description,
            image_url: item.image_url,
            project_url: item.project_url,
            is_featured: item.is_featured,
        });
        setDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!form.title || !form.student_name || !form.category) {
            toast.error('Judul, Nama Siswa, dan Kategori wajib diisi');
            return;
        }

        if (editing) {
            setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i));
            toast.success('Portfolio berhasil diperbarui (dummy mode)');
        } else {
            setItems(prev => [...prev, { ...form, id: Date.now().toString() }]);
            toast.success('Portfolio berhasil ditambahkan (dummy mode)');
        }
        console.log('[DUMMY] Submit portfolio:', form);
        setDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus portfolio ini?')) {
            setItems(prev => prev.filter(i => i.id !== id));
            toast.success('Portfolio berhasil dihapus (dummy mode)');
        }
    };

    const toggleFeatured = (id: string, currentValue: boolean) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, is_featured: !currentValue } : i));
        toast.success(`Portfolio ${!currentValue ? 'ditandai' : 'dihapus'} dari featured (dummy mode)`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Data Portfolio Siswa</h2>
                    <p className="text-gray-500 mt-1">Kelola karya portfolio siswa (FASE 1 - Dummy Data)</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Portfolio
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-teal-600">{items.length}</div>
                        <p className="text-sm text-gray-500">Total Portfolio</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-amber-500">
                            {items.filter(i => i.is_featured).length}
                        </div>
                        <p className="text-sm text-gray-500">Portfolio Featured</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-blue-600">
                            {new Set(items.map(i => i.year)).size}
                        </div>
                        <p className="text-sm text-gray-500">Tahun Berbeda</p>
                    </CardContent>
                </Card>
            </div>

            {/* Portfolio Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Portfolio</CardTitle>
                    <CardDescription>Klik portfolio untuk mengedit atau hapus</CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada portfolio.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                                    {/* Image */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {item.image_url ? (
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Briefcase className="w-12 h-12 text-gray-300" />
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {item.is_featured && (
                                            <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3" /> Featured
                                            </span>
                                        )}

                                        {/* Category Badge */}
                                        <span className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-semibold truncate" title={item.title}>{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.student_name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{item.program} • {item.year}</p>

                                        {/* Actions */}
                                        <div className="flex gap-1 mt-3">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => toggleFeatured(item.id, item.is_featured)}
                                                className={item.is_featured ? 'text-yellow-500' : 'text-gray-400'}
                                            >
                                                <Star className="w-4 h-4" />
                                            </Button>
                                            {item.project_url && (
                                                <Button size="sm" variant="ghost" asChild>
                                                    <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-500"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Portfolio' : 'Tambah Portfolio Baru'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 pt-4">
                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <Label className="font-medium">Tampilkan sebagai Featured</Label>
                                <p className="text-sm text-gray-500">Portfolio akan ditampilkan secara destac di halaman depan</p>
                            </div>
                            <Switch
                                checked={form.is_featured}
                                onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Gambar Portfolio</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-teal-400 transition-colors">
                                {form.image_url ? (
                                    <div className="relative">
                                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                            <Image
                                                src={form.image_url}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setForm({ ...form, image_url: '' })}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-500 mb-2">Upload gambar portfolio</p>
                                        <p className="text-xs text-gray-400">atau masukkan URL di bawah</p>
                                    </div>
                                )}
                            </div>
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={form.image_url}
                                onChange={e => setForm({ ...form, image_url: e.target.value })}
                            />
                        </div>

                        {/* Title & Student */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Judul Project <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Contoh: Website E-Commerce"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nama Siswa <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Contoh: Ahmad Rizki"
                                    value={form.student_name}
                                    onChange={e => setForm({ ...form, student_name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Program & Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Program Keahlian</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={form.program}
                                    onChange={e => setForm({ ...form, program: e.target.value })}
                                >
                                    <option value="">Pilih Program</option>
                                    {programOptions.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Kategori <span className="text-red-500">*</span></Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categoryOptions.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Year & Project URL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tahun</Label>
                                <Input
                                    type="number"
                                    value={form.year}
                                    onChange={e => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>URL Project (opsional)</Label>
                                <Input
                                    placeholder="https://demo.project.com"
                                    value={form.project_url}
                                    onChange={e => setForm({ ...form, project_url: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>Deskripsi Project</Label>
                            <Textarea
                                rows={4}
                                placeholder="Jelaskan tentang project ini..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="flex-1 bg-teal-600 hover:bg-teal-700"
                            >
                                {editing ? 'Update Portfolio' : 'Simpan Portfolio'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
