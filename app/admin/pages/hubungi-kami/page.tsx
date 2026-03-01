'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPageSettings, updatePageSettings } from '@/lib/actions/page-settings';

const defaultSettings = {
    page_title: 'Hubungi Kami',
    page_subtitle: 'Kami siap membantu. Hubungi kami melalui kontak di bawah.',
    address: 'Jl. Pendidikan No. 123, Kab. Bandung, Jawa Barat 40381',
    phone: '(022) 1234567',
    whatsapp: '6281234567890',
    email: 'info@smkmustaqbal.sch.id',
    google_maps_embed: '',
    operating_hours: 'Senin-Jumat: 07:00-15:00\nSabtu: 07:00-12:00',
};

export default function HubungiKamiPage() {
    const [s, setS] = useState(defaultSettings);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const data = await getPageSettings<typeof defaultSettings>('hubungi-kami');
            if (data) setS(prev => ({ ...prev, ...data }));
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updatePageSettings('hubungi-kami', s as unknown as Record<string, unknown>);
            if (!result.success) throw new Error(result.error);
            toast.success('Pengaturan Hubungi Kami berhasil disimpan');
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const u = (f: string, v: string) => setS(p => ({ ...p, [f]: v }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manajemen Halaman — Hubungi Kami</h1>
                <p className="text-gray-500">Kelola informasi kontak dan peta lokasi</p>
            </div>

            <Card>
                <CardHeader><CardTitle>Header</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Judul</Label><Input value={s.page_title} onChange={e => u('page_title', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Subjudul</Label><Textarea rows={2} value={s.page_subtitle} onChange={e => u('page_subtitle', e.target.value)} /></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Informasi Kontak</CardTitle><CardDescription>Data kontak yang ditampilkan</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Alamat</Label><Textarea rows={2} value={s.address} onChange={e => u('address', e.target.value)} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Telepon</Label><Input value={s.phone} onChange={e => u('phone', e.target.value)} /></div>
                        <div className="space-y-2"><Label>WhatsApp</Label><Input value={s.whatsapp} onChange={e => u('whatsapp', e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={s.email} onChange={e => u('email', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Jam Operasional</Label><Textarea rows={3} value={s.operating_hours} onChange={e => u('operating_hours', e.target.value)} /></div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Peta (Google Maps)</CardTitle><CardDescription>Embed URL Google Maps</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Google Maps Embed URL</Label>
                        <Input value={s.google_maps_embed} onChange={e => u('google_maps_embed', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
                        <p className="text-xs text-gray-500">Google Maps → Share → Embed → Salin URL dari src</p>
                    </div>
                    {s.google_maps_embed && (
                        <iframe src={s.google_maps_embed} width="100%" height="300" className="rounded-lg border" style={{ border: 0 }} allowFullScreen loading="lazy" title="Peta" />
                    )}
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan
            </Button>
        </div>
    );
}
