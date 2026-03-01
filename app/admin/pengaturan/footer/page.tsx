'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultData = {
    copyright_text: '© 2026 SMK Mustaqbal. Hak Cipta Dilindungi.',
    footer_description: 'SMK Mustaqbal - Mencetak Generasi Unggul, Berkarakter, dan Siap Kerja.',
    footer_links: [
        { label: 'Tentang Kami', url: '/tentang-kami' },
        { label: 'Program Keahlian', url: '/program-keahlian' },
        { label: 'Berita', url: '/berita' },
        { label: 'PPDB', url: '/ppdb' },
        { label: 'Hubungi Kami', url: '/kontak' },
    ],
    additional_text: 'Jl. Pendidikan No. 123, Kabupaten Bandung, Jawa Barat',
};

export default function FooterPage() {
    const [data, setData] = useState(defaultData);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => { console.log('[DUMMY] Save footer:', data); toast.success('Disimpan (dummy)'); setSaving(false); }, 800);
    };

    const addLink = () => setData(p => ({ ...p, footer_links: [...p.footer_links, { label: '', url: '' }] }));
    const updateLink = (i: number, f: string, v: string) => setData(p => ({ ...p, footer_links: p.footer_links.map((l, idx) => idx === i ? { ...l, [f]: v } : l) }));
    const removeLink = (i: number) => setData(p => ({ ...p, footer_links: p.footer_links.filter((_, idx) => idx !== i) }));

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold">Pengaturan — Footer & Hak Cipta</h1><p className="text-gray-500">Kelola konten footer website</p></div>
            <Card>
                <CardHeader><CardTitle>Informasi Footer</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Deskripsi Footer</Label><Textarea rows={2} value={data.footer_description} onChange={e => setData(p => ({ ...p, footer_description: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>Teks Hak Cipta</Label><Input value={data.copyright_text} onChange={e => setData(p => ({ ...p, copyright_text: e.target.value }))} /></div>
                    <div className="space-y-2"><Label>Informasi Tambahan (Alamat, dll)</Label><Textarea rows={2} value={data.additional_text} onChange={e => setData(p => ({ ...p, additional_text: e.target.value }))} /></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div><CardTitle>Link Footer</CardTitle><CardDescription>Daftar link navigasi di footer</CardDescription></div>
                        <Button variant="outline" size="sm" onClick={addLink}><Plus className="w-4 h-4 mr-1" /> Tambah</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.footer_links.map((link, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Input value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} placeholder="Label" className="flex-1" />
                            <Input value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="URL (/path)" className="flex-1" />
                            <Button variant="ghost" size="sm" className="text-red-500 shrink-0" onClick={() => removeLink(i)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Simpan
            </Button>
        </div>
    );
}
