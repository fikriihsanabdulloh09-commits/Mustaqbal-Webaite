'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPageSettings, updatePageSettings } from '@/lib/actions/page-settings';

const defaultSettings = {
    page_title: 'Pendaftaran Peserta Didik Baru (PPDB)',
    page_subtitle: 'Daftarkan diri Anda untuk menjadi bagian dari SMK Mustaqbal.',
    is_open: true,
    open_date: '2026-01-15',
    close_date: '2026-07-31',
    info_text: 'Pendaftaran dibuka secara online. Siapkan dokumen berupa: Ijazah/SKL, Kartu Keluarga, Akta Kelahiran, dan Pas Foto.',
    show_requirements: true,
    requirements: 'Lulus SMP/MTs sederajat\nUsia maksimal 21 tahun\nBerbadan sehat',
    contact_person: 'Panitia PPDB: 081234567890',
};

export default function PPDBLayoutPage() {
    const [s, setS] = useState(defaultSettings);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const data = await getPageSettings<typeof defaultSettings>('ppdb-layout');
            if (data) setS(prev => ({ ...prev, ...data }));
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updatePageSettings('ppdb-layout', s as unknown as Record<string, unknown>);
            if (!result.success) throw new Error(result.error);
            toast.success('Layout PPDB berhasil disimpan');
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const u = (f: string, v: any) => setS(p => ({ ...p, [f]: v }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manajemen Halaman — Pendaftaran PPDB</h1>
                <p className="text-gray-500">Atur layout dan informasi form pendaftaran PPDB</p>
            </div>

            <Card>
                <CardHeader><CardTitle>Header Halaman</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Judul</Label><Input value={s.page_title} onChange={e => u('page_title', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Subjudul</Label><Textarea rows={2} value={s.page_subtitle} onChange={e => u('page_subtitle', e.target.value)} /></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Status Pendaftaran</CardTitle><CardDescription>Buka/tutup pendaftaran dan atur jadwal</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Pendaftaran Dibuka</Label>
                        <Switch checked={s.is_open} onCheckedChange={v => u('is_open', v)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Tanggal Buka</Label><Input type="date" value={s.open_date} onChange={e => u('open_date', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Tanggal Tutup</Label><Input type="date" value={s.close_date} onChange={e => u('close_date', e.target.value)} /></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Informasi & Persyaratan</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Informasi Pendaftaran</Label><Textarea rows={3} value={s.info_text} onChange={e => u('info_text', e.target.value)} /></div>
                    <div className="flex items-center justify-between">
                        <Label>Tampilkan Persyaratan</Label>
                        <Switch checked={s.show_requirements} onCheckedChange={v => u('show_requirements', v)} />
                    </div>
                    {s.show_requirements && (
                        <div className="space-y-2"><Label>Persyaratan (satu per baris)</Label><Textarea rows={4} value={s.requirements} onChange={e => u('requirements', e.target.value)} /></div>
                    )}
                    <div className="space-y-2"><Label>Contact Person</Label><Input value={s.contact_person} onChange={e => u('contact_person', e.target.value)} /></div>
                    <p className="text-sm text-gray-500">* Data pendaftar dikelola di Master Data → Data Pendaftar PPDB</p>
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan Layout PPDB
            </Button>
        </div>
    );
}
