'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Branding {
  id: string;
  key: string;
  asset_type: string;
  url: string;
  alt_text?: string;
  width?: number;
  height?: number;
  settings: any;
  is_active: boolean;
}

export default function BrandingPage() {
  const [branding, setBranding] = useState<Record<string, Branding>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [logos, setLogos] = useState({
    main_logo: '',
    favicon: '',
    og_image: '',
  });

  useEffect(() => {
    fetchBranding();
  }, []);

  async function fetchBranding() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('site_branding').select('*');

      if (error) throw error;

      const brandingMap: Record<string, Branding> = {};
      data?.forEach((item) => {
        brandingMap[item.key] = item;
      });

      setBranding(brandingMap);
      setLogos({
        main_logo: brandingMap.main_logo?.url || '',
        favicon: brandingMap.favicon?.url || '',
        og_image: brandingMap.og_image?.url || '',
      });
    } catch (error) {
      console.error('Error fetching branding:', error);
      toast.error('Gagal memuat data branding');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(key: string, url: string, altText: string = '') {
    if (!url.trim()) {
      toast.error('URL tidak boleh kosong');
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const existingBrand = branding[key];
      const assetType = key.includes('logo') ? 'logo' : key.includes('favicon') ? 'favicon' : 'og_image';

      if (existingBrand) {
        const { error } = await supabase
          .from('site_branding')
          .update({
            url,
            alt_text: altText || `SMK Mustaqbal ${key}`,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingBrand.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_branding').insert({
          key,
          asset_type: assetType,
          url,
          alt_text: altText || `SMK Mustaqbal ${key}`,
          is_active: true,
        });

        if (error) throw error;
      }

      toast.success('Branding berhasil diperbarui!');
      fetchBranding();
    } catch (error) {
      console.error('Error saving branding:', error);
      toast.error('Gagal menyimpan branding');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Brand & Logo Management</h2>
        <p className="text-gray-500 mt-1">Kelola logo, favicon, dan asset branding sekolah</p>
      </div>

      <Tabs defaultValue="logo" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logo">Logo Utama</TabsTrigger>
          <TabsTrigger value="favicon">Favicon</TabsTrigger>
          <TabsTrigger value="og">Open Graph Image</TabsTrigger>
        </TabsList>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Logo Utama
              </CardTitle>
              <CardDescription>
                Logo yang ditampilkan di header website. Recommended: PNG/SVG, max height 60px
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="main_logo">URL Logo</Label>
                  <Input
                    id="main_logo"
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={logos.main_logo}
                    onChange={(e) => setLogos({ ...logos, main_logo: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    Upload logo ke hosting (Imgur, Cloudinary, dll) atau gunakan URL eksternal
                  </p>
                </div>

                {logos.main_logo && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="bg-white p-4 rounded inline-block">
                      <img
                        src={logos.main_logo}
                        alt="Logo Preview"
                        className="max-h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><text x="10" y="25" fill="gray">Invalid URL</text></svg>';
                        }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleSave('main_logo', logos.main_logo, 'SMK Mustaqbal Logo')}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Simpan Logo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favicon">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Favicon
              </CardTitle>
              <CardDescription>
                Icon yang muncul di tab browser. Recommended: ICO/PNG, size 32x32px atau 64x64px
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="favicon">URL Favicon</Label>
                  <Input
                    id="favicon"
                    type="url"
                    placeholder="https://example.com/favicon.ico"
                    value={logos.favicon}
                    onChange={(e) => setLogos({ ...logos, favicon: e.target.value })}
                  />
                </div>

                {logos.favicon && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="bg-white p-4 rounded inline-block">
                      <img
                        src={logos.favicon}
                        alt="Favicon Preview"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleSave('favicon', logos.favicon, 'SMK Mustaqbal Favicon')}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Simpan Favicon'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="og">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Open Graph Image
              </CardTitle>
              <CardDescription>
                Gambar yang muncul saat website dishare di social media. Recommended: 1200x630px
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="og_image">URL Open Graph Image</Label>
                  <Input
                    id="og_image"
                    type="url"
                    placeholder="https://example.com/og-image.jpg"
                    value={logos.og_image}
                    onChange={(e) => setLogos({ ...logos, og_image: e.target.value })}
                  />
                </div>

                {logos.og_image && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <img
                      src={logos.og_image}
                      alt="OG Image Preview"
                      className="w-full max-w-md h-auto rounded"
                    />
                  </div>
                )}

                <Button
                  onClick={() => handleSave('og_image', logos.og_image, 'SMK Mustaqbal OG Image')}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Menyimpan...' : 'Simpan OG Image'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Tips Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-2">
              <Upload className="w-4 h-4 mt-0.5 text-teal-600" />
              <div>
                <p className="font-medium">Free Image Hosting:</p>
                <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1">
                  <li>
                    <a href="https://imgur.com" target="_blank" className="text-teal-600 hover:underline">
                      Imgur.com
                    </a>{' '}
                    - Upload gratis, copy direct link
                  </li>
                  <li>
                    <a
                      href="https://cloudinary.com"
                      target="_blank"
                      className="text-teal-600 hover:underline"
                    >
                      Cloudinary.com
                    </a>{' '}
                    - Free tier 25GB
                  </li>
                  <li>
                    <a
                      href="https://postimages.org"
                      target="_blank"
                      className="text-teal-600 hover:underline"
                    >
                      PostImages.org
                    </a>{' '}
                    - No registration needed
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                💡 <strong>Pro Tip:</strong> Gunakan format PNG untuk logo dengan background transparan,
                atau SVG untuk logo yang scalable dan tetap tajam di semua ukuran.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
