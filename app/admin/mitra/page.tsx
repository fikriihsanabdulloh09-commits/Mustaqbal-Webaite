'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Partner } from '@/lib/supabase';
import { deletePartner, togglePartnerStatus } from '@/lib/actions/partners';

export default function MitraPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPartners();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPartners(partners);
        } else {
            const filtered = partners.filter(partner =>
                partner.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPartners(filtered);
        }
    }, [searchQuery, partners]);

    async function fetchPartners() {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('partners')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            setPartners(data || []);
            setFilteredPartners(data || []);
        } catch (error) {
            console.error('Error fetching partners:', error);
            toast.error('Gagal memuat data mitra');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus mitra ini? Logo juga akan dihapus dari storage.')) return;

        try {
            const result = await deletePartner(id);

            if (result.success) {
                toast.success('Mitra berhasil dihapus');
                fetchPartners();
            } else {
                toast.error(result.error || 'Gagal menghapus mitra');
            }
        } catch (error) {
            console.error('Error deleting partner:', error);
            toast.error('Terjadi kesalahan saat menghapus');
        }
    }

    async function handleToggleStatus(id: string, currentStatus: boolean) {
        try {
            const result = await togglePartnerStatus(id, !currentStatus);

            if (result.success) {
                toast.success(!currentStatus ? 'Mitra diaktifkan' : 'Mitra dinonaktifkan');
                fetchPartners();
            } else {
                toast.error(result.error || 'Gagal mengubah status');
            }
        } catch (error) {
            console.error('Error toggling partner status:', error);
            toast.error('Terjadi kesalahan saat mengubah status');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Kelola Mitra</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola logo mitra yang ditampilkan di slider
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/mitra/tambah">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Mitra
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Mitra</CardTitle>
                    <CardDescription>
                        Total {partners.length} mitra terdaftar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari berdasarkan nama..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Logo</TableHead>
                                    <TableHead>Nama Mitra</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Link</TableHead>
                                    <TableHead className="w-[100px]">Urutan</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            Memuat data...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPartners.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                            {searchQuery ? 'Tidak ada mitra yang cocok' : 'Belum ada mitra. Klik "Tambah Mitra" untuk memulai.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPartners.map((partner) => (
                                        <TableRow key={partner.id}>
                                            <TableCell>
                                                <img
                                                    src={partner.logo_url}
                                                    alt={partner.name}
                                                    className="h-10 w-16 object-contain rounded border bg-white"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{partner.name}</TableCell>
                                            <TableCell>
                                                {partner.category ? (
                                                    <Badge variant="outline">{partner.category}</Badge>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {partner.link_url ? (
                                                    <a
                                                        href={partner.link_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-teal-600 hover:underline"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        Buka Link
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{partner.sort_order}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={partner.is_active ? 'default' : 'secondary'}>
                                                    {partner.is_active ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/mitra/edit/${partner.id}`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleStatus(partner.id, partner.is_active)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {partner.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(partner.id)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
