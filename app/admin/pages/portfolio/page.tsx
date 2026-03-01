'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, Upload, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPageSettings, updatePageSettings } from '@/lib/actions/page-settings';

const defaultSettings = {
    page_title: 'Portfolio Karya Siswa',
    page_subtitle: 'Lihat karya terbaik dari siswa-siswi SMK Mustaqbal di berbagai bidang keahlian.',
    display_style: 'grid',
    items_per_page: '12',
    show_filter: true,
    show_search: true,
    categories: ['Web Development', 'Mobile App', 'UI/UX Design', 'Multimedia', 'Networking', 'IoT'],
    background_image_url: '',
};

export default function PortfolioLayoutPage() {
    const [settings, setSettings] = useState(defaultSettings);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const data = await getPageSettings<typeof defaultSettings>('portfolio-layout');
            if (data) setSettings(prev => ({ ...prev, ...data }));
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updatePageSettings('portfolio-layout', settings as unknown as Record<string, unknown>);
            if (!result.success) throw new Error(result.error);
            toast.success('Layout Portfolio berhasil disimpan');
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const addCategory = () => {
        setSettings(prev => ({ ...prev, categories: [...prev.categories, ''] }));
    };

    const updateCategory = (index: number, value: string) => {
        setSettings(prev => {
            const cats = [...prev.categories];
            cats[index] = value;
            return { ...prev, categories: cats };
        });
    };

    const removeCategory = (index: number) => {
        setSettings(prev => ({
            ...prev,
            categories: prev.categories.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manajemen Halaman — Layout Portfolio</h1>
                <p className="text-gray-500">Atur tampilan dan konfigurasi halaman Portfolio</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pengaturan Header</CardTitle>
                    <CardDescription>Judul dan deskripsi halaman portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="page_title">Judul Halaman</Label>
                        <Input id="page_title" value={settings.page_title} onChange={e => setSettings(prev => ({ ...prev, page_title: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="page_subtitle">Subjudul Halaman</Label>
                        <Textarea id="page_subtitle" rows={3} value={settings.page_subtitle} onChange={e => setSettings(prev => ({ ...prev, page_subtitle: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Background Image (opsional)</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">Upload background image</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Pengaturan Tampilan</CardTitle>
                    <CardDescription>Atur gaya tampilan portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="display_style">Gaya Tampilan</Label>
                            <select
                                id="display_style"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={settings.display_style}
                                onChange={e => setSettings(prev => ({ ...prev, display_style: e.target.value }))}
                            >
                                <option value="grid">Grid Card</option>
                                <option value="masonry">Masonry Layout</option>
                                <option value="list">List View</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="items_per_page">Item Per Halaman</Label>
                            <select
                                id="items_per_page"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={settings.items_per_page}
                                onChange={e => setSettings(prev => ({ ...prev, items_per_page: e.target.value }))}
                            >
                                <option value="6">6</option>
                                <option value="9">9</option>
                                <option value="12">12</option>
                                <option value="15">15</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="show_filter">Tampilkan Filter Kategori</Label>
                            <Switch id="show_filter" checked={settings.show_filter} onCheckedChange={checked => setSettings(prev => ({ ...prev, show_filter: checked }))} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="show_search">Tampilkan Search Bar</Label>
                            <Switch id="show_search" checked={settings.show_search} onCheckedChange={checked => setSettings(prev => ({ ...prev, show_search: checked }))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Kategori Filter</CardTitle>
                    <CardDescription>Daftar kategori untuk filter portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Kategori</Label>
                        <Button variant="outline" size="sm" onClick={addCategory}><Plus className="w-4 h-4 mr-1" /> Tambah</Button>
                    </div>
                    {settings.categories.map((cat, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Input value={cat} onChange={e => updateCategory(i, e.target.value)} placeholder="Nama kategori" />
                            <Button variant="ghost" size="sm" className="text-red-500 shrink-0" onClick={() => removeCategory(i)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                    <p className="text-sm text-gray-500">* Data portfolio dikelola di menu Master Data → Data Portfolio Siswa</p>
                </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Simpan Layout Portfolio
            </Button>
        </div>
    );
}
