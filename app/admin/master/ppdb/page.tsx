'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const dummyPPDB = [
    { id: '1', full_name: 'Ahmad Fauzi', origin_school: 'SMP Negeri 1 Bandung', phone: '081234567890', program: 'RPL', status: 'approved', created_at: '2026-02-20' },
    { id: '2', full_name: 'Dina Maharani', origin_school: 'SMP Negeri 5 Ciparay', phone: '081234567891', program: 'TKJ', status: 'pending', created_at: '2026-02-22' },
    { id: '3', full_name: 'Budi Santoso', origin_school: 'MTs Al-Hikmah', phone: '081234567892', program: 'MM', status: 'pending', created_at: '2026-02-25' },
    { id: '4', full_name: 'Rina Kartika', origin_school: 'SMP Negeri 3 Soreang', phone: '081234567893', program: 'RPL', status: 'rejected', created_at: '2026-02-18' },
    { id: '5', full_name: 'Eko Prasetyo', origin_school: 'SMP PGRI Banjaran', phone: '081234567894', program: 'TKJ', status: 'approved', created_at: '2026-02-15' },
];

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function MasterPPDBPage() {
    const [items, setItems] = useState(dummyPPDB);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any }>({ open: false, item: null });

    const filtered = items.filter(i => searchQuery === '' || i.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || i.origin_school.toLowerCase().includes(searchQuery.toLowerCase()));

    const updateStatus = (id: string, newStatus: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        toast.success(`Status diubah ke ${newStatus} (dummy)`);
        console.log('[DUMMY] Update status:', id, newStatus);
    };

    const handleDelete = (item: any) => { setItems(prev => prev.filter(i => i.id !== item.id)); toast.success('Dihapus (dummy)'); setDeleteDialog({ open: false, item: null }); };

    return (
        <div className="space-y-6">
            <div><h2 className="text-3xl font-bold">Data Pendaftar PPDB</h2><p className="text-gray-500 mt-1">Lihat, edit status, dan kelola pendaftar PPDB</p></div>

            <div className="grid grid-cols-3 gap-4">
                <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-yellow-600">{items.filter(i => i.status === 'pending').length}</div><p className="text-sm text-gray-500">Pending</p></CardContent></Card>
                <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-green-600">{items.filter(i => i.status === 'approved').length}</div><p className="text-sm text-gray-500">Diterima</p></CardContent></Card>
                <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-red-600">{items.filter(i => i.status === 'rejected').length}</div><p className="text-sm text-gray-500">Ditolak</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div><CardTitle>Daftar Pendaftar</CardTitle><CardDescription>{filtered.length} pendaftar</CardDescription></div>
                        <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input placeholder="Cari..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" /></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Asal Sekolah</TableHead><TableHead>Program</TableHead><TableHead>Telepon</TableHead><TableHead>Status</TableHead><TableHead>Tanggal</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filtered.map(i => (
                                <TableRow key={i.id}>
                                    <TableCell className="font-medium">{i.full_name}</TableCell>
                                    <TableCell>{i.origin_school}</TableCell>
                                    <TableCell><Badge variant="outline">{i.program}</Badge></TableCell>
                                    <TableCell className="text-sm">{i.phone}</TableCell>
                                    <TableCell><Badge className={statusColors[i.status]}>{i.status}</Badge></TableCell>
                                    <TableCell className="text-sm text-gray-500">{new Date(i.created_at).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { console.log('[DUMMY] View:', i); toast.info('Lihat detail (dummy)'); }}><Eye className="mr-2 h-4 w-4" /> Lihat</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(i.id, 'approved')}>✅ Terima</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(i.id, 'rejected')}>❌ Tolak</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(i.id, 'pending')}>⏳ Pending</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteDialog({ open: true, item: i })}><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, item: null })}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Hapus Pendaftar</DialogTitle><DialogDescription>Yakin hapus {deleteDialog.item?.full_name}?</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null })}>Batal</Button><Button variant="destructive" onClick={() => deleteDialog.item && handleDelete(deleteDialog.item)}>Hapus</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
