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
import { Plus, Trash2, Edit, FileText, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
    id: string;
    title: string;
    filename: string;
    url: string;
    category?: string;
    description?: string;
    download_count: number;
    is_public: boolean;
    created_at: string;
}

export default function EbrosurPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Document | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        filename: '',
        url: '',
        description: '',
        is_public: true,
    });

    useEffect(() => {
        fetchDocuments();
    }, []);

    async function fetchDocuments() {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('category', 'ebrosur')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDocuments(data || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
            toast.error('Gagal memuat E-Brosur');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit() {
        try {
            const supabase = createClient();

            if (editingItem) {
                const { error } = await supabase
                    .from('documents')
                    .update({
                        ...formData,
                        category: 'ebrosur',
                    })
                    .eq('id', editingItem.id);

                if (error) throw error;
                toast.success('E-Brosur berhasil diupdate');
            } else {
                const { error } = await supabase
                    .from('documents')
                    .insert([{ ...formData, category: 'ebrosur' }]);

                if (error) throw error;
                toast.success('E-Brosur berhasil ditambahkan');
            }

            setDialogOpen(false);
            resetForm();
            fetchDocuments();
        } catch (error) {
            console.error('Error saving document:', error);
            toast.error('Gagal menyimpan E-Brosur');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus E-Brosur ini?')) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('E-Brosur berhasil dihapus');
            fetchDocuments();
        } catch (error) {
            console.error('Error deleting document:', error);
            toast.error('Gagal menghapus E-Brosur');
        }
    }

    function handleEdit(item: Document) {
        setEditingItem(item);
        setFormData({
            title: item.title,
            filename: item.filename,
            url: item.url,
            description: item.description || '',
            is_public: item.is_public,
        });
        setDialogOpen(true);
    }

    function resetForm() {
        setEditingItem(null);
        setFormData({
            title: '',
            filename: '',
            url: '',
            description: '',
            is_public: true,
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
                    <h2 className="text-3xl font-bold tracking-tight">E-Brosur</h2>
                    <p className="text-gray-500 mt-1">Kelola brosur digital sekolah</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah E-Brosur
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit E-Brosur' : 'Tambah E-Brosur Baru'}</DialogTitle>
                            <DialogDescription>
                                {editingItem ? 'Perbarui informasi E-Brosur' : 'Tambahkan E-Brosur baru'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Judul E-Brosur</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Brosur PPDB 2024"
                                />
                            </div>
                            <div>
                                <Label>Nama File</Label>
                                <Input
                                    value={formData.filename}
                                    onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                                    placeholder="brosur-ppdb-2024.pdf"
                                />
                            </div>
                            <div>
                                <Label>URL E-Brosur</Label>
                                <Input
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://example.com/brosur-ppdb-2024.pdf"
                                />
                            </div>
                            <div>
                                <Label>Deskripsi</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Deskripsi singkat E-Brosur"
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
                    <CardTitle>Daftar E-Brosur</CardTitle>
                    <CardDescription>Total: {documents.length} E-Brosur</CardDescription>
                </CardHeader>
                <CardContent>
                    {documents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada E-Brosur. Klik tombol "Tambah E-Brosur" untuk menambahkan.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Filename</TableHead>
                                    <TableHead>Unduhan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.title}</TableCell>
                                        <TableCell>{doc.filename}</TableCell>
                                        <TableCell>{doc.download_count}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${doc.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {doc.is_public ? 'Publik' : 'Private'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Button size="sm" variant="outline" asChild>
                                                    <a href={doc.url} download={doc.filename}>
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                                <Button size="sm" variant="secondary" onClick={() => handleEdit(doc)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDelete(doc.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}