'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const defaultData = {
    logo_url: '',
    favicon_url: '',
    primary_color: '#0D9488',
    secondary_color: '#F59E0B',
    accent_color: '#6366F1',
    font_heading: 'Inter',
    font_body: 'Inter',
};

export default function BrandingPage() {
    const [data, setData] = useState(defaultData);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => { console.log('[DUMMY] Save branding:', data); toast.success('Disimpan (dummy)'); setSaving(false); }, 800);
    };

    const u = (f: string, v: string) => setData(p => ({ ...p, [f]: v }));

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold">Pengaturan — Branding & Logo</h1><p className="text-gray-500">Kelola identitas visual website</p></div>
            <Card>
                <CardHeader><CardTitle>Logo & Favicon</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Logo Utama</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Upload Logo</p>
                                <p className="text-xs text-gray-400">PNG, SVG (max 1MB)</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Favicon</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">Upload Favicon</p>
                                <p className="text-xs text-gray-400">ICO, PNG 32x32px</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Warna Brand</CardTitle><CardDescription>Gunakan color picker untuk memilih warna</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Primary Color</Label>
                            <div className="flex gap-2"><input type="color" value={data.primary_color} onChange={e => u('primary_color', e.target.value)} className="h-10 w-14 rounded border cursor-pointer" /><Input value={data.primary_color} onChange={e => u('primary_color', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Secondary Color</Label>
                            <div className="flex gap-2"><input type="color" value={data.secondary_color} onChange={e => u('secondary_color', e.target.value)} className="h-10 w-14 rounded border cursor-pointer" /><Input value={data.secondary_color} onChange={e => u('secondary_color', e.target.value)} /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Accent Color</Label>
                            <div className="flex gap-2"><input type="color" value={data.accent_color} onChange={e => u('accent_color', e.target.value)} className="h-10 w-14 rounded border cursor-pointer" /><Input value={data.accent_color} onChange={e => u('accent_color', e.target.value)} /></div>
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg border">
                        <p className="text-sm font-medium mb-2">Preview</p>
                        <div className="flex gap-3">
                            <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: data.primary_color }}><p className="text-white text-xs p-2">Primary</p></div>
                            <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: data.secondary_color }}><p className="text-white text-xs p-2">Secondary</p></div>
                            <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: data.accent_color }}><p className="text-white text-xs p-2">Accent</p></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Font Heading</Label><Input value={data.font_heading} onChange={e => u('font_heading', e.target.value)} /></div>
                        <div className="space-y-2"><Label>Font Body</Label><Input value={data.font_body} onChange={e => u('font_body', e.target.value)} /></div>
                    </div>
                </CardContent>
            </Card>
            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Simpan
            </Button>
        </div>
    );
}
