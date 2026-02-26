'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Palette } from 'lucide-react';
import { toast } from 'sonner';

interface GlobalStyle {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
}

export default function GlobalStylesPage() {
  const [styles, setStyles] = useState<GlobalStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedStyles, setEditedStyles] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchStyles();
  }, []);

  async function fetchStyles() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('global_styles')
        .select('*')
        .order('category');

      if (error) throw error;
      setStyles(data || []);
    } catch (error) {
      console.error('Error fetching styles:', error);
      toast.error('Gagal memuat styles');
    } finally {
      setLoading(false);
    }
  }

  async function saveStyles() {
    try {
      const supabase = createClient();

      // Update all edited styles
      const updates = Object.entries(editedStyles).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        await supabase
          .from('global_styles')
          .update({ value: update.value, updated_at: update.updated_at })
          .eq('key', update.key);
      }

      toast.success('Styles berhasil disimpan');
      setEditedStyles({});
      fetchStyles();
    } catch (error) {
      console.error('Error saving styles:', error);
      toast.error('Gagal menyimpan styles');
    }
  }

  const updateStyle = (key: string, value: string) => {
    setEditedStyles({
      ...editedStyles,
      [key]: value,
    });
  };

  const getValue = (style: GlobalStyle) => {
    return editedStyles[style.key] !== undefined
      ? editedStyles[style.key]
      : style.value;
  };

  const groupedStyles = styles.reduce((acc, style) => {
    if (!acc[style.category]) acc[style.category] = [];
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, GlobalStyle[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Global Styles</h2>
          <p className="text-gray-500 mt-1">
            Kelola CSS variables global yang digunakan di seluruh website
          </p>
        </div>
        <Button
          onClick={saveStyles}
          disabled={Object.keys(editedStyles).length === 0}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan Perubahan ({Object.keys(editedStyles).length})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSS Variables</CardTitle>
          <CardDescription>
            Variables ini akan di-apply sebagai CSS custom properties (--variable-name)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={Object.keys(groupedStyles)[0] || 'typography'}>
            <TabsList>
              {Object.keys(groupedStyles).map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(groupedStyles).map(([category, categoryStyles]) => (
              <TabsContent key={category} value={category} className="space-y-4 mt-4">
                {category === 'colors' && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryStyles.map(style => (
                      <div key={style.id} className="space-y-2">
                        <Label htmlFor={style.key}>
                          {style.key.replace('--', '').replace(/-/g, ' ')}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={style.key}
                            value={getValue(style)}
                            onChange={(e) => updateStyle(style.key, e.target.value)}
                          />
                          {style.value.startsWith('#') && (
                            <Input
                              type="color"
                              value={getValue(style)}
                              onChange={(e) => updateStyle(style.key, e.target.value)}
                              className="w-20"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{style.description}</p>
                        {style.value.startsWith('#') && (
                          <div
                            className="w-full h-8 rounded border"
                            style={{ backgroundColor: getValue(style) }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {category !== 'colors' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {categoryStyles.map(style => (
                      <div key={style.id} className="space-y-2">
                        <Label htmlFor={style.key}>
                          {style.key.replace('--', '').replace(/-/g, ' ')}
                        </Label>
                        <Input
                          id={style.key}
                          value={getValue(style)}
                          onChange={(e) => updateStyle(style.key, e.target.value)}
                        />
                        <p className="text-xs text-gray-500">{style.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview CSS Output</CardTitle>
          <CardDescription>Variables yang akan di-generate</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
            {`:root {\n${styles
              .map(style => `  ${style.key}: ${getValue(style)};`)
              .join('\n')}\n}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• <strong>CSS Variables</strong>: Variables ini bisa digunakan di CSS dengan format <code className="bg-gray-100 px-1 rounded">var(--variable-name)</code></p>
          <p>• <strong>Colors</strong>: Gunakan hex code (contoh: #0d9488) atau color name</p>
          <p>• <strong>Spacing</strong>: Gunakan unit px, rem, atau em (contoh: 8px, 0.5rem)</p>
          <p>• <strong>Typography</strong>: Font family name (contoh: Inter, Poppins)</p>
          <p>• <strong>Shadows</strong>: CSS shadow value (contoh: 0 4px 6px rgba(0,0,0,0.1))</p>
          <p>• <strong>Real-time</strong>: Perubahan akan di-apply setelah klik "Simpan Perubahan"</p>
        </CardContent>
      </Card>
    </div>
  );
}
