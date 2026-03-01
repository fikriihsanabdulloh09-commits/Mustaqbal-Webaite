'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MessageSquare, Star } from 'lucide-react';
import { toast } from 'sonner';

const dummyTestimonials = [
    { id: '1', name: 'Rizki Fauzan', role: 'Alumni RPL 2023', company: 'PT Tokopedia', quote: 'SMK Mustaqbal memberikan fondasi yang kuat untuk karir saya di dunia IT. Kurikulum yang relevan dan guru yang supportif membuat saya siap menghadapi dunia kerja.', photo_url: '', rating: 5 },
    { id: '2', name: 'Sari Dewi', role: 'Alumni TKJ 2022', company: 'PT Telkom Indonesia', quote: 'Pengalaman belajar di SMK Mustaqbal sangat berharga. Program magang yang disediakan langsung menghubungkan saya dengan perusahaan tempat saya bekerja sekarang.', photo_url: '', rating: 5 },
    { id: '3', name: 'Bima Ardiansyah', role: 'Alumni MM 2023', company: 'Freelance Designer', quote: 'Skill desain dan multimedia yang saya dapatkan di sini menjadi modal utama karir freelance saya. Terima kasih SMK Mustaqbal!', photo_url: '', rating: 4 },
    { id: '4', name: 'Nadia Putri', role: 'Alumni RPL 2024', company: 'Startup Lokal', quote: 'Dari project sekolah hingga startup sendiri. SMK Mustaqbal mengajarkan saya lebih dari sekedar coding.', photo_url: '', rating: 5 },
];

export default function MasterTestimoniPage() {
    const [items, setItems] = useState(dummyTestimonials);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any }>({ open: false, item: null });
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ name: '', role: '', company: '', quote: '', rating: 5 });

    const openAdd = () => { setEditing(null); setForm({ name: '', role: '', company: '', quote: '', rating: 5 }); setDialogOpen(true); };
    const openEdit = (item: any) => { setEditing(item); setForm({ name: item.name, role: item.role, company: item.company, quote: item.quote, rating: item.rating }); setDialogOpen(true); };

    const handleSubmit = () => {
        if (editing) {
            setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i));
            toast.success('Testimoni diperbarui (dummy)');
        } else {
            setItems(prev => [...prev, { ...form, id: Date.now().toString(), photo_url: '' }]);
            toast.success('Testimoni ditambahkan (dummy)');
        }
        console.log('[DUMMY] Submit testimoni:', form);
        setDialogOpen(false);
    };

    const handleDelete = (item: any) => { setItems(prev => prev.filter(i => i.id !== item.id)); toast.success('Dihapus (dummy)'); setDeleteDialog({ open: false, item: null }); };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold">Data Testimoni Alumni</h2><p className="text-gray-500 mt-1">Kelola testimoni alumni (CRUD)</p></div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Tambah Testimoni</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => (
                    <Card key={item.id} className="relative">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-6 h-6 text-teal-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 mb-1">{Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                                    <p className="text-sm text-gray-700 italic mb-3">&quot;{item.quote}&quot;</p>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.role} • {item.company}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 mt-3 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Edit className="w-4 h-4" /></Button>
                                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => setDeleteDialog({ open: true, item })}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? 'Edit Testimoni' : 'Tambah Testimoni'}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Nama Alumni</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Role / Angkatan</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Alumni RPL 2023" /></div>
                            <div><Label>Perusahaan</Label><Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                        </div>
                        <div><Label>Testimoni</Label><Textarea rows={4} value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} /></div>
                        <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} /></div>
                        <Button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700">{editing ? 'Update' : 'Simpan'}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, item: null })}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Hapus Testimoni</DialogTitle><DialogDescription>Yakin hapus testimoni dari {deleteDialog.item?.name}?</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null })}>Batal</Button><Button variant="destructive" onClick={() => deleteDialog.item && handleDelete(deleteDialog.item)}>Hapus</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
