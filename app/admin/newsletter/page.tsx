'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Mail, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Newsletter {
  id: string;
  email: string;
  name?: string;
  is_subscribed: boolean;
  verified: boolean;
  subscribed_at: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Gagal memuat subscribers');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus subscriber ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Subscriber berhasil dihapus');
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Gagal menghapus subscriber');
    }
  }

  function exportToCSV() {
    const csvContent = [
      ['Email', 'Name', 'Subscribed', 'Verified', 'Date'],
      ...subscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.is_subscribed ? 'Yes' : 'No',
        sub.verified ? 'Yes' : 'No',
        new Date(sub.subscribed_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data berhasil diexport');
  }

  const activeSubscribers = subscribers.filter(s => s.is_subscribed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h2>
          <p className="text-gray-500 mt-1">
            Kelola subscribers newsletter
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          disabled={subscribers.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeSubscribers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unsubscribed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-400">
              {subscribers.length - activeSubscribers}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Subscribers</CardTitle>
          <CardDescription>
            {subscribers.length} subscribers total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada subscribers</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.email}</TableCell>
                    <TableCell>{item.name || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.is_subscribed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.verified ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(item.subscribed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
