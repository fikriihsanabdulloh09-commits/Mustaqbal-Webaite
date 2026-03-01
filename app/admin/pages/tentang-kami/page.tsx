'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Loader2, Info, Users, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { getPageSettings, updatePageSettings } from '@/lib/actions/page-settings';

// ============================================================
// DUMMY DATA — Fase 1 (tanpa database)
// ============================================================
const defaultProfil = {
    profil_text: 'SMK Mustaqbal adalah sekolah menengah kejuruan unggulan yang berdedikasi untuk mencetak lulusan yang kompeten, berkarakter, dan siap bersaing di dunia industri. Dengan kurikulum berbasis kompetensi dan fasilitas modern, kami berkomitmen memberikan pendidikan terbaik bagi generasi muda Indonesia.',
    highlight_quote: '"Mencetak Generasi Unggul, Berkarakter, dan Siap Kerja"',
    visi: 'Menjadi SMK unggulan yang menghasilkan lulusan kompeten, berkarakter, dan berdaya saing global di bidang teknologi dan industri kreatif.',
    misi_items: [
        'Menyelenggarakan pendidikan kejuruan berbasis kompetensi dan teknologi terkini',
        'Membangun karakter peserta didik yang berakhlak mulia, disiplin, dan bertanggung jawab',
        'Menjalin kerjasama strategis dengan dunia usaha dan industri',
        'Mengembangkan budaya inovasi, kreativitas, dan kewirausahaan',
    ],
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tagline: 'Langkah Awal Menuju Masa Depan Hebat',
    tagline_desc: 'Bangun karir impianmu bersama SMK Mustaqbal.',
};

const defaultSambutan = {
    nama_kepsek: 'Drs. H. Ahmad Suryadi, M.Pd.',
    jabatan: 'Kepala Sekolah SMK Mustaqbal',
    foto_url: '',
    sambutan_text: 'Assalamu\'alaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di website resmi SMK Mustaqbal. Kami berkomitmen untuk menyediakan pendidikan kejuruan yang berkualitas tinggi, berbasis kompetensi, dan berwawasan global.\n\nDengan dukungan tenaga pendidik yang profesional, fasilitas pembelajaran yang modern, serta kerjasama yang erat dengan dunia industri, kami yakin SMK Mustaqbal akan terus menjadi pilihan utama bagi para siswa yang ingin meraih masa depan cerah.\n\nSalam Pendidikan,',
};

const defaultGuruLayout = {
    section_title: 'Tenaga Pendidik Profesional',
    section_subtitle: 'Tim pengajar kami terdiri dari praktisi industri dan akademisi berpengalaman yang siap membimbing siswa menuju kesuksesan.',
    display_style: 'grid',
    show_contact: true,
    show_education: true,
    columns: '4',
};

export default function TentangKamiPage() {
    const [profil, setProfil] = useState(defaultProfil);
    const [sambutan, setSambutan] = useState(defaultSambutan);
    const [guruLayout, setGuruLayout] = useState(defaultGuruLayout);
    const [saving, setSaving] = useState(false);

    // Load saved settings from Supabase on mount
    useEffect(() => {
        async function load() {
            const data = await getPageSettings<{ profil: typeof defaultProfil; sambutan: typeof defaultSambutan; guruLayout: typeof defaultGuruLayout }>('tentang-kami');
            if (data) {
                if (data.profil) setProfil(prev => ({ ...prev, ...data.profil }));
                if (data.sambutan) setSambutan(prev => ({ ...prev, ...data.sambutan }));
                if (data.guruLayout) setGuruLayout(prev => ({ ...prev, ...data.guruLayout }));
            }
        }
        load();
    }, []);

    const handleSave = async (section: string) => {
        setSaving(true);
        try {
            const content = { profil, sambutan, guruLayout };
            const result = await updatePageSettings('tentang-kami', content as unknown as Record<string, unknown>);
            if (!result.success) throw new Error(result.error);
            toast.success(`Pengaturan ${section} berhasil disimpan`);
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const addMisiItem = () => {
        setProfil(prev => ({ ...prev, misi_items: [...prev.misi_items, ''] }));
    };

    const updateMisiItem = (index: number, value: string) => {
        setProfil(prev => {
            const items = [...prev.misi_items];
            items[index] = value;
            return { ...prev, misi_items: items };
        });
    };

    const removeMisiItem = (index: number) => {
        setProfil(prev => ({
            ...prev,
            misi_items: prev.misi_items.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manajemen Halaman — Tentang Kami</h1>
                <p className="text-gray-500">Kelola konten halaman Tentang Kami (Profil, Sambutan, & Layout Guru)</p>
            </div>

            <Tabs defaultValue="profil" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="profil" className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Profil & Visi Misi
                    </TabsTrigger>
                    <TabsTrigger value="sambutan" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Sambutan Kepsek
                    </TabsTrigger>
                    <TabsTrigger value="guru-layout" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Layout Profil Guru
                    </TabsTrigger>
                </TabsList>

                {/* ── Tab 1: Profil, Video Tagline, Visi & Misi ── */}
                <TabsContent value="profil" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil Sekolah & Video Tagline</CardTitle>
                            <CardDescription>Edit teks profil, tagline, dan video yang tampil di halaman Tentang Kami</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="profil_text">Teks Profil Sekolah</Label>
                                <Textarea
                                    id="profil_text"
                                    rows={6}
                                    value={profil.profil_text}
                                    onChange={e => setProfil(prev => ({ ...prev, profil_text: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="highlight_quote">Highlight Quote</Label>
                                <Input
                                    id="highlight_quote"
                                    value={profil.highlight_quote}
                                    onChange={e => setProfil(prev => ({ ...prev, highlight_quote: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tagline">Judul Tagline</Label>
                                    <Input
                                        id="tagline"
                                        value={profil.tagline}
                                        onChange={e => setProfil(prev => ({ ...prev, tagline: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tagline_desc">Deskripsi Tagline</Label>
                                    <Input
                                        id="tagline_desc"
                                        value={profil.tagline_desc}
                                        onChange={e => setProfil(prev => ({ ...prev, tagline_desc: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="youtube_url">URL Video YouTube Tagline</Label>
                                <Input
                                    id="youtube_url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={profil.youtube_url}
                                    onChange={e => setProfil(prev => ({ ...prev, youtube_url: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Visi & Misi</CardTitle>
                            <CardDescription>Kelola visi dan poin-poin misi sekolah</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="visi">Visi</Label>
                                <Textarea
                                    id="visi"
                                    rows={3}
                                    value={profil.visi}
                                    onChange={e => setProfil(prev => ({ ...prev, visi: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Misi</Label>
                                    <Button variant="outline" size="sm" onClick={addMisiItem}>+ Tambah Misi</Button>
                                </div>
                                {profil.misi_items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400 w-6">{index + 1}.</span>
                                        <Input
                                            value={item}
                                            onChange={e => updateMisiItem(index, e.target.value)}
                                            placeholder={`Misi ke-${index + 1}`}
                                        />
                                        <Button variant="ghost" size="sm" className="text-red-500 shrink-0" onClick={() => removeMisiItem(index)}>✕</Button>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={() => handleSave('profil')} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Profil & Visi Misi
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Tab 2: Sambutan Kepala Sekolah ── */}
                <TabsContent value="sambutan" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sambutan Kepala Sekolah</CardTitle>
                            <CardDescription>Edit foto dan teks sambutan kepala sekolah</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_kepsek">Nama Kepala Sekolah</Label>
                                    <Input
                                        id="nama_kepsek"
                                        value={sambutan.nama_kepsek}
                                        onChange={e => setSambutan(prev => ({ ...prev, nama_kepsek: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jabatan">Jabatan</Label>
                                    <Input
                                        id="jabatan"
                                        value={sambutan.jabatan}
                                        onChange={e => setSambutan(prev => ({ ...prev, jabatan: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Foto Kepala Sekolah</Label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-teal-400 transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">Klik untuk upload foto</p>
                                    <p className="text-xs text-gray-400">JPG, PNG max 2MB</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sambutan_text">Teks Sambutan</Label>
                                <Textarea
                                    id="sambutan_text"
                                    rows={10}
                                    value={sambutan.sambutan_text}
                                    onChange={e => setSambutan(prev => ({ ...prev, sambutan_text: e.target.value }))}
                                />
                            </div>

                            <Button onClick={() => handleSave('sambutan')} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Sambutan
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Tab 3: Layout Profil Guru ── */}
                <TabsContent value="guru-layout" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Layout Section Profil Guru</CardTitle>
                            <CardDescription>Atur tampilan section daftar guru di halaman Tentang Kami</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="guru_section_title">Judul Section</Label>
                                <Input
                                    id="guru_section_title"
                                    value={guruLayout.section_title}
                                    onChange={e => setGuruLayout(prev => ({ ...prev, section_title: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guru_section_subtitle">Subjudul Section</Label>
                                <Textarea
                                    id="guru_section_subtitle"
                                    rows={3}
                                    value={guruLayout.section_subtitle}
                                    onChange={e => setGuruLayout(prev => ({ ...prev, section_subtitle: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="display_style">Gaya Tampilan</Label>
                                    <select
                                        id="display_style"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={guruLayout.display_style}
                                        onChange={e => setGuruLayout(prev => ({ ...prev, display_style: e.target.value }))}
                                    >
                                        <option value="grid">Grid Card</option>
                                        <option value="list">List View</option>
                                        <option value="carousel">Carousel / Slider</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="columns">Jumlah Kolom (Grid)</Label>
                                    <select
                                        id="columns"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={guruLayout.columns}
                                        onChange={e => setGuruLayout(prev => ({ ...prev, columns: e.target.value }))}
                                    >
                                        <option value="3">3 Kolom</option>
                                        <option value="4">4 Kolom</option>
                                        <option value="5">5 Kolom</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <h4 className="font-medium text-sm">Opsi Tampilan</h4>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="show_contact">Tampilkan Kontak Guru</Label>
                                    <Switch
                                        id="show_contact"
                                        checked={guruLayout.show_contact}
                                        onCheckedChange={checked => setGuruLayout(prev => ({ ...prev, show_contact: checked }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="show_education">Tampilkan Pendidikan</Label>
                                    <Switch
                                        id="show_education"
                                        checked={guruLayout.show_education}
                                        onCheckedChange={checked => setGuruLayout(prev => ({ ...prev, show_education: checked }))}
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-gray-500">* Data guru dikelola di menu Master Data → Data Guru & Staff</p>

                            <Button onClick={() => handleSave('guru-layout')} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Layout Guru
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
