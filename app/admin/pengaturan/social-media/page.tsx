'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Facebook, Instagram, Youtube } from 'lucide-react';
import { toast } from 'sonner';

const defaultData = {
    facebook: 'https://facebook.com/smkmustaqbal',
    instagram: 'https://instagram.com/smkmustaqbal',
    youtube: 'https://youtube.com/@smkmustaqbal',
    twitter: 'https://twitter.com/smkmustaqbal',
    tiktok: 'https://tiktok.com/@smkmustaqbal',
    linkedin: '',
};

export default function SocialMediaPage() {
    const [data, setData] = useState(defaultData);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => { console.log('[DUMMY] Save social media:', data); toast.success('Disimpan (dummy)'); setSaving(false); }, 800);
    };

    const u = (f: string, v: string) => setData(p => ({ ...p, [f]: v }));

    const socialItems = [
        { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/...' },
        { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/...' },
        { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@...' },
        { key: 'twitter', label: 'Twitter / X', icon: null, placeholder: 'https://twitter.com/...' },
        { key: 'tiktok', label: 'TikTok', icon: null, placeholder: 'https://tiktok.com/@...' },
        { key: 'linkedin', label: 'LinkedIn', icon: null, placeholder: 'https://linkedin.com/company/...' },
    ];

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold">Pengaturan — Social Media</h1><p className="text-gray-500">Link akun sosial media sekolah</p></div>
            <Card>
                <CardHeader><CardTitle>Akun Social Media</CardTitle><CardDescription>Masukkan URL profil sosial media</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    {socialItems.map(item => (
                        <div key={item.key} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                {item.icon ? <item.icon className="w-5 h-5 text-gray-600" /> : <span className="text-sm font-bold text-gray-500">{item.label[0]}</span>}
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs">{item.label}</Label>
                                <Input value={(data as any)[item.key]} onChange={e => u(item.key, e.target.value)} placeholder={item.placeholder} />
                            </div>
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
