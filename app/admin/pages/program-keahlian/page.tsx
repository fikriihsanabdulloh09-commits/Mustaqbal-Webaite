'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Loader2, FileText, Briefcase, Upload, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPageSettings, updatePageSettings } from '@/lib/actions/page-settings';

const defaultHeader = {
    section_title: 'Program Keahlian Unggulan',
    section_subtitle: 'Pilih jurusan yang sesuai dengan minat dan bakatmu. Semua program dirancang untuk mempersiapkan kompetensi siap kerja.',
    background_image_url: '',
    badge_text: 'Kurikulum Merdeka',
};

const defaultFasilitas = {
    section_title: 'Fasilitas & Prospek Karir',
    section_subtitle: 'Fasilitas modern dan jalur karir yang jelas untuk setiap program keahlian',
    facilities: [
        { name: 'Lab Komputer', description: 'Dilengkapi 40 unit PC terbaru dengan spesifikasi tinggi', icon: 'Monitor' },
        { name: 'Workshop Multimedia', description: 'Studio green screen, peralatan videografi profesional', icon: 'Camera' },
        { name: 'Lab Jaringan', description: 'Simulator jaringan Cisco & MikroTik lengkap', icon: 'Wifi' },
    ],
    career_prospects: [
        'Junior Web Developer',
        'Network Administrator',
        'UI/UX Designer',
        'Data Entry Specialist',
        'IT Support Engineer',
        'Digital Marketing Specialist',
    ],
};

export default function ProgramKeahlianLayoutPage() {
    const [header, setHeader] = useState(defaultHeader);
    const [fasilitas, setFasilitas] = useState(defaultFasilitas);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const data = await getPageSettings<{ header: typeof defaultHeader; fasilitas: typeof defaultFasilitas }>('program-keahlian');
            if (data) {
                if (data.header) setHeader(prev => ({ ...prev, ...data.header }));
                if (data.fasilitas) setFasilitas(prev => ({ ...prev, ...data.fasilitas }));
            }
        }
        load();
    }, []);

    const handleSave = async (section: string) => {
        setSaving(true);
        try {
            const result = await updatePageSettings('program-keahlian', { header, fasilitas } as unknown as Record<string, unknown>);
            if (!result.success) throw new Error(result.error);
            toast.success(`Pengaturan ${section} berhasil disimpan`);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const addFacility = () => {
        setFasilitas(prev => ({
            ...prev,
            facilities: [...prev.facilities, { name: '', description: '', icon: 'Box' }],
        }));
    };

    const updateFacility = (index: number, field: string, value: string) => {
        setFasilitas(prev => {
            const items = [...prev.facilities];
            items[index] = { ...items[index], [field]: value };
            return { ...prev, facilities: items };
        });
    };

    const removeFacility = (index: number) => {
        setFasilitas(prev => ({
            ...prev,
            facilities: prev.facilities.filter((_, i) => i !== index),
        }));
    };

    const addCareer = () => {
        setFasilitas(prev => ({
            ...prev,
            career_prospects: [...prev.career_prospects, ''],
        }));
    };

    const updateCareer = (index: number, value: string) => {
        setFasilitas(prev => {
            const items = [...prev.career_prospects];
            items[index] = value;
            return { ...prev, career_prospects: items };
        });
    };

    const removeCareer = (index: number) => {
        setFasilitas(prev => ({
            ...prev,
            career_prospects: prev.career_prospects.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manajemen Halaman — Program Keahlian</h1>
                <p className="text-gray-500">Kelola tampilan halaman Program Keahlian</p>
            </div>

            <Tabs defaultValue="header" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                    <TabsTrigger value="header" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Layout Header
                    </TabsTrigger>
                    <TabsTrigger value="fasilitas" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Fasilitas & Karir
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Layout Header */}
                <TabsContent value="header" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Layout Header Program Keahlian</CardTitle>
                            <CardDescription>Atur judul, subjudul, dan background halaman Program Keahlian</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="header_title">Judul Section</Label>
                                <Input id="header_title" value={header.section_title} onChange={e => setHeader(prev => ({ ...prev, section_title: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="header_subtitle">Subjudul Section</Label>
                                <Textarea id="header_subtitle" rows={3} value={header.section_subtitle} onChange={e => setHeader(prev => ({ ...prev, section_subtitle: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="badge_text">Badge Text</Label>
                                <Input id="badge_text" value={header.badge_text} onChange={e => setHeader(prev => ({ ...prev, badge_text: e.target.value }))} placeholder="Kurikulum Merdeka" />
                            </div>
                            <div className="space-y-2">
                                <Label>Background Image</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">Klik untuk upload background image</p>
                                    <p className="text-xs text-gray-400">JPG, PNG, WEBP max 5MB</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">* Data program keahlian dikelola di menu Master Data → Data Program Keahlian</p>
                            <Button onClick={() => handleSave('header')} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Header
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Fasilitas & Prospek Karir */}
                <TabsContent value="fasilitas" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fasilitas Sekolah</CardTitle>
                            <CardDescription>Daftar fasilitas yang ditampilkan di halaman Program Keahlian</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label>Judul Section</Label>
                                <Input value={fasilitas.section_title} onChange={e => setFasilitas(prev => ({ ...prev, section_title: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subjudul Section</Label>
                                <Textarea rows={2} value={fasilitas.section_subtitle} onChange={e => setFasilitas(prev => ({ ...prev, section_subtitle: e.target.value }))} />
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-sm">Daftar Fasilitas</h4>
                                    <Button variant="outline" size="sm" onClick={addFacility}><Plus className="w-4 h-4 mr-1" /> Tambah</Button>
                                </div>
                                {fasilitas.facilities.map((f, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-sm">Fasilitas #{i + 1}</span>
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeFacility(i)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Nama Icon (Lucide)</Label>
                                                <Input value={f.icon} onChange={e => updateFacility(i, 'icon', e.target.value)} placeholder="Monitor" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Nama Fasilitas</Label>
                                                <Input value={f.name} onChange={e => updateFacility(i, 'name', e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Deskripsi</Label>
                                                <Input value={f.description} onChange={e => updateFacility(i, 'description', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Prospek Karir</CardTitle>
                            <CardDescription>Daftar prospek karir lulusan yang ditampilkan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Daftar Karir</Label>
                                <Button variant="outline" size="sm" onClick={addCareer}><Plus className="w-4 h-4 mr-1" /> Tambah</Button>
                            </div>
                            {fasilitas.career_prospects.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 w-6">{i + 1}.</span>
                                    <Input value={c} onChange={e => updateCareer(i, e.target.value)} />
                                    <Button variant="ghost" size="sm" className="text-red-500 shrink-0" onClick={() => removeCareer(i)}>✕</Button>
                                </div>
                            ))}
                            <Button onClick={() => handleSave('fasilitas')} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Fasilitas & Karir
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
