'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Images, Video, Upload } from 'lucide-react';
import { toast } from 'sonner';

const dummyPhotos = [
    { id: '1', title: 'Upacara Bendera', url: '', type: 'photo', created_at: '2026-02-20' },
    { id: '2', title: 'Lab Komputer RPL', url: '', type: 'photo', created_at: '2026-02-18' },
    { id: '3', title: 'Workshop Multimedia', url: '', type: 'photo', created_at: '2026-02-15' },
    { id: '4', title: 'Kunjungan Industri', url: '', type: 'photo', created_at: '2026-02-10' },
    { id: '5', title: 'Wisuda Angkatan 2025', url: '', type: 'photo', created_at: '2026-01-30' },
    { id: '6', title: 'Pentas Seni', url: '', type: 'photo', created_at: '2026-01-25' },
];

const dummyVideos = [
    { id: 'v1', title: 'Video Profil SMK Mustaqbal', url: '', type: 'video', created_at: '2026-02-01' },
    { id: 'v2', title: 'Dokumentasi LKS 2025', url: '', type: 'video', created_at: '2026-01-20' },
    { id: 'v3', title: 'Aftermovie Wisuda', url: '', type: 'video', created_at: '2026-01-15' },
];

export default function MasterMediaPage() {
    const [photos, setPhotos] = useState(dummyPhotos);
    const [videos, setVideos] = useState(dummyVideos);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any; type: string }>({ open: false, item: null, type: '' });

    const handleUpload = (type: string) => {
        console.log(`[DUMMY] Upload ${type}`);
        toast.success(`Upload ${type} berhasil (dummy)`);
        if (type === 'photo') {
            setPhotos(prev => [...prev, { id: Date.now().toString(), title: 'Foto Baru', url: '', type: 'photo', created_at: new Date().toISOString().split('T')[0] }]);
        } else {
            setVideos(prev => [...prev, { id: Date.now().toString(), title: 'Video Baru', url: '', type: 'video', created_at: new Date().toISOString().split('T')[0] }]);
        }
    };

    const handleDelete = () => {
        if (deleteDialog.type === 'photo') {
            setPhotos(prev => prev.filter(p => p.id !== deleteDialog.item?.id));
        } else {
            setVideos(prev => prev.filter(v => v.id !== deleteDialog.item?.id));
        }
        toast.success('Media dihapus (dummy)');
        setDeleteDialog({ open: false, item: null, type: '' });
    };

    return (
        <div className="space-y-6">
            <div><h2 className="text-3xl font-bold">Media & Galeri</h2><p className="text-gray-500 mt-1">Kelola foto dan video galeri sekolah</p></div>

            <Tabs defaultValue="photos">
                <TabsList><TabsTrigger value="photos" className="gap-2"><Images className="w-4 h-4" /> Foto ({photos.length})</TabsTrigger><TabsTrigger value="videos" className="gap-2"><Video className="w-4 h-4" /> Video ({videos.length})</TabsTrigger></TabsList>

                <TabsContent value="photos" className="mt-6">
                    <div className="flex justify-end mb-4">
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => handleUpload('photo')}><Plus className="w-4 h-4 mr-2" /> Upload Foto</Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* Upload Zone */}
                        <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 hover:border-teal-400 transition-colors cursor-pointer min-h-[200px]" onClick={() => handleUpload('photo')}>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" /><p className="text-sm text-gray-500 text-center">Upload Foto</p>
                        </div>
                        {photos.map(photo => (
                            <div key={photo.id} className="group relative border rounded-lg overflow-hidden">
                                <div className="h-[200px] bg-gray-100 flex items-center justify-center"><Images className="w-10 h-10 text-gray-300" /></div>
                                <div className="p-3">
                                    <p className="text-sm font-medium truncate">{photo.title}</p>
                                    <p className="text-xs text-gray-400">{new Date(photo.created_at).toLocaleDateString('id-ID')}</p>
                                </div>
                                <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setDeleteDialog({ open: true, item: photo, type: 'photo' })}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="videos" className="mt-6">
                    <div className="flex justify-end mb-4">
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => handleUpload('video')}><Plus className="w-4 h-4 mr-2" /> Upload Video</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {videos.map(video => (
                            <Card key={video.id} className="group relative">
                                <CardContent className="pt-6">
                                    <div className="h-[180px] bg-gray-100 rounded-lg flex items-center justify-center mb-3"><Video className="w-10 h-10 text-gray-300" /></div>
                                    <p className="font-medium">{video.title}</p>
                                    <p className="text-xs text-gray-400">{new Date(video.created_at).toLocaleDateString('id-ID')}</p>
                                </CardContent>
                                <Button size="sm" variant="ghost" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setDeleteDialog({ open: true, item: video, type: 'video' })}><Trash2 className="w-4 h-4" /></Button>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, item: null, type: '' })}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Hapus Media</DialogTitle><DialogDescription>Yakin hapus &quot;{deleteDialog.item?.title}&quot;?</DialogDescription></DialogHeader>
                    <DialogFooter><Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null, type: '' })}>Batal</Button><Button variant="destructive" onClick={handleDelete}>Hapus</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
