import { PartnerForm } from '@/components/admin/PartnerForm';

export default function TambahMitraPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold tracking-tight">Tambah Mitra Baru</h1>
                <p className="text-gray-500 mt-1">
                    Tambahkan logo mitra baru untuk ditampilkan di slider
                </p>
            </div>

            <PartnerForm />
        </div>
    );
}
