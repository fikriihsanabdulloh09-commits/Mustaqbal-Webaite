'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Theme {
  id: string;
  name: string;
  display_name: string;
  description: string;
  colors: any;
  fonts: any;
  is_active: boolean;
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  async function fetchThemes() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name');

      if (error) throw error;

      setThemes(data || []);
      const active = data?.find(t => t.is_active);
      if (active) {
        setActiveTheme(active);
        setEditingTheme(JSON.parse(JSON.stringify(active)));
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Gagal memuat themes');
    } finally {
      setLoading(false);
    }
  }

  async function activateTheme(themeId: string) {
    try {
      const supabase = createClient();

      // Deactivate all themes
      await supabase
        .from('themes')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Activate selected theme
      const { error } = await supabase
        .from('themes')
        .update({ is_active: true })
        .eq('id', themeId);

      if (error) throw error;

      toast.success('Theme berhasil diaktifkan');
      fetchThemes();
    } catch (error) {
      console.error('Error activating theme:', error);
      toast.error('Gagal mengaktifkan theme');
    }
  }

  async function saveThemeChanges() {
    if (!editingTheme) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('themes')
        .update({
          colors: editingTheme.colors,
          fonts: editingTheme.fonts,
        })
        .eq('id', editingTheme.id);

      if (error) throw error;

      toast.success('Theme berhasil disimpan');
      fetchThemes();
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Gagal menyimpan theme');
    }
  }

  const updateColor = (key: string, value: string) => {
    if (!editingTheme) return;
    setEditingTheme({
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        [key]: value,
      },
    });
  };

  const updateFont = (key: string, value: string) => {
    if (!editingTheme) return;
    setEditingTheme({
      ...editingTheme,
      fonts: {
        ...editingTheme.fonts,
        [key]: value,
      },
    });
  };

  const updateFontSize = (key: string, value: string) => {
    if (!editingTheme) return;
    setEditingTheme({
      ...editingTheme,
      fonts: {
        ...editingTheme.fonts,
        headingSizes: {
          ...editingTheme.fonts.headingSizes,
          [key]: value,
        },
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
        <h2 className="text-3xl font-bold tracking-tight">Theme Management</h2>
        <p className="text-gray-500 mt-1">
          Kelola warna, font, dan style global website
        </p>
      </div>

      {/* Theme Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Theme</CardTitle>
          <CardDescription>Pilih theme untuk diaktifkan di website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {themes.map(theme => (
              <div
                key={theme.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  theme.is_active
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setEditingTheme(JSON.parse(JSON.stringify(theme)));
                  if (!theme.is_active) activateTheme(theme.id);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{theme.display_name}</h3>
                  {theme.is_active && (
                    <Badge className="bg-teal-600">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                <div className="flex gap-2">
                  {Object.values(theme.colors).slice(0, 5).map((color: any, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Editor */}
      {editingTheme && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Edit Theme: {editingTheme.display_name}</CardTitle>
                <CardDescription>Customize warna dan font theme ini</CardDescription>
              </div>
              <Button onClick={saveThemeChanges} className="bg-teal-600 hover:bg-teal-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="colors">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="fonts">Typography</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4 mt-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(editingTheme.colors).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={key}
                          value={value as string}
                          onChange={(e) => updateColor(key, e.target.value)}
                          placeholder="#000000"
                        />
                        <Input
                          type="color"
                          value={value as string}
                          onChange={(e) => updateColor(key, e.target.value)}
                          className="w-20"
                        />
                      </div>
                      <div
                        className="w-full h-12 rounded border"
                        style={{ backgroundColor: value as string }}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="fonts" className="space-y-6 mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="heading-font">Heading Font</Label>
                    <Input
                      id="heading-font"
                      value={editingTheme.fonts.heading}
                      onChange={(e) => updateFont('heading', e.target.value)}
                      placeholder="Poppins"
                    />
                    <p className="text-sm text-gray-500">
                      Nama font untuk heading (H1-H6)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body-font">Body Font</Label>
                    <Input
                      id="body-font"
                      value={editingTheme.fonts.body}
                      onChange={(e) => updateFont('body', e.target.value)}
                      placeholder="Inter"
                    />
                    <p className="text-sm text-gray-500">
                      Nama font untuk body text
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Heading Sizes</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    {Object.entries(editingTheme.fonts.headingSizes).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`size-${key}`} className="uppercase">
                          {key}
                        </Label>
                        <Input
                          id={`size-${key}`}
                          value={value as string}
                          onChange={(e) => updateFontSize(key, e.target.value)}
                          placeholder="48px"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="body-size">Body Font Size</Label>
                    <Input
                      id="body-size"
                      value={editingTheme.fonts.bodySize}
                      onChange={(e) => updateFont('bodySize', e.target.value)}
                      placeholder="16px"
                    />
                  </div>
                </div>

                <div className="p-6 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold mb-4">Preview</h4>
                  <div
                    style={{
                      fontFamily: editingTheme.fonts.heading,
                      fontSize: editingTheme.fonts.headingSizes.h1,
                      color: editingTheme.colors.foreground,
                    }}
                  >
                    Heading Example
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      fontFamily: editingTheme.fonts.body,
                      fontSize: editingTheme.fonts.bodySize,
                      color: editingTheme.colors.foreground,
                    }}
                  >
                    This is body text example. Lorem ipsum dolor sit amet consectetur.
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• <strong>Color Picker</strong>: Klik kotak warna untuk memilih warna visual</p>
          <p>• <strong>Hex Code</strong>: Atau masukkan kode hex manual (contoh: #0d9488)</p>
          <p>• <strong>Font Names</strong>: Gunakan nama font yang tersedia di Google Fonts</p>
          <p>• <strong>Font Sizes</strong>: Gunakan unit px, rem, atau em (contoh: 48px, 3rem)</p>
          <p>• <strong>Preview</strong>: Perubahan langsung terlihat di preview box</p>
          <p>• <strong>Apply</strong>: Setelah edit, klik "Simpan Perubahan" untuk apply ke website</p>
        </CardContent>
      </Card>
    </div>
  );
}
