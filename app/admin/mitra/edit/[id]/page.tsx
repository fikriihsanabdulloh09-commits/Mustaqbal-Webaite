import { notFound } from 'next/navigation';
import { getPartnerById } from '@/lib/actions/partners';
import { PartnerForm } from '@/components/admin/PartnerForm';

interface EditMitraPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditMitraPage({ params }: EditMitraPageProps) {
    const { id } = await params;
    const partner = await getPartnerById(id);

    if (!partner) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold tracking-tight">Edit Mitra</h1>
                <p className="text-gray-500 mt-1">
                    Perbarui informasi mitra: {partner.name}
                </p>
            </div>

            <PartnerForm partner={partner} />
        </div>
    );
}
