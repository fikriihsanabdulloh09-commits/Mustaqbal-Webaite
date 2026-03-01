'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const dummyPrograms = [
    { id: '1', name: 'Rekayasa Perangkat Lunak', slug: 'rpl', description: 'Program keahlian yang mempelajari pengembangan perangkat lunak, web, dan mobile.', icon: 'Code', student_count: 120, is_active: true },
    { id: '2', name: 'Teknik Komputer dan Jaringan', slug: 'tkj', description: 'Program keahlian di bidang jaringan komputer, server, dan keamanan siber.', icon: 'Wifi', student_count: 100, is_active: true },
    { id: '3', name: 'Multimedia', slug: 'mm', description: 'Program keahlian desain grafis, videografi, dan animasi digital.', icon: 'Camera', student_count: 90, is_active: true },
    { id: '4', name: 'Bisnis Digital', slug: 'bd', description: 'Program keahlian pemasaran digital, e-commerce, dan manajemen bisnis online.', icon: 'TrendingUp', student_count: 75, is_active: false },
];

export default function MasterProgramPage() {
    const [programs, setPrograms] = useState(dummyPrograms);
    const [searchQuery, setSearchQuery] = useState('');
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any }>({ open: false, item: null });
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', student_count: 0 });

    const filtered = programs.filter(p => searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const openAdd = () => { setEditing(null); setForm({ name: '', slug: '', description: '', icon: '', student_count: 0 }); setEditDialog(true); };
    const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, slug: p.slug, description: p.description, icon: p.icon, student_count: p.student_count }); setEditDialog(true); };

    const handleSubmit = () => {
        if (editing) {
            setPrograms(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p));
            toast.success('Program diperbarui (dummy)');
        } else {
            setPrograms(prev => [...prev, { ...form, id: Date.now().toString(), is_active: true }]);
            toast.success('Program ditambahkan (dummy)');
        }
        console.log('[DUMMY] Submit program:', form);
        setEditDialog(false);
    };

    const handleDelete = (item: any) => {
        setPrograms(prev => prev.filter(p => p.id !== item.id));
        toast.success('Program dihapus (dummy)');
        setDeleteDialog({ open: false, item: null });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold">Data Program Keahlian</h2><p className="text-gray-500 mt-1">Kelola data program keahlian (CRUD)</p></div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Tambah Program</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div><CardTitle>Daftar Program</CardTitle><CardDescription>{filtered.length} program</CardDescription></div>
                        <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Cari program..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" /></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Program</TableHead><TableHead>Jumlah Siswa</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filtered.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-teal-600" /></div>
                                            <div><div className="font-medium">{p.name}</div><div className="text-sm text-gray-500 line-clamp-1">{p.description}</div></div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{p.student_count} siswa</TableCell>
                                    <TableCell>{p.is_active ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(p)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteDialog({ open: true, item: p })}><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? 'Edit Program' : 'Tambah Program'}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Nama Program</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
                            <div><Label>Jumlah Siswa</Label><Input type="number" value={form.student_count} onChange={e => setForm({ ...form, student_count: parseInt(e.target.value) || 0 })} /></div>
                        </div>
                        <div><Label>Deskripsi</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                        <Button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700">{editing ? 'Update' : 'Simpan'}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, item: null })}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Hapus Program</DialogTitle><DialogDescription>Yakin hapus <strong>{deleteDialog.item?.name}</strong>?</DialogDescription></DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null })}>Batal</Button>
                        <Button variant="destructive" onClick={() => deleteDialog.item && handleDelete(deleteDialog.item)}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
