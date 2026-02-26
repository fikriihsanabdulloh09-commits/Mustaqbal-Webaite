'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, X, GripVertical, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CertificationManagerProps {
  certifications: string[];
  onChange: (certifications: string[]) => void;
  label?: string;
  description?: string;
}

export function CertificationManager({
  certifications,
  onChange,
  label = 'Sertifikat & Penghargaan',
  description,
}: CertificationManagerProps) {
  const [newCert, setNewCert] = useState('');

  const addCertification = () => {
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      onChange([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const removeCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  const moveCertification = (fromIndex: number, toIndex: number) => {
    const newCerts = [...certifications];
    const [movedItem] = newCerts.splice(fromIndex, 1);
    newCerts.splice(toIndex, 0, movedItem);
    onChange(newCerts);
  };

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      {description && <p className="text-sm text-gray-500">{description}</p>}

      {/* Add New Certification */}
      <div className="flex gap-2">
        <Input
          value={newCert}
          onChange={(e) => setNewCert(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCertification();
            }
          }}
          placeholder="Nama sertifikat atau penghargaan..."
        />
        <Button
          type="button"
          onClick={addCertification}
          disabled={!newCert.trim()}
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah
        </Button>
      </div>

      {/* Certifications List */}
      {certifications.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Daftar Sertifikat ({certifications.length})
            </p>
            <Badge variant="secondary" className="text-xs">
              Bisa drag & drop untuk reorder
            </Badge>
          </div>

          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center gap-3">
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1 cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{cert}</p>
                    <p className="text-xs text-gray-500">Sertifikat #{index + 1}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveCertification(index, index - 1)}
                        className="h-8 w-8 p-0"
                        title="Pindah ke atas"
                      >
                        ↑
                      </Button>
                    )}
                    {index < certifications.length - 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveCertification(index, index + 1)}
                        className="h-8 w-8 p-0"
                        title="Pindah ke bawah"
                      >
                        ↓
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Hapus"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-1">Belum ada sertifikat</p>
          <p className="text-sm text-gray-400">
            Tambahkan sertifikat atau penghargaan yang dimiliki
          </p>
        </Card>
      )}

      {/* Tips */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>💡 Tips:</strong> Masukkan nama sertifikat lengkap. Contoh: &quot;Sertifikat Pendidik Profesional&quot;, &quot;TOEFL Score 550&quot;, &quot;Juara 1 Lomba Guru Berprestasi 2023&quot;
        </p>
      </div>
    </div>
  );
}
