'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

// DUMMY DATA - Struktur Navigation Menu
const defaultNavigation = [
    {
        id: '1',
        label: 'Beranda',
        url: '/',
        icon: 'Home',
        has_dropdown: false,
        submenu: [],
        is_active: true,
    },
    {
        id: '2',
        label: 'Tentang Kami',
        url: '#',
        icon: 'Info',
        has_dropdown: true,
        submenu: [
            { id: '2-1', label: 'Visi dan Misi', url: '/tentang/visi-misi' },
            { id: '2-2', label: 'Sambutan Kepala Sekolah', url: '/tentang/sambutan-kepala-sekolah' },
            { id: '2-3', label: 'Profile Guru', url: '/tentang/profile-guru' },
        ],
        is_active: true,
    },
    {
        id: '3',
        label: 'Program Keahlian',
        url: '/program',
        icon: 'GraduationCap',
        has_dropdown: true,
        submenu: [
            { id: '3-1', label: 'Teknik Otomasi & Robotik', url: '/program/teknik-otomasi-robotik' },
            { id: '3-2', label: 'Product Design & 3D', url: '/program/product-design-3d' },
            { id: '3-3', label: 'IT Support & Network', url: '/program/it-support-network' },
            { id: '3-4', label: 'Web Dev & Digital Marketing', url: '/program/web-dev-digital-marketing' },
        ],
        is_active: true,
    },
    {
        id: '4',
        label: 'Galeri',
        url: '#',
        icon: 'Images',
        has_dropdown: true,
        submenu: [
            { id: '4-1', label: 'Galeri Foto', url: '/galeri/foto' },
            { id: '4-2', label: 'Galeri Video', url: '/galeri/video' },
        ],
        is_active: true,
    },
    {
        id: '5',
        label: 'Portfolio',
        url: '/portfolio',
        icon: 'Award',
        has_dropdown: false,
        submenu: [],
        is_active: true,
    },
    {
        id: '6',
        label: 'Berita',
        url: '/berita',
        icon: 'Newspaper',
        has_dropdown: false,
        submenu: [],
        is_active: true,
    },
    {
        id: '7',
        label: 'Hubungi Kami',
        url: '/kontak',
        icon: 'Phone',
        has_dropdown: false,
        submenu: [],
        is_active: true,
    },
];

// Icon options from Lucide
const iconOptions = [
    'Home', 'Info', 'GraduationCap', 'Images', 'Newspaper',
    'Phone', 'Award', 'BookOpen', 'Calendar', 'Users',
    'Building', 'Mail', 'HelpCircle', 'FileText', 'Star'
];

export default function MenuSettingsPage() {
    const [menuItems, setMenuItems] = useState(defaultNavigation);
    const [expandedItems, setExpandedItems] = useState<string[]>(['2', '3', '4']);
    const [saving, setSaving] = useState(false);

    // Toggle expand/collapse submenu
    const toggleExpand = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Add new main menu item
    const addMenuItem = () => {
        const newItem = {
            id: Date.now().toString(),
            label: 'Menu Baru',
            url: '/',
            icon: 'Home',
            has_dropdown: false,
            submenu: [],
            is_active: true,
        };
        setMenuItems(prev => [...prev, newItem]);
        toast.success('Menu item ditambahkan (dummy mode)');
    };

    // Update menu item
    const updateMenuItem = (id: string, field: string, value: any) => {
        setMenuItems(prev =>
            prev.map(item => item.id === id ? { ...item, [field]: value } : item)
        );
    };

    // Remove menu item
    const removeMenuItem = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
            setMenuItems(prev => prev.filter(item => item.id !== id));
            toast.success('Menu item dihapus (dummy mode)');
        }
    };

    // Add submenu item
    const addSubmenuItem = (parentId: string) => {
        const newSubmenu = { id: `${parentId}-${Date.now()}`, label: 'Submenu Baru', url: '/' };
        setMenuItems(prev =>
            prev.map(item =>
                item.id === parentId
                    ? { ...item, submenu: [...item.submenu, newSubmenu] }
                    : item
            )
        );
    };

    // Update submenu item
    const updateSubmenuItem = (parentId: string, submenuId: string, field: string, value: string) => {
        setMenuItems(prev =>
            prev.map(item =>
                item.id === parentId
                    ? {
                        ...item,
                        submenu: item.submenu.map(sub =>
                            sub.id === submenuId ? { ...sub, [field]: value } : sub
                        )
                    }
                    : item
            )
        );
    };

    // Remove submenu item
    const removeSubmenuItem = (parentId: string, submenuId: string) => {
        setMenuItems(prev =>
            prev.map(item =>
                item.id === parentId
                    ? { ...item, submenu: item.submenu.filter(sub => sub.id !== submenuId) }
                    : item
            )
        );
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('[DUMMY] Saving navigation:', menuItems);
        toast.success('Struktur menu berhasil disimpan (dummy mode)');
        setSaving(false);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Manajemen Menu</h1>
                <p className="text-gray-500 mt-1">Atur struktur navigasi website (FASE 1 - Dummy Data)</p>
            </div>

            {/* Menu List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Struktur Menu</CardTitle>
                            <CardDescription>Klik panah untuk expand/collapse submenu</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addMenuItem}>
                            <Plus className="w-4 h-4 mr-1" /> Tambah Menu
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {menuItems.map((item, index) => (
                            <div key={item.id} className="border rounded-lg overflow-hidden">
                                {/* Main Menu Item */}
                                <div className="flex items-center gap-3 p-4 bg-slate-50">
                                    {/* Expand/Collapse Button */}
                                    <button
                                        onClick={() => toggleExpand(item.id)}
                                        className="p-1 hover:bg-slate-200 rounded"
                                        disabled={!item.has_dropdown}
                                    >
                                        {item.has_dropdown ? (
                                            expandedItems.includes(item.id) ? (
                                                <ChevronDown className="w-4 h-4 text-slate-500" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-slate-500" />
                                            )
                                        ) : (
                                            <div className="w-4" />
                                        )}
                                    </button>

                                    {/* Icon Selector */}
                                    <select
                                        className="w-24 h-9 rounded-md border border-input bg-background px-2 text-sm"
                                        value={item.icon}
                                        onChange={e => updateMenuItem(item.id, 'icon', e.target.value)}
                                    >
                                        {iconOptions.map(icon => (
                                            <option key={icon} value={icon}>{icon}</option>
                                        ))}
                                    </select>

                                    {/* Label Input */}
                                    <Input
                                        placeholder="Label Menu"
                                        value={item.label}
                                        onChange={e => updateMenuItem(item.id, 'label', e.target.value)}
                                        className="flex-1"
                                    />

                                    {/* URL Input */}
                                    <Input
                                        placeholder="/path"
                                        value={item.url}
                                        onChange={e => updateMenuItem(item.id, 'url', e.target.value)}
                                        className="w-48"
                                    />

                                    {/* Has Dropdown Toggle */}
                                    <div className="flex items-center gap-2 px-3">
                                        <Switch
                                            checked={item.has_dropdown}
                                            onCheckedChange={checked => {
                                                updateMenuItem(item.id, 'has_dropdown', checked);
                                                if (checked) toggleExpand(item.id);
                                            }}
                                        />
                                        <span className="text-xs text-gray-500 whitespace-nowrap">Dropdown</span>
                                    </div>

                                    {/* Active Toggle */}
                                    <div className="flex items-center gap-2 px-3">
                                        <Switch
                                            checked={item.is_active}
                                            onCheckedChange={checked => updateMenuItem(item.id, 'is_active', checked)}
                                        />
                                        <span className="text-xs text-gray-500 whitespace-nowrap">Aktif</span>
                                    </div>

                                    {/* Delete Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500"
                                        onClick={() => removeMenuItem(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Submenu Items */}
                                {item.has_dropdown && expandedItems.includes(item.id) && (
                                    <div className="border-t bg-white p-4 pl-12">
                                        <div className="space-y-3">
                                            {item.submenu.map((sub, subIndex) => (
                                                <div key={sub.id} className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                                                    <Input
                                                        placeholder="Label Submenu"
                                                        value={sub.label}
                                                        onChange={e => updateSubmenuItem(item.id, sub.id, 'label', e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        placeholder="/path"
                                                        value={sub.url}
                                                        onChange={e => updateSubmenuItem(item.id, sub.id, 'url', e.target.value)}
                                                        className="w-64"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500"
                                                        onClick={() => removeSubmenuItem(item.id, sub.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addSubmenuItem(item.id)}
                                                className="mt-2"
                                            >
                                                <Plus className="w-3 h-3 mr-1" /> Tambah Submenu
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {menuItems.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <p>Belum ada menu. Klik "Tambah Menu" untuk memulai.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Preview Menu Aktif</CardTitle>
                    <CardDescription>Menu yang akan ditampilkan di website</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-900 text-white p-4 rounded-lg">
                        <div className="flex flex-wrap gap-4">
                            {menuItems.filter(item => item.is_active).map(item => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <span>{item.label}</span>
                                    {item.has_dropdown && item.submenu.length > 0 && (
                                        <span className="text-xs text-slate-400">
                                            ({item.submenu.length} submenu)
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
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
                        <Save className="w-4 h-4" /> Simpan Struktur Menu
                    </span>
                )}
            </Button>
        </div>
    );
}
