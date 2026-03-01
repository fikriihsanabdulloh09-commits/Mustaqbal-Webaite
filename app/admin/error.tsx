'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
                <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Terjadi Kesalahan</h2>
                <p className="text-sm text-gray-500">
                    {error.message || 'Terjadi kesalahan yang tidak terduga.'}
                </p>
                <Button onClick={reset} className="bg-teal-600 hover:bg-teal-700">
                    Coba Lagi
                </Button>
            </div>
        </div>
    );
}
