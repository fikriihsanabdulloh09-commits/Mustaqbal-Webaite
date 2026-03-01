'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

// Dummy data guru
const dummyTeachers = [
    { id: '1', full_name: 'Drs. H. Ahmad Suryadi, M.Pd.', nip: '196805151993031008', position: 'Kepala Sekolah', subject: 'Manajemen', photo_url: '', education: 'S2 Manajemen Pendidikan', email: 'ahmad@smkmustaqbal.id', phone: '081234567890', is_active: true },
    { id: '2', full_name: 'Ir. Siti Nurjanah, M.T.', nip: '197012031997022003', position: 'Wakil Kepala Sekolah', subject: 'Teknik Komputer', photo_url: '', education: 'S2 Teknik Informatika', email: 'siti@smkmustaqbal.id', phone: '081234567891', is_active: true },
    { id: '3', full_name: 'Andi Firmansyah, S.Kom.', nip: '198506142010011015', position: 'Guru', subject: 'Pemrograman Web', photo_url: '', education: 'S1 Teknik Informatika', email: 'andi@smkmustaqbal.id', phone: '081234567892', is_active: true },
    { id: '4', full_name: 'Rina Kartika, S.Pd.', nip: '199001222015042001', position: 'Guru', subject: 'Bahasa Inggris', photo_url: '', education: 'S1 Pendidikan B. Inggris', email: 'rina@smkmustaqbal.id', phone: '081234567893', is_active: false },
    { id: '5', full_name: 'Budi Santoso, S.Pd.', nip: '198803112012011006', position: 'Guru', subject: 'Matematika', photo_url: '', education: 'S1 Pendidikan Matematika', email: 'budi@smkmustaqbal.id', phone: '081234567894', is_active: true },
];

export default function MasterGuruPage() {
    const [teachers, setTeachers] = useState(dummyTeachers);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; teacher: any }>({ open: false, teacher: null });
    const [editDialog, setEditDialog] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<any>(null);
    const [form, setForm] = useState({ full_name: '', nip: '', position: '', subject: '', education: '', email: '', phone: '' });

    const filtered = teachers.filter(t =>
        searchQuery === '' ||
        t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAdd = () => {
        setEditingTeacher(null);
        setForm({ full_name: '', nip: '', position: '', subject: '', education: '', email: '', phone: '' });
        setEditDialog(true);
    };

    const openEdit = (t: any) => {
        setEditingTeacher(t);
        setForm({ full_name: t.full_name, nip: t.nip || '', position: t.position, subject: t.subject || '', education: t.education || '', email: t.email || '', phone: t.phone || '' });
        setEditDialog(true);
    };

    const handleSubmit = () => {
        if (editingTeacher) {
            setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...t, ...form } : t));
            toast.success('Data guru diperbarui (dummy)');
        } else {
            setTeachers(prev => [...prev, { ...form, id: Date.now().toString(), photo_url: '', is_active: true }]);
            toast.success('Guru baru ditambahkan (dummy)');
        }
        console.log('[DUMMY] Submit guru:', form);
        setEditDialog(false);
    };

    const handleDelete = (teacher: any) => {
        setTeachers(prev => prev.filter(t => t.id !== teacher.id));
        toast.success('Guru dihapus (dummy)');
        console.log('[DUMMY] Delete guru:', teacher.full_name);
        setDeleteDialog({ open: false, teacher: null });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Data Guru & Staff</h2>
                    <p className="text-gray-500 mt-1">Kelola data guru dan staff (CRUD)</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-2" /> Tambah Guru
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div><CardTitle>Daftar Guru</CardTitle><CardDescription>{filtered.length} dari {teachers.length} guru</CardDescription></div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input placeholder="Cari guru..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead><TableHead>Posisi</TableHead><TableHead>Mata Pelajaran</TableHead><TableHead>Kontak</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center"><User className="w-5 h-5 text-teal-600" /></div>
                                            <div><div className="font-medium">{t.full_name}</div>{t.nip && <div className="text-sm text-gray-500">NIP: {t.nip}</div>}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="outline">{t.position}</Badge></TableCell>
                                    <TableCell>{t.subject || '-'}</TableCell>
                                    <TableCell><div className="text-sm">{t.email}<br /><span className="text-gray-500">{t.phone}</span></div></TableCell>
                                    <TableCell>{t.is_active ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge variant="secondary">Nonaktif</Badge>}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(t)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteDialog({ open: true, teacher: t })}><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingTeacher ? 'Edit Guru' : 'Tambah Guru Baru'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Nama Lengkap</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>NIP</Label><Input value={form.nip} onChange={e => setForm({ ...form, nip: e.target.value })} /></div>
                            <div><Label>Posisi</Label><Input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Mata Pelajaran</Label><Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
                            <div><Label>Pendidikan</Label><Input value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div><Label>Telepon</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                        </div>
                        <Button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700">{editingTeacher ? 'Update' : 'Simpan'}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, teacher: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Data Guru</DialogTitle>
                        <DialogDescription>Yakin ingin menghapus <strong>{deleteDialog.teacher?.full_name}</strong>?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, teacher: null })}>Batal</Button>
                        <Button variant="destructive" onClick={() => deleteDialog.teacher && handleDelete(deleteDialog.teacher)}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
