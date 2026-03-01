'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, Upload, X, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

// DUMMY DATA - Struktur data Footer
const defaultFooterSettings = {
    // Section 1: Branding
    logo_url: '',
    school_name: 'SMK Mustaqbal',
    description: 'Membentuk generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan melalui pendidikan vokasi berkualitas tinggi.',

    // Section 2: Social Media
    social_links: [
        { id: '1', platform: 'Facebook', icon: 'Facebook', url: 'https://facebook.com/smkmustaqbal', color: 'bg-blue-600', is_active: true },
        { id: '2', platform: 'Instagram', icon: 'Instagram', url: 'https://instagram.com/smkmustaqbal', color: 'bg-pink-600', is_active: true },
        { id: '3', platform: 'Twitter', icon: 'Twitter', url: 'https://twitter.com/smkmustaqbal', color: 'bg-sky-500', is_active: true },
        { id: '4', platform: 'Youtube', icon: 'Youtube', url: 'https://youtube.com/smkmustaqbal', color: 'bg-red-600', is_active: true },
    ],

    // Section 3: Footer Columns (Link Groups)
    columns: [
        {
            id: '1',
            title: 'Tautan Cepat',
            links: [
                { id: '1', label: 'Program Keahlian', url: '/program' },
                { id: '2', label: 'Galeri Kegiatan', url: '/galeri/foto' },
                { id: '3', label: 'Berita & Artikel', url: '/berita' },
                { id: '4', label: 'Hubungi Kami', url: '/kontak' },
            ]
        },
        {
            id: '2',
            title: 'Layanan',
            links: [
                { id: '1', label: 'Pendaftaran Online (PPDB)', url: '/ppdb' },
                { id: '2', label: 'Portal Alumni', url: '/alumni' },
                { id: '3', label: 'E-Learning System', url: '/e-learning' },
                { id: '4', label: 'Bursa Kerja Khusus (BKK)', url: '/bkk' },
            ]
        },
    ],

    // Section 4: Contact Info
    contact: {
        address: 'Jl. Raya Mustaqbal No. 1, Jatiasih, Kota Bekasi, Jawa Barat 17425',
        phone: '(021) 8243 5555',
        email: 'info@smkmustaqbal.sch.id',
    },

    // Section 5: Copyright
    copyright_text: 'SMK Mustaqbal. Hak Cipta Dilindungi.',
};

// Icon options from Lucide
const iconOptions = [
    { name: 'Facebook', component: Facebook },
    { name: 'Instagram', component: Instagram },
    { name: 'Twitter', component: Twitter },
    { name: 'Youtube', component: Youtube },
    { name: 'Globe', component: Globe },
    { name: 'MapPin', component: MapPin },
    { name: 'Phone', component: Phone },
    { name: 'Mail', component: Mail },
];

export default function FooterSettingsPage() {
    const [settings, setSettings] = useState(defaultFooterSettings);
    const [saving, setSaving] = useState(false);

    // Handler untuk update branding
    const updateBranding = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    // Handler untuk social links
    const addSocialLink = () => {
        const newLink = {
            id: Date.now().toString(),
            platform: 'New Platform',
            icon: 'Globe',
            url: '',
            color: 'bg-slate-600',
            is_active: true,
        };
        setSettings(prev => ({
            ...prev,
            social_links: [...prev.social_links, newLink],
        }));
    };

    const updateSocialLink = (id: string, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            social_links: prev.social_links.map(link =>
                link.id === id ? { ...link, [field]: value } : link
            ),
        }));
    };

    const removeSocialLink = (id: string) => {
        setSettings(prev => ({
            ...prev,
            social_links: prev.social_links.filter(link => link.id !== id),
        }));
    };

    // Handler untuk footer columns
    const addColumn = () => {
        const newColumn = {
            id: Date.now().toString(),
            title: 'Kolom Baru',
            links: [],
        };
        setSettings(prev => ({
            ...prev,
            columns: [...prev.columns, newColumn],
        }));
    };

    const updateColumn = (columnId: string, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            columns: prev.columns.map(col =>
                col.id === columnId ? { ...col, [field]: value } : col
            ),
        }));
    };

    const removeColumn = (columnId: string) => {
        setSettings(prev => ({
            ...prev,
            columns: prev.columns.filter(col => col.id !== columnId),
        }));
    };

    // Handler untuk links dalam column
    const addLink = (columnId: string) => {
        const newLink = { id: Date.now().toString(), label: 'Link Baru', url: '/' };
        setSettings(prev => ({
            ...prev,
            columns: prev.columns.map(col =>
                col.id === columnId
                    ? { ...col, links: [...col.links, newLink] }
                    : col
            ),
        }));
    };

    const updateLink = (columnId: string, linkId: string, field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            columns: prev.columns.map(col =>
                col.id === columnId
                    ? {
                        ...col,
                        links: col.links.map(link =>
                            link.id === linkId ? { ...link, [field]: value } : link
                        ),
                    }
                    : col
            ),
        }));
    };

    const removeLink = (columnId: string, linkId: string) => {
        setSettings(prev => ({
            ...prev,
            columns: prev.columns.map(col =>
                col.id === columnId
                    ? { ...col, links: col.links.filter(link => link.id !== linkId) }
                    : col
            ),
        }));
    };

    // Handler untuk contact info
    const updateContact = (field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        // Simulasi save delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('[DUMMY] Saving footer settings:', settings);
        toast.success('Pengaturan footer berhasil disimpan (dummy mode)');
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Pengaturan Footer</h1>
                <p className="text-gray-500 mt-1">Kelola konten dan tampilan footer website (FASE 1 - Dummy Data)</p>
            </div>

            {/* Branding Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Branding & Logo</CardTitle>
                    <CardDescription>Atur logo sekolah dan deskripsi footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label>Logo Footer</Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-teal-400 transition-colors cursor-pointer">
                            {settings.logo_url ? (
                                <div className="relative w-24 h-24 mx-auto">
                                    <Image src={settings.logo_url} alt="Logo" fill className="object-contain" />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">Upload logo footer</p>
                                </div>
                            )}
                        </div>
                        <Input
                            placeholder="atau masukkan URL logo"
                            value={settings.logo_url}
                            onChange={e => updateBranding('logo_url', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Nama Sekolah</Label>
                        <Input
                            value={settings.school_name}
                            onChange={e => updateBranding('school_name', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Deskripsi</Label>
                        <Textarea
                            rows={3}
                            value={settings.description}
                            onChange={e => updateBranding('description', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Social Media Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Social Media</CardTitle>
                            <CardDescription>Atur link sosial media yang ditampilkan</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addSocialLink}>
                            <Plus className="w-4 h-4 mr-1" /> Tambah
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {settings.social_links.map((link, index) => (
                            <div key={link.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2 flex-1">
                                    {/* Icon Selector */}
                                    <select
                                        className="w-32 h-10 rounded-md border border-input bg-background px-2 text-sm"
                                        value={link.icon}
                                        onChange={e => updateSocialLink(link.id, 'icon', e.target.value)}
                                    >
                                        {iconOptions.map(icon => (
                                            <option key={icon.name} value={icon.name}>{icon.name}</option>
                                        ))}
                                    </select>

                                    <Input
                                        placeholder="Nama Platform"
                                        value={link.platform}
                                        onChange={e => updateSocialLink(link.id, 'platform', e.target.value)}
                                        className="w-40"
                                    />

                                    <Input
                                        placeholder="https://..."
                                        value={link.url}
                                        onChange={e => updateSocialLink(link.id, 'url', e.target.value)}
                                        className="flex-1"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={link.is_active}
                                        onCheckedChange={checked => updateSocialLink(link.id, 'is_active', checked)}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => removeSocialLink(link.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Footer Columns Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Kolom Footer</CardTitle>
                            <CardDescription>Atur kolom link di footer (Tautan Cepat, Layanan, dll)</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addColumn}>
                            <Plus className="w-4 h-4 mr-1" /> Tambah Kolom
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {settings.columns.map((column) => (
                            <div key={column.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <Input
                                        value={column.title}
                                        onChange={e => updateColumn(column.id, 'title', e.target.value)}
                                        className="font-semibold max-w-xs"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => addLink(column.id)}>
                                            <Plus className="w-4 h-4 mr-1" /> Link
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500"
                                            onClick={() => removeColumn(column.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {column.links.map((link) => (
                                        <div key={link.id} className="flex items-center gap-3">
                                            <Input
                                                placeholder="Label"
                                                value={link.label}
                                                onChange={e => updateLink(column.id, link.id, 'label', e.target.value)}
                                                className="flex-1"
                                            />
                                            <Input
                                                placeholder="/path"
                                                value={link.url}
                                                onChange={e => updateLink(column.id, link.id, 'url', e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500"
                                                onClick={() => removeLink(column.id, link.id)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {column.links.length === 0 && (
                                        <p className="text-sm text-gray-400 text-center py-4">Belum ada link. Klik "Link" untuk menambah.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Contact Info Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Kontak</CardTitle>
                    <CardDescription>Atur alamat, telepon, dan email yang ditampilkan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Alamat Lengkap</Label>
                        <Textarea
                            rows={3}
                            value={settings.contact.address}
                            onChange={e => updateContact('address', e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nomor Telepon</Label>
                            <Input
                                value={settings.contact.phone}
                                onChange={e => updateContact('phone', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={settings.contact.email}
                                onChange={e => updateContact('email', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Copyright Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Copyright</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        value={settings.copyright_text}
                        onChange={e => updateBranding('copyright_text', e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-2">Tahun akan otomatis ditambahkan di depan teks ini.</p>
                </CardContent>
            </Card>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-teal-600 hover:bg-teal-700"
            >
                {saving ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span> Menyimpan...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Simpan Pengaturan Footer
                    </span>
                )}
            </Button>
        </div>
    );
}
