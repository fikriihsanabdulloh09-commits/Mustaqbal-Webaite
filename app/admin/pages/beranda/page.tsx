'use client';

import { useEffect, useState } from 'react';
import { getBerandaSettings, updatePageSettings, type BerandaSettings } from '@/lib/actions/page-settings';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Home,
    Star,
    GraduationCap,
    Handshake,
    MessageCircle,
    Newspaper,
    MessageSquare,
    Plus,
    Trash2,
    Save,
    Loader2
} from 'lucide-react';

// Default settings structure
const defaultSettings: BerandaSettings = {
    hero: {
        welcome_text: 'Penerimaan Siswa Baru Telah Dibuka',
        title: 'Langkah Awal Menuju Masa Depan Hebat',
        subtitle: 'Bangun karir impianmu bersama SMK Mustaqbal. Kurikulum berbasis industri, fasilitas modern, dan jaminan penyaluran kerja ke perusahaan ternama.',
        cta_primary_text: 'Daftar Sekarang',
        cta_primary_url: '/ppdb',
        cta_secondary_text: 'Unduh Kurikulum',
        cta_secondary_url: '#ebrosur',
        kurikulum_file_url: '', // URL File PDF Kurikulum
        slides: [
            { id: '1', image_url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1920', order: 1 },
            { id: '2', image_url: 'https://images.pexels.com/photos/5212653/pexels-photo-5212653.jpeg?auto=compress&cs=tinysrgb&w=1920', order: 2 },
            { id: '3', image_url: 'https://images.pexels.com/photos/8500373/pexels-photo-8500373.jpeg?auto=compress&cs=tinysrgb&w=1920', order: 3 },
        ],
        ebrosur: {
            card_title: 'Download E-Brosur',
            card_description: 'Isi data diri Anda untuk mendapatkan informasi lengkap mengenai biaya dan kurikulum.',
            button_text: 'Kirim & Download PDF',
            file_url: '', // URL File PDF E-Brosur
        }
    },
    features: {
        section_title: 'Keunggulan Akademik & Fasilitas Terbaik',
        section_subtitle: 'Kami tidak hanya mencetak lulusan yang pintar secara teori, tetapi juga terampil, berkarakter, dan siap bersaing di era global.',
        items: [
            {
                icon: 'Layers',
                title: 'Pembelajaran 70% Praktik',
                description: 'Metode pembelajaran hands-on di laboratorium modern memastikan siswa memiliki skill teknis yang kuat sesuai standar industri.'
            },
            {
                icon: 'Award',
                title: 'Guru Praktisi & Ahli',
                description: 'Dididik langsung oleh tenaga pengajar bersertifikat dan praktisi industri yang berpengalaman di bidangnya masing-masing.'
            },
            {
                icon: 'Briefcase',
                title: 'Penyaluran Kerja',
                description: 'Kerjasama dengan 50+ perusahaan multinasional untuk program magang dan rekrutmen langsung setelah lulus.'
            }
        ]
    },
    programs: {
        section_title: 'Siapkan Diri Menjadi Ahli',
        section_subtitle: 'Pilih program keahlian yang sesuai dengan minat dan bakatmu untuk masa depan yang cerah.'
    },
    partners: {
        section_title: 'Dipercaya oleh Perusahaan Terkemuka',
        section_subtitle: 'Lebih dari 50+ perusahaan bermitra dengan kami untuk program magang, rekrutmen, dan pengembangan kurikulum',
        statistics: [
            { value: '50+', label: 'Mitra Industri' },
            { value: '90%', label: 'Siswa Tersampaikan' },
            { value: '1000+', label: 'Alumni Bekerja' }
        ],
        mitra: [
            { id: '1', nama: 'Google Indonesia', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
            { id: '2', nama: 'Microsoft', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
            { id: '3', nama: 'Amazon Web Services', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
            { id: '4', nama: 'Tokopedia', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Tokopedia.svg' },
            { id: '5', nama: 'Gojek', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Gojek_logo_2019.svg' },
        ]
    },
    testimonials: {
        section_title: 'Apa Kata Alumni Kami?',
        section_subtitle: 'Kisah sukses dari lulusan terbaik kami'
    },
    news: {
        section_title: 'Seputar SMK Mustaqbal',
        section_subtitle: 'Berita terkini tentang kegiatan dan prestasi sekolah'
    },
    whatsapp_widget: {
        enabled: true,
        title: 'Konsultasi Gratis',
        description: 'Hubungi kami untuk informasi lebih lanjut',
        default_message: 'Halo, saya ingin konsultasi gratis tentang SMK Mustaqbal',
        phone_number: '6281234567890'
    }
};

export default function BerandaSettingsPage() {
    const [settings, setSettings] = useState<BerandaSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingTab, setSavingTab] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    // Deep merge utility — ensures nested defaults are never lost
    function deepMerge<T extends Record<string, any>>(defaults: T, override: Partial<T>): T {
        const result = { ...defaults };
        for (const key of Object.keys(override) as Array<keyof T>) {
            const val = override[key];
            if (
                val !== null &&
                val !== undefined &&
                typeof val === 'object' &&
                !Array.isArray(val) &&
                typeof result[key] === 'object' &&
                !Array.isArray(result[key])
            ) {
                result[key] = deepMerge(result[key] as any, val as any);
            } else if (val !== undefined) {
                result[key] = val as T[keyof T];
            }
        }
        return result;
    }

    async function loadSettings() {
        try {
            const data = await getBerandaSettings();
            if (data) {
                setSettings(deepMerge(defaultSettings, data));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            toast.error('Gagal memuat pengaturan');
        } finally {
            setLoading(false);
        }
    }

    async function saveSettings() {
        setSaving(true);
        try {
            const result = await updatePageSettings('beranda', settings as unknown as Record<string, unknown>);
            if (!result.success) throw new Error(result.error);
            toast.success('Pengaturan berhasil disimpan');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    }

    async function saveTab(tabName: string) {
        setSavingTab(tabName);
        try {
            const result = await updatePageSettings('beranda', settings as unknown as Record<string, unknown>);
            if (!result.success) throw new Error(result.error);
            toast.success(`Pengaturan ${tabName} berhasil disimpan`);
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setSavingTab(null);
        }
    }

    // Update handlers
    const updateHero = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    // Hero Slider handlers
    const addHeroSlide = () => {
        const newSlide = {
            id: Date.now().toString(),
            image_url: '',
            order: (settings.hero.slides?.length || 0) + 1
        };
        setSettings(prev => ({
            ...prev,
            hero: {
                ...prev.hero,
                slides: [...(prev.hero.slides || []), newSlide]
            }
        }));
    };

    const updateHeroSlide = (slideId: string, field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            hero: {
                ...prev.hero,
                slides: prev.hero.slides?.map(slide =>
                    slide.id === slideId ? { ...slide, [field]: value } : slide
                ) || []
            }
        }));
    };

    const removeHeroSlide = (slideId: string) => {
        setSettings(prev => ({
            ...prev,
            hero: {
                ...prev.hero,
                slides: prev.hero.slides?.filter(slide => slide.id !== slideId) || []
            }
        }));
    };

    const updateEbrosur = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            hero: {
                ...prev.hero,
                ebrosur: { ...(prev.hero.ebrosur || defaultSettings.hero.ebrosur), [field]: value }
            }
        }));
    };

    const updateFeatures = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            features: { ...prev.features, [field]: value }
        }));
    };

    const updateFeatureItem = (index: number, field: string, value: string) => {
        setSettings(prev => {
            const newItems = [...prev.features.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return {
                ...prev,
                features: { ...prev.features, items: newItems }
            };
        });
    };

    const updatePrograms = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            programs: { ...prev.programs, [field]: value }
        }));
    };

    const updatePartners = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            partners: { ...prev.partners, [field]: value }
        }));
    };

    const updatePartnerStat = (index: number, field: string, value: string) => {
        setSettings(prev => {
            const newStats = [...prev.partners.statistics];
            newStats[index] = { ...newStats[index], [field]: value };
            return {
                ...prev,
                partners: { ...prev.partners, statistics: newStats }
            };
        });
    };

    // Helper functions untuk Mitra Industri
    const addMitra = () => {
        setSettings(prev => ({
            ...prev,
            partners: {
                ...prev.partners,
                mitra: [...(prev.partners.mitra || []), { id: Date.now().toString(), nama: '', logo_url: '' }]
            }
        }));
    };

    const updateMitra = (index: number, field: string, value: string) => {
        setSettings(prev => {
            const newMitra = [...(prev.partners.mitra || [])];
            newMitra[index] = { ...newMitra[index], [field]: value };
            return {
                ...prev,
                partners: { ...prev.partners, mitra: newMitra }
            };
        });
    };

    const removeMitra = (index: number) => {
        setSettings(prev => ({
            ...prev,
            partners: {
                ...prev.partners,
                mitra: (prev.partners.mitra || []).filter((_, i) => i !== index)
            }
        }));
    };

    const updateTestimonials = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            testimonials: { ...prev.testimonials, [field]: value }
        }));
    };

    const updateNews = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            news: { ...prev.news, [field]: value }
        }));
    };

    const updateWhatsApp = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            whatsapp_widget: { ...prev.whatsapp_widget, [field]: value }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pengaturan Halaman Beranda</h1>
                    <p className="text-gray-500">Kelola tampilan dan konten halaman utama website</p>
                </div>
                <Button onClick={saveSettings} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Simpan Semua
                </Button>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="grid grid-cols-7 lg:w-full lg:inline-flex h-auto flex-wrap">
                    <TabsTrigger value="hero" className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Hero</span>
                    </TabsTrigger>
                    <TabsTrigger value="features" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        <span className="hidden sm:inline">Keunggulan</span>
                    </TabsTrigger>
                    <TabsTrigger value="programs" className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span className="hidden sm:inline">Program</span>
                    </TabsTrigger>
                    <TabsTrigger value="partners" className="flex items-center gap-2">
                        <Handshake className="w-4 h-4" />
                        <span className="hidden sm:inline">Mitra</span>
                    </TabsTrigger>
                    <TabsTrigger value="testimonials" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Testimoni</span>
                    </TabsTrigger>
                    <TabsTrigger value="news" className="flex items-center gap-2">
                        <Newspaper className="w-4 h-4" />
                        <span className="hidden sm:inline">Berita</span>
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Hero Section */}
                <TabsContent value="hero" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Hero Section</CardTitle>
                            <CardDescription>Kelola konten utama di bagian atas halaman</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Hero Slider Manager */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-lg font-semibold">Hero Slider Manager</Label>
                                    <Button variant="outline" size="sm" onClick={addHeroSlide}>
                                        <Plus className="w-4 h-4 mr-1" /> Tambah Slide
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">Kelola gambar untuk slider hero (minimal 1 gambar)</p>

                                <div className="space-y-4">
                                    {settings.hero.slides?.map((slide, index) => (
                                        <div key={slide.id} className="border rounded-lg p-4 bg-slate-50">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-sm font-medium text-gray-500">Slide {index + 1}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 ml-auto"
                                                    onClick={() => removeHeroSlide(slide.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Image Preview */}
                                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-teal-400 transition-colors bg-white">
                                                    {slide.image_url ? (
                                                        <div className="relative h-32 w-full rounded-lg overflow-hidden">
                                                            <img
                                                                src={slide.image_url}
                                                                alt={`Slide ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                onClick={() => updateHeroSlide(slide.id, 'image_url', '')}
                                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs w-6 h-6 flex items-center justify-center"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <div className="w-10 h-10 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <span className="text-xl">🖼️</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">Upload gambar slide</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* URL Input */}
                                                <div className="flex flex-col justify-center space-y-2">
                                                    <Label className="text-sm">URL Gambar Slide</Label>
                                                    <Input
                                                        placeholder="https://example.com/image.jpg"
                                                        value={slide.image_url}
                                                        onChange={(e) => updateHeroSlide(slide.id, 'image_url', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(!settings.hero.slides || settings.hero.slides.length === 0) && (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                            <p className="text-gray-500">Belum ada slide. Klik "Tambah Slide" untuk memulai.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="welcome_text">Teks Welcome</Label>
                                    <Input
                                        id="welcome_text"
                                        value={settings.hero.welcome_text}
                                        onChange={(e) => updateHero('welcome_text', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cta_primary">Tombol Utama (Teks)</Label>
                                    <Input
                                        id="cta_primary"
                                        value={settings.hero.cta_primary_text}
                                        onChange={(e) => updateHero('cta_primary_text', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* CTA Primary URL */}
                            <div className="space-y-2">
                                <Label htmlFor="cta_primary_url">URL Tombol Utama</Label>
                                <Input
                                    id="cta_primary_url"
                                    placeholder="/ppdb atau https://..."
                                    value={settings.hero.cta_primary_url || ''}
                                    onChange={(e) => updateHero('cta_primary_url', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Utama</Label>
                                <Input
                                    id="title"
                                    value={settings.hero.title}
                                    onChange={(e) => updateHero('title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subjudul</Label>
                                <Textarea
                                    id="subtitle"
                                    value={settings.hero.subtitle}
                                    onChange={(e) => updateHero('subtitle', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cta_secondary">Tombol Sekunder (Teks)</Label>
                                    <Input
                                        id="cta_secondary"
                                        value={settings.hero.cta_secondary_text}
                                        onChange={(e) => updateHero('cta_secondary_text', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cta_secondary_url">URL / Link File Kurikulum (PDF)</Label>
                                    <Input
                                        id="cta_secondary_url"
                                        placeholder="https://.../kurikulum.pdf"
                                        value={settings.hero.cta_secondary_url || ''}
                                        onChange={(e) => updateHero('cta_secondary_url', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500">Link file PDF kurikulum yang akan diunduh</p>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Pengaturan E-Brosur</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="ebrosur_title">Judul Card</Label>
                                        <Input
                                            id="ebrosur_title"
                                            value={settings.hero.ebrosur?.card_title || ''}
                                            onChange={(e) => updateEbrosur('card_title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ebrosur_button">Teks Tombol</Label>
                                        <Input
                                            id="ebrosur_button"
                                            value={settings.hero.ebrosur?.button_text || ''}
                                            onChange={(e) => updateEbrosur('button_text', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="ebrosur_desc">Deskripsi Card</Label>
                                    <Textarea
                                        id="ebrosur_desc"
                                        value={settings.hero.ebrosur?.card_description || ''}
                                        onChange={(e) => updateEbrosur('card_description', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="ebrosur_file">URL File E-Brosur (PDF)</Label>
                                    <Input
                                        id="ebrosur_file"
                                        placeholder="https://.../ebrosur-smk-mustaqbal.pdf"
                                        value={settings.hero.ebrosur?.file_url || ''}
                                        onChange={(e) => updateEbrosur('file_url', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500">File PDF yang akan otomatis ter-download setelah user mengisi form</p>
                                </div>
                            </div>

                            <Button onClick={() => saveTab('Hero')} disabled={savingTab === 'Hero'} className="bg-teal-600 hover:bg-teal-700">
                                {savingTab === 'Hero' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Hero
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Features Section */}
                <TabsContent value="features" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Keunggulan & Fasilitas</CardTitle>
                            <CardDescription>Kelola section keunggulan akademik dan fasilitas sekolah</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="features_title">Judul Section</Label>
                                <Input
                                    id="features_title"
                                    value={settings.features.section_title}
                                    onChange={(e) => updateFeatures('section_title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="features_subtitle">Subjudul Section</Label>
                                <Textarea
                                    id="features_subtitle"
                                    value={settings.features.section_subtitle}
                                    onChange={(e) => updateFeatures('section_subtitle', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Kotak Keunggulan</h3>
                                {settings.features.items.map((item, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Keunggulan #{index + 1}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nama Icon (Lucide)</Label>
                                                <Input
                                                    value={item.icon}
                                                    onChange={(e) => updateFeatureItem(index, 'icon', e.target.value)}
                                                    placeholder="Layers, Award, Briefcase"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Judul</Label>
                                                <Input
                                                    value={item.title}
                                                    onChange={(e) => updateFeatureItem(index, 'title', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Deskripsi</Label>
                                                <Textarea
                                                    value={item.description}
                                                    onChange={(e) => updateFeatureItem(index, 'description', e.target.value)}
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={() => saveTab('Keunggulan')} disabled={savingTab === 'Keunggulan'} className="bg-teal-600 hover:bg-teal-700">
                                {savingTab === 'Keunggulan' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Keunggulan
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Programs Section */}
                <TabsContent value="programs" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Program Keahlian</CardTitle>
                            <CardDescription>Kelola judul dan deskripsi section program keahlian</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="programs_title">Judul Section</Label>
                                <Input
                                    id="programs_title"
                                    value={settings.programs.section_title}
                                    onChange={(e) => updatePrograms('section_title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="programs_subtitle">Subjudul Section</Label>
                                <Textarea
                                    id="programs_subtitle"
                                    value={settings.programs.section_subtitle}
                                    onChange={(e) => updatePrograms('section_subtitle', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <p className="text-sm text-gray-500">
                                * Data program keahlian diambil dari menu Program. Di section ini hanya mengatur judul dan subjudul.
                            </p>

                            <Button onClick={() => saveTab('Program')} disabled={savingTab === 'Program'} className="bg-teal-600 hover:bg-teal-700">
                                {savingTab === 'Program' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Program
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 4: Partners Section */}
                <TabsContent value="partners" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Kerjasama Industri</CardTitle>
                            <CardDescription>Kelola judul dan statistik mitra perusahaan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="partners_title">Judul Section</Label>
                                <Input
                                    id="partners_title"
                                    value={settings.partners.section_title}
                                    onChange={(e) => updatePartners('section_title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="partners_subtitle">Subjudul Section</Label>
                                <Textarea
                                    id="partners_subtitle"
                                    value={settings.partners.section_subtitle}
                                    onChange={(e) => updatePartners('section_subtitle', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Statistik</h3>
                                {settings.partners.statistics.map((stat, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Angka</Label>
                                                <Input
                                                    value={stat.value}
                                                    onChange={(e) => updatePartnerStat(index, 'value', e.target.value)}
                                                    placeholder="50+, 90%, 1000+"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Label</Label>
                                                <Input
                                                    value={stat.label}
                                                    onChange={(e) => updatePartnerStat(index, 'label', e.target.value)}
                                                    placeholder="Mitra Industri"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Section: Mitra Industri (Logo Slider) */}
                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold">Logo Mitra Industri</h3>
                                        <p className="text-sm text-gray-500">Daftar logo perusahaan mitra untuk tampilan slider infinite scroll</p>
                                    </div>
                                </div>

                                {(settings.partners.mitra || []).map((mitra, index) => (
                                    <div key={mitra.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nama Perusahaan</Label>
                                                <Input
                                                    value={mitra.nama}
                                                    onChange={(e) => updateMitra(index, 'nama', e.target.value)}
                                                    placeholder="Contoh: Google Indonesia"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Logo URL</Label>
                                                <Input
                                                    value={mitra.logo_url}
                                                    onChange={(e) => updateMitra(index, 'logo_url', e.target.value)}
                                                    placeholder="https://example.com/logo.png"
                                                />
                                            </div>
                                        </div>
                                        {mitra.logo_url && (
                                            <div className="mt-3 flex items-center gap-4">
                                                <div className="w-32 h-16 bg-white border rounded flex items-center justify-center p-2">
                                                    <img
                                                        src={mitra.logo_url}
                                                        alt={mitra.nama}
                                                        className="max-w-full max-h-full object-contain"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x60?text=Error';
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeMitra(index)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {(settings.partners.mitra || []).length === 0 && (
                                    <div className="text-center py-6 border-2 border-dashed rounded-lg">
                                        <p className="text-gray-500">Belum ada mitra ditambahkan</p>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={addMitra}
                                    className="w-full mt-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Mitra
                                </Button>
                            </div>

                            <Button onClick={() => saveTab('Mitra')} disabled={savingTab === 'Mitra'} className="bg-teal-600 hover:bg-teal-700">
                                {savingTab === 'Mitra' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Mitra
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 5: Testimonials Section */}
                <TabsContent value="testimonials" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Testimoni Alumni</CardTitle>
                            <CardDescription>Kelola judul section dan data testimoni alumni</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="testimonials_title">Judul Section</Label>
                                <Input
                                    id="testimonials_title"
                                    value={settings.testimonials.section_title}
                                    onChange={(e) => updateTestimonials('section_title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="testimonials_subtitle">Subjudul Section</Label>
                                <Textarea
                                    id="testimonials_subtitle"
                                    value={settings.testimonials.section_subtitle}
                                    onChange={(e) => updateTestimonials('section_subtitle', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Data Testimoni Alumni</h3>
                                    <Button variant="outline" size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Testimoni
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    * Untuk mengelola data testimoni (CRUD), silakan buka menu Testimoni di sidebar.
                                </p>
                            </div>

                            <Button onClick={() => saveTab('Testimoni')} disabled={savingTab === 'Testimoni'} className="bg-teal-600 hover:bg-teal-700">
                                {savingTab === 'Testimoni' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Testimoni
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 6: News Section */}
                <TabsContent value="news" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Berita Terkini</CardTitle>
                            <CardDescription>Kelola judul section berita</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="news_title">Judul Section</Label>
                                <Input
                                    id="news_title"
                                    value={settings.news.section_title}
                                    onChange={(e) => updateNews('section_title', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="news_subtitle">Subjudul Section</Label>
                                <Textarea
                                    id="news_subtitle"
                                    value={settings.news.section_subtitle}
                                    onChange={(e) => updateNews('section_subtitle', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <p className="text-sm text-gray-500">
                                * Data berita diambil dari menu Berita. Di section ini hanya mengatur judul dan subjudul.
                            </p>

                            <Button onClick={() => saveTab('Berita')} disabled={savingTab === 'Berita'} className="bg-teal-600 hover:bg-teal-700">
                                {savingTab === 'Berita' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan Berita
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 7: WhatsApp Widget */}
                <TabsContent value="whatsapp" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Widget WhatsApp</CardTitle>
                            <CardDescription>Kelola tampilan floating WhatsApp button</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="wa_enabled"
                                    checked={settings.whatsapp_widget.enabled}
                                    onCheckedChange={(checked) => updateWhatsApp('enabled', checked)}
                                />
                                <Label htmlFor="wa_enabled">Aktifkan Widget WhatsApp</Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wa_title">Judul Pop-up</Label>
                                <Input
                                    id="wa_title"
                                    value={settings.whatsapp_widget.title}
                                    onChange={(e) => updateWhatsApp('title', e.target.value)}
                                    disabled={!settings.whatsapp_widget.enabled}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wa_description">Deskripsi</Label>
                                <Textarea
                                    id="wa_description"
                                    value={settings.whatsapp_widget.description}
                                    onChange={(e) => updateWhatsApp('description', e.target.value)}
                                    rows={2}
                                    disabled={!settings.whatsapp_widget.enabled}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wa_message">Pesan Default</Label>
                                <Textarea
                                    id="wa_message"
                                    value={settings.whatsapp_widget.default_message}
                                    onChange={(e) => updateWhatsApp('default_message', e.target.value)}
                                    rows={2}
                                    disabled={!settings.whatsapp_widget.enabled}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wa_phone">Nomor WhatsApp</Label>
                                <Input
                                    id="wa_phone"
                                    value={settings.whatsapp_widget.phone_number}
                                    onChange={(e) => updateWhatsApp('phone_number', e.target.value)}
                                    placeholder="6281234567890"
                                    disabled={!settings.whatsapp_widget.enabled}
                                />
                                <p className="text-xs text-gray-500">Format: 628xxxx (dengan kode negara, tanpa +)</p>
                            </div>

                            <Button onClick={() => saveTab('WhatsApp')} disabled={savingTab === 'WhatsApp'} className="bg-teal-600 hover:bg-teal-700">
                                {savingTab === 'WhatsApp' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Simpan WhatsApp
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
