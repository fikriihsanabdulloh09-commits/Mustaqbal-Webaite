'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { FileUploader } from '@/components/admin/FileUploader';
import { Save, Trash2, GripVertical, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface HeroSlide {
  id: number;
  image_url: string;
  order: number;
}

interface HeroSettings {
  slides: HeroSlide[];
  slider_duration: number;
  overlay_color: string;
  overlay_opacity: number;
  show_indicators: boolean;
  auto_play: boolean;
}

const defaultSettings: HeroSettings = {
  slides: [
    {
      id: 1,
      image_url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1920',
      order: 1
    },
    {
      id: 2,
      image_url: 'https://images.pexels.com/photos/5212653/pexels-photo-5212653.jpeg?auto=compress&cs=tinysrgb&w=1920',
      order: 2
    },
    {
      id: 3,
      image_url: 'https://images.pexels.com/photos/8500373/pexels-photo-8500373.jpeg?auto=compress&cs=tinysrgb&w=1920',
      order: 3
    }
  ],
  slider_duration: 5000,
  overlay_color: '#0d9488',
  overlay_opacity: 0.9,
  show_indicators: true,
  auto_play: true,
};

export default function HeroSettingsPage() {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings.auto_play) {
      const interval = setInterval(() => {
        setPreviewIndex(prev => (prev + 1) % settings.slides.length);
      }, settings.slider_duration);
      return () => clearInterval(interval);
    }
  }, [settings.auto_play, settings.slider_duration, settings.slides.length]);

  async function fetchSettings() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hero_settings')
        .maybeSingle();

      if (error) throw error;

      if (data && data.value) {
        setSettings(data.value as HeroSettings);
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast.error('Gagal memuat pengaturan hero');
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'hero_settings',
          value: settings,
          description: 'Hero slider settings',
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Pengaturan hero berhasil disimpan!');
    } catch (error: any) {
      console.error('Error saving hero settings:', error);
      toast.error('Gagal menyimpan: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  const addSlide = (url: string) => {
    const newSlide: HeroSlide = {
      id: Date.now(),
      image_url: url,
      order: settings.slides.length + 1,
    };
    setSettings(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
  };

  const removeSlide = (id: number) => {
    if (settings.slides.length <= 1) {
      toast.error('Minimal harus ada 1 slide');
      return;
    }
    setSettings(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== id),
    }));
    toast.success('Slide dihapus');
  };

  const updateSlideUrl = (id: number, url: string) => {
    setSettings(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, image_url: url } : s),
    }));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hero Slider Settings</h2>
          <p className="text-gray-500 mt-1">
            Kelola background slider dan pengaturan hero section
          </p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>Preview slider dengan pengaturan saat ini</CardDescription>
            </div>
            <Badge variant="secondary">
              <Eye className="w-3 h-3 mr-1" />
              Slide {previewIndex + 1}/{settings.slides.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            {settings.slides.map((slide, index) => (
              <div
                key={slide.id}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                  opacity: previewIndex === index ? 1 : 0,
                }}
              >
                <img
                  src={slide.image_url}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div
              className="absolute inset-0 mix-blend-multiply"
              style={{
                backgroundColor: settings.overlay_color,
                opacity: settings.overlay_opacity,
              }}
            />
            {settings.show_indicators && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {settings.slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPreviewIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      previewIndex === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Slider Images */}
      <Card>
        <CardHeader>
          <CardTitle>Background Images</CardTitle>
          <CardDescription>Upload dan kelola gambar background slider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FileUploader
            bucket="hero-slides"
            accept="image/*"
            maxSize={10485760}
            multiple={false}
            onUploadComplete={(url) => addSlide(url)}
          />

          <div className="space-y-3">
            <Label>Slides Aktif ({settings.slides.length})</Label>
            {settings.slides.map((slide, index) => (
              <div
                key={slide.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-white"
              >
                <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <img
                  src={slide.image_url}
                  alt={`Slide ${index + 1}`}
                  className="w-20 h-12 object-cover rounded flex-shrink-0"
                />
                <Input
                  value={slide.image_url}
                  onChange={(e) => updateSlideUrl(slide.id, e.target.value)}
                  placeholder="URL gambar"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSlide(slide.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Slider Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Slider Settings</CardTitle>
          <CardDescription>Konfigurasi perilaku slider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="duration">Durasi per Slide (ms)</Label>
              <span className="text-sm text-gray-600">{settings.slider_duration}ms</span>
            </div>
            <Slider
              id="duration"
              min={1000}
              max={10000}
              step={500}
              value={[settings.slider_duration]}
              onValueChange={([value]) =>
                setSettings(prev => ({ ...prev, slider_duration: value }))
              }
            />
            <p className="text-xs text-gray-500">
              {(settings.slider_duration / 1000).toFixed(1)} detik per slide
            </p>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="auto-play" className="cursor-pointer">Auto Play</Label>
              <p className="text-sm text-gray-500">Slider otomatis berpindah</p>
            </div>
            <Switch
              id="auto-play"
              checked={settings.auto_play}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, auto_play: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="show-indicators" className="cursor-pointer">Show Indicators</Label>
              <p className="text-sm text-gray-500">Tampilkan indikator dot di bawah</p>
            </div>
            <Switch
              id="show-indicators"
              checked={settings.show_indicators}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, show_indicators: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Overlay Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Overlay Settings</CardTitle>
          <CardDescription>Atur warna dan transparansi overlay</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="overlay-color">Warna Overlay</Label>
            <div className="flex gap-2">
              <Input
                id="overlay-color"
                value={settings.overlay_color}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, overlay_color: e.target.value }))
                }
                placeholder="#0d9488"
              />
              <Input
                type="color"
                value={settings.overlay_color}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, overlay_color: e.target.value }))
                }
                className="w-20"
              />
            </div>
            <div
              className="w-full h-8 rounded border"
              style={{ backgroundColor: settings.overlay_color }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="opacity">Opacity Overlay</Label>
              <span className="text-sm text-gray-600">
                {Math.round(settings.overlay_opacity * 100)}%
              </span>
            </div>
            <Slider
              id="opacity"
              min={0}
              max={1}
              step={0.05}
              value={[settings.overlay_opacity]}
              onValueChange={([value]) =>
                setSettings(prev => ({ ...prev, overlay_opacity: value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
          size="lg"
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
        </Button>
      </div>
    </div>
  );
}
