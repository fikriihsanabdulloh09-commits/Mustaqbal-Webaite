'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Briefcase, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const dummyPortfolios = [
    { id: '1', title: 'Website E-Commerce', student_name: 'Ahmad Rizki', category: 'Web Development', year: 2025, description: 'Platform e-commerce dengan fitur payment gateway', image_url: '', project_url: 'https://demo.com', is_featured: true },
    { id: '2', title: 'Aplikasi Kasir Android', student_name: 'Dina Putri', category: 'Mobile App', year: 2025, description: 'Aplikasi kasir untuk UMKM berbasis Android', image_url: '', project_url: '', is_featured: false },
    { id: '3', title: 'Branding Kafe', student_name: 'Fajar Nugroho', category: 'UI/UX Design', year: 2024, description: 'Desain branding lengkap untuk kafe lokal', image_url: '', project_url: '', is_featured: true },
    { id: '4', title: 'Motion Graphics Profil Sekolah', student_name: 'Lisa Anggraini', category: 'Multimedia', year: 2024, description: 'Video profil sekolah dengan animasi motion graphics', image_url: '', project_url: '', is_featured: false },
];

export default function MasterPortfolioPage() {
    const [items, setItems] = useState(dummyPortfolios);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ title: '', student_name: '', category: '', year: 2025, description: '', image_url: '', project_url: '' });

    const openAdd = () => { setEditing(null); setForm({ title: '', student_name: '', category: '', year: 2025, description: '', image_url: '', project_url: '' }); setDialogOpen(true); };
    const openEdit = (item: any) => { setEditing(item); setForm({ title: item.title, student_name: item.student_name, category: item.category, year: item.year, description: item.description, image_url: item.image_url, project_url: item.project_url }); setDialogOpen(true); };

    const handleSubmit = () => {
        if (editing) {
            setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i));
            toast.success('Portfolio diperbarui (dummy)');
        } else {
            setItems(prev => [...prev, { ...form, id: Date.now().toString(), is_featured: false }]);
            toast.success('Portfolio ditambahkan (dummy)');
        }
        console.log('[DUMMY] Submit portfolio:', form);
        setDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        toast.success('Portfolio dihapus (dummy)');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold">Data Portfolio Siswa</h2><p className="text-gray-500 mt-1">Kelola karya portfolio siswa (CRUD)</p></div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Tambah Portfolio</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Daftar Portfolio</CardTitle><CardDescription>Total: {items.length} project</CardDescription></CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-500"><Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>Belum ada portfolio.</p></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                                        <Briefcase className="w-12 h-12 text-gray-300" />
                                        {item.is_featured && <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Featured</span>}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold truncate">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.student_name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{item.category} • {item.year}</p>
                                        <div className="flex gap-1 mt-3">
                                            {item.project_url && <Button size="sm" variant="ghost" asChild><a href={item.project_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a></Button>}
                                            <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Edit className="w-4 h-4" /></Button>
                                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>{editing ? 'Edit Portfolio' : 'Tambah Portfolio'}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Judul Project</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                        <div><Label>Nama Siswa</Label><Input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Kategori</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                            <div><Label>Tahun</Label><Input type="number" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) || 2025 })} /></div>
                        </div>
                        <div><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                        <Button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700">{editing ? 'Update' : 'Simpan'}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
