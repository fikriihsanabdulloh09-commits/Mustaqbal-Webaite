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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface PPDBSubmission {
  id: string;
  registration_number: string;
  full_name: string;
  email: string;
  phone: string;
  origin_school: string;
  chosen_program: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  created_at: string;
}

export default function PPDBPage() {
  const [submissions, setSubmissions] = useState<PPDBSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<PPDBSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    // Filter by search
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(sub =>
        sub.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.origin_school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchQuery, statusFilter, submissions]);

  async function fetchSubmissions() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ppdb_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Gagal memuat data pendaftar');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('ppdb_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Pendaftar ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal mengubah status');
    }
  }

  function exportToCSV() {
    const headers = ['No. Registrasi', 'Nama', 'Email', 'Telepon', 'Asal Sekolah', 'Program', 'Status', 'Tanggal'];
    const rows = filteredSubmissions.map(sub => [
      sub.registration_number || '',
      sub.full_name,
      sub.email || '',
      sub.phone,
      sub.origin_school,
      sub.chosen_program || '',
      sub.status,
      new Date(sub.created_at).toLocaleDateString('id-ID'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ppdb-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('Data berhasil diekspor');
  }

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manajemen PPDB</h2>
        <p className="text-gray-500 mt-1">
          Kelola pendaftaran peserta didik baru
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Pendaftar</CardTitle>
              <CardDescription>
                {filteredSubmissions.length} dari {submissions.length} pendaftar
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari pendaftar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Asal Sekolah</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery || statusFilter !== 'all' ? 'Tidak ada pendaftar yang cocok' : 'Belum ada pendaftar'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="font-medium">{sub.full_name}</div>
                      <div className="text-sm text-gray-500">{sub.email}</div>
                    </TableCell>
                    <TableCell>{sub.origin_school}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.chosen_program || '-'}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{sub.phone}</TableCell>
                    <TableCell>
                      {sub.status === 'approved' ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : sub.status === 'rejected' ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => updateStatus(sub.id, 'approved')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => updateStatus(sub.id, 'rejected')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
