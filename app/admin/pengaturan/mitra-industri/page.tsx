'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Mitra {
    id: string;
    nama: string;
    logo_url: string;
}

export default function MitraIndustriPage() {
    const [mitraList, setMitraList] = useState<Mitra[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load mitra from page settings
        async function loadMitra() {
            try {
                const response = await fetch('/api/page-settings/beranda');
                if (response.ok) {
                    const data = await response.json();
                    if (data?.partners?.mitra) {
                        setMitraList(data.partners.mitra);
                    }
                }
            } catch (error) {
                console.error('Error loading mitra:', error);
            } finally {
                setLoading(false);
            }
        }
        loadMitra();
    }, []);

    const handleAddMitra = () => {
        const newMitra: Mitra = {
            id: Date.now().toString(),
            nama: '',
            logo_url: '',
        };
        setMitraList([...mitraList, newMitra]);
    };

    const handleRemoveMitra = (id: string) => {
        setMitraList(mitraList.filter(m => m.id !== id));
    };

    const handleUpdateMitra = (id: string, field: keyof Mitra, value: string) => {
        setMitraList(mitraList.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/page-settings/beranda', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    partners: { mitra: mitraList }
                }),
            });

            if (response.ok) {
                toast.success('Mitra industri berhasil disimpan');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving mitra:', error);
            toast.error('Gagal menyimpan mitra industri');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Pengaturan — Mitra Industri</h1>
                <p className="text-gray-500">Kelola daftar mitra industri yang ditampilkan di beranda</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Mitra Industri</CardTitle>
                    <CardDescription>
                        Tambahkan logo dan nama mitra industri yang bekerja sama dengan sekolah
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mitraList.map((mitra, index) => (
                        <div key={mitra.id} className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="flex-1 space-y-3">
                                <div>
                                    <Label className="text-xs">Nama Mitra</Label>
                                    <Input
                                        value={mitra.nama}
                                        onChange={(e) => handleUpdateMitra(mitra.id, 'nama', e.target.value)}
                                        placeholder="Nama perusahaan mitra"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">URL Logo</Label>
                                    <Input
                                        value={mitra.logo_url}
                                        onChange={(e) => handleUpdateMitra(mitra.id, 'logo_url', e.target.value)}
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                                {mitra.logo_url && (
                                    <div className="relative w-32 h-16 bg-gray-100 rounded overflow-hidden">
                                        <Image
                                            src={mitra.logo_url}
                                            alt={mitra.nama}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveMitra(mitra.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        onClick={handleAddMitra}
                        className="w-full border-dashed"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Mitra
                    </Button>
                </CardContent>
            </Card>

            <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700"
            >
                {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Save className="w-4 h-4 mr-2" />
                )}
                Simpan
            </Button>
        </div>
    );
}
