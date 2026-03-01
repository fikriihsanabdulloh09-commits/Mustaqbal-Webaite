'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultData = {
    school_name: 'SMK Mustaqbal',
    tagline: 'Langkah Awal Menuju Masa Depan Hebat',
    npsn: '20255687',
    accreditation: 'A',
    address: 'Jl. Pendidikan No. 123, Kecamatan Ciparay, Kabupaten Bandung, Jawa Barat 40381',
    phone: '(022) 1234567',
    fax: '(022) 1234568',
    email: 'info@smkmustaqbal.sch.id',
    website: 'https://smkmustaqbal.sch.id',
    whatsapp: '6281234567890',
    headmaster: 'Drs. H. Ahmad Suryadi, M.Pd.',
    year_founded: '2005',
};

export default function InformasiUmumPage() {
    const [data, setData] = useState(defaultData);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => { console.log('[DUMMY] Save info umum:', data); toast.success('Disimpan (dummy)'); setSaving(false); }, 800);
    };

    const u = (f: string, v: string) => setData(p => ({ ...p, [f]: v }));

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold">Pengaturan — Informasi Umum Sekolah</h1><p className="text-gray-500">Data dasar sekolah yang digunakan di seluruh website</p></div>
            <Card>
                <CardHeader><CardTitle>Identitas Sekolah</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Nama Sekolah</Label><Input value={data.school_name} onChange={e => u('school_name', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Tagline</Label><Input value={data.tagline} onChange={e => u('tagline', e.target.value)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>NPSN</Label><Input value={data.npsn} onChange={e => u('npsn', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Akreditasi</Label><Input value={data.accreditation} onChange={e => u('accreditation', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Tahun Berdiri</Label><Input value={data.year_founded} onChange={e => u('year_founded', e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Kepala Sekolah</Label><Input value={data.headmaster} onChange={e => u('headmaster', e.target.value)} /></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Alamat & Kontak</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Alamat Lengkap</Label><Textarea rows={2} value={data.address} onChange={e => u('address', e.target.value)} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Telepon</Label><Input value={data.phone} onChange={e => u('phone', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Fax</Label><Input value={data.fax} onChange={e => u('fax', e.target.value)} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Email</Label><Input type="email" value={data.email} onChange={e => u('email', e.target.value)} /></div>
                        <div className="space-y-2"><Label>WhatsApp</Label><Input value={data.whatsapp} onChange={e => u('whatsapp', e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Website</Label><Input value={data.website} onChange={e => u('website', e.target.value)} /></div>
                </CardContent>
            </Card>
            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Simpan
            </Button>
        </div>
    );
}
