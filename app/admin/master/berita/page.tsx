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
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, Star } from 'lucide-react';
import { toast } from 'sonner';

const dummyArticles = [
    { id: '1', title: 'SMK Mustaqbal Juara 1 LKS Tingkat Provinsi', excerpt: 'Siswa RPL berhasil meraih juara pertama', category: 'Prestasi', is_published: true, is_featured: true, views: 245, created_at: '2026-02-20' },
    { id: '2', title: 'Kunjungan Industri ke PT Telkom Indonesia', excerpt: 'Siswa kelas XI berkunjung ke kantor pusat', category: 'Kegiatan', is_published: true, is_featured: false, views: 132, created_at: '2026-02-18' },
    { id: '3', title: 'Pembukaan PPDB Tahun Ajaran 2026/2027', excerpt: 'Pendaftaran siswa baru resmi dibuka', category: 'Pengumuman', is_published: true, is_featured: true, views: 450, created_at: '2026-02-15' },
    { id: '4', title: 'Workshop UI/UX Design Bersama Tokopedia', excerpt: 'Workshop kolaborasi dengan tim design Tokopedia', category: 'Kegiatan', is_published: false, is_featured: false, views: 0, created_at: '2026-02-10' },
    { id: '5', title: 'Tips Sukses Menghadapi Ujian SMK', excerpt: 'Panduan persiapan ujian nasional', category: 'Artikel', is_published: true, is_featured: false, views: 89, created_at: '2026-02-05' },
];

export default function MasterBeritaPage() {
    const [articles, setArticles] = useState(dummyArticles);
    const [searchQuery, setSearchQuery] = useState('');
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any }>({ open: false, item: null });
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({ title: '', excerpt: '', category: 'Berita' });

    const filtered = articles.filter(a => searchQuery === '' || a.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const openAdd = () => { setEditing(null); setForm({ title: '', excerpt: '', category: 'Berita' }); setEditDialog(true); };
    const openEdit = (a: any) => { setEditing(a); setForm({ title: a.title, excerpt: a.excerpt, category: a.category }); setEditDialog(true); };

    const handleSubmit = () => {
        if (editing) {
            setArticles(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
            toast.success('Berita diperbarui (dummy)');
        } else {
            setArticles(prev => [...prev, { ...form, id: Date.now().toString(), is_published: false, is_featured: false, views: 0, created_at: new Date().toISOString().split('T')[0] }]);
            toast.success('Berita ditambahkan (dummy)');
        }
        console.log('[DUMMY] Submit berita:', form);
        setEditDialog(false);
    };

    const handleDelete = (item: any) => { setArticles(prev => prev.filter(a => a.id !== item.id)); toast.success('Dihapus (dummy)'); setDeleteDialog({ open: false, item: null }); };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div><h2 className="text-3xl font-bold">Data Berita & Pengumuman</h2><p className="text-gray-500 mt-1">Kelola artikel berita (CRUD)</p></div>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Tambah Berita</Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div><CardTitle>Daftar Berita</CardTitle><CardDescription>{filtered.length} artikel</CardDescription></div>
                        <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Cari..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" /></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Judul</TableHead><TableHead>Kategori</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Tanggal</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filtered.map(a => (
                                <TableRow key={a.id}>
                                    <TableCell><div className="flex items-center gap-2">{a.is_featured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}<div><div className="font-medium">{a.title}</div><div className="text-sm text-gray-500 line-clamp-1">{a.excerpt}</div></div></div></TableCell>
                                    <TableCell><Badge variant="outline">{a.category}</Badge></TableCell>
                                    <TableCell>{a.is_published ? <Badge className="bg-green-100 text-green-700">Published</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                                    <TableCell><div className="flex items-center gap-1"><Eye className="w-4 h-4 text-gray-400" />{a.views}</div></TableCell>
                                    <TableCell className="text-sm text-gray-500">{new Date(a.created_at).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(a)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteDialog({ open: true, item: a })}><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
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
                    <DialogHeader><DialogTitle>{editing ? 'Edit Berita' : 'Tambah Berita'}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Judul</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                        <div><Label>Kategori</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Berita</option><option>Pengumuman</option><option>Prestasi</option><option>Kegiatan</option><option>Artikel</option></select></div>
                        <div><Label>Ringkasan</Label><Textarea rows={3} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} /></div>
                        <Button onClick={handleSubmit} className="w-full bg-teal-600 hover:bg-teal-700">{editing ? 'Update' : 'Simpan'}</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, item: null })}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Hapus Berita</DialogTitle><DialogDescription>Yakin hapus &quot;{deleteDialog.item?.title}&quot;?</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null })}>Batal</Button><Button variant="destructive" onClick={() => deleteDialog.item && handleDelete(deleteDialog.item)}>Hapus</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
