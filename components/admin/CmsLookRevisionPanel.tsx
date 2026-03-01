'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    History,
    Eye,
    RotateCcw,
    Clock,
    User,
    CheckCircle,
    Archive
} from 'lucide-react';
import { toast } from 'sonner';

type CmsLookRevision = {
    id: string;
    look_id: string;
    version: number;
    content: Record<string, unknown>;
    created_at: string;
    created_by: string;
    notes: string | null;
    status: 'draft' | 'published' | 'archived';
};

type CmsLookRevisionPanelProps = {
    lookId: string;
    onRestore?: (revision: CmsLookRevision) => void;
};

export default function CmsLookRevisionPanel({ lookId, onRestore }: CmsLookRevisionPanelProps) {
    const [revisions, setRevisions] = useState<CmsLookRevision[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRevision, setSelectedRevision] = useState<CmsLookRevision | null>(null);
    const supabase = createClient();

    const fetchRevisions = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('cms_look_revisions')
                .select('*')
                .eq('look_id', lookId)
                .order('version', { ascending: false });

            if (error) throw error;
            setRevisions(data || []);
        } catch (error) {
            console.error('Error fetching revisions:', error);
            toast.error('Gagal memuat riwayat revisi');
        } finally {
            setLoading(false);
        }
    }, [lookId, supabase]);

    useEffect(() => {
        fetchRevisions();
    }, [fetchRevisions]);

    const handleRestore = async (revision: CmsLookRevision) => {
        try {
            const { error } = await supabase
                .from('cms_looks')
                .update({
                    content: revision.content,
                    updated_at: new Date().toISOString()
                })
                .eq('id', lookId);

            if (error) throw error;

            toast.success(`Berhasil memulihkan ke versi ${revision.version}`);
            onRestore?.(revision);
            fetchRevisions();
        } catch (error) {
            console.error('Error restoring revision:', error);
            toast.error('Gagal memulihkan revisi');
        }
    };

    const handlePreview = (revision: CmsLookRevision) => {
        setSelectedRevision(revision);
    };

    const getStatusBadge = (status: CmsLookRevision['status']) => {
        switch (status) {
            case 'published':
                return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Published</Badge>;
            case 'draft':
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Draft</Badge>;
            case 'archived':
                return <Badge variant="outline"><Archive className="w-3 h-3 mr-1" /> Archived</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-10">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Riwayat Revisi
                </CardTitle>
                <CardDescription>
                    Lihat dan pulihkan versi sebelumnya dari tampilan CMS
                </CardDescription>
            </CardHeader>
            <CardContent>
                {revisions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada riwayat revisi</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {revisions.map((revision) => (
                            <div
                                key={revision.id}
                                className={`flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50 ${selectedRevision?.id === revision.id ? 'border-primary bg-muted' : ''
                                    }`}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold">Versi {revision.version}</span>
                                        {getStatusBadge(revision.status)}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {revision.created_by}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(revision.created_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    {revision.notes && (
                                        <p className="mt-2 text-sm text-muted-foreground">{revision.notes}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePreview(revision)}
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Preview
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleRestore(revision)}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-1" />
                                        Pulihkan
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
