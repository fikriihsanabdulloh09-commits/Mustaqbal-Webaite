'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

export default function PengaturanPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    school_info: {},
    branding: {},
    social_media: {},
    hero_section: {},
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });

      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: any) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Pengaturan berhasil disimpan');
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  }

  const handleSchoolInfoChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      school_info: {
        ...settings.school_info,
        [field]: value,
      },
    });
  };

  const handleBrandingChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      branding: {
        ...settings.branding,
        [field]: value,
      },
    });
  };

  const handleSocialMediaChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      social_media: {
        ...settings.social_media,
        [field]: value,
      },
    });
  };

  const handleHeroSectionChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      hero_section: {
        ...settings.hero_section,
        [field]: value,
      },
    });
  };

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
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Website</h2>
        <p className="text-gray-500 mt-1">
          Kelola konfigurasi dan informasi website
        </p>
      </div>

      <Tabs defaultValue="school" className="space-y-4">
        <TabsList>
          <TabsTrigger value="school">Informasi Sekolah</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum Sekolah</CardTitle>
              <CardDescription>
                Data dasar sekolah yang ditampilkan di website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Sekolah</Label>
                  <Input
                    id="name"
                    value={settings.school_info?.name || ''}
                    onChange={(e) => handleSchoolInfoChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings.school_info?.tagline || ''}
                    onChange={(e) => handleSchoolInfoChange('tagline', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="npsn">NPSN</Label>
                  <Input
                    id="npsn"
                    value={settings.school_info?.npsn || ''}
                    onChange={(e) => handleSchoolInfoChange('npsn', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.school_info?.email || ''}
                    onChange={(e) => handleSchoolInfoChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    value={settings.school_info?.phone || ''}
                    onChange={(e) => handleSchoolInfoChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={settings.school_info?.whatsapp || ''}
                    onChange={(e) => handleSchoolInfoChange('whatsapp', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  rows={3}
                  value={settings.school_info?.address || ''}
                  onChange={(e) => handleSchoolInfoChange('address', e.target.value)}
                />
              </div>

              <Button
                onClick={() => saveSetting('school_info', settings.school_info)}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Logo</CardTitle>
              <CardDescription>
                Pengaturan tema warna dan logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL Logo</Label>
                <Input
                  id="logo_url"
                  value={settings.branding?.logo_url || ''}
                  onChange={(e) => handleBrandingChange('logo_url', e.target.value)}
                  placeholder="/images/logo.png"
                />
                <p className="text-sm text-gray-500">
                  Upload logo ke folder public/images/ atau gunakan URL eksternal
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      value={settings.branding?.primary_color || '#0d9488'}
                      onChange={(e) => handleBrandingChange('primary_color', e.target.value)}
                    />
                    <Input
                      type="color"
                      value={settings.branding?.primary_color || '#0d9488'}
                      onChange={(e) => handleBrandingChange('primary_color', e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      value={settings.branding?.secondary_color || '#10b981'}
                      onChange={(e) => handleBrandingChange('secondary_color', e.target.value)}
                    />
                    <Input
                      type="color"
                      value={settings.branding?.secondary_color || '#10b981'}
                      onChange={(e) => handleBrandingChange('secondary_color', e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => saveSetting('branding', settings.branding)}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Link ke akun social media sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.social_media?.facebook || ''}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/smkmustaqbal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.social_media?.instagram || ''}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/smkmustaqbal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={settings.social_media?.youtube || ''}
                  onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@smkmustaqbal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  value={settings.social_media?.twitter || ''}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/smkmustaqbal"
                />
              </div>

              <Button
                onClick={() => saveSetting('social_media', settings.social_media)}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Homepage</CardTitle>
              <CardDescription>
                Konten utama yang ditampilkan di homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Judul Utama</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_section?.title || ''}
                  onChange={(e) => handleHeroSectionChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Subtitle</Label>
                <Textarea
                  id="hero_subtitle"
                  rows={3}
                  value={settings.hero_section?.subtitle || ''}
                  onChange={(e) => handleHeroSectionChange('subtitle', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta_text">Text Tombol CTA</Label>
                  <Input
                    id="cta_text"
                    value={settings.hero_section?.cta_text || ''}
                    onChange={(e) => handleHeroSectionChange('cta_text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_link">Link Tombol CTA</Label>
                  <Input
                    id="cta_link"
                    value={settings.hero_section?.cta_link || ''}
                    onChange={(e) => handleHeroSectionChange('cta_link', e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={() => saveSetting('hero_section', settings.hero_section)}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
