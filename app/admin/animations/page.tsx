'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Play } from 'lucide-react';
import { toast } from 'sonner';

interface Animation {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  category: string;
  animation_code: string;
  is_builtin: boolean;
  is_active: boolean;
  duration_ms: number;
  easing: string;
}

export default function AnimationsPage() {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewAnimation, setPreviewAnimation] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimations();
  }, []);

  async function fetchAnimations() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('animations')
        .select('*')
        .order('category', { ascending: true })
        .order('display_name', { ascending: true });

      if (error) throw error;
      setAnimations(data || []);
    } catch (error) {
      console.error('Error fetching animations:', error);
      toast.error('Gagal memuat animations');
    } finally {
      setLoading(false);
    }
  }

  function handlePreview(animationCode: string) {
    setPreviewAnimation(animationCode);
    setTimeout(() => setPreviewAnimation(null), 2000);
  }

  const groupedAnimations = animations.reduce((acc, animation) => {
    if (!acc[animation.category]) {
      acc[animation.category] = [];
    }
    acc[animation.category].push(animation);
    return acc;
  }, {} as Record<string, Animation[]>);

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
        <h2 className="text-3xl font-bold tracking-tight">Animation Library</h2>
        <p className="text-gray-500 mt-1">
          Koleksi animasi untuk sections - {animations.length} animations tersedia
        </p>
      </div>

      <Tabs defaultValue="entrance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entrance">Entrance</TabsTrigger>
          <TabsTrigger value="scroll">Scroll Effects</TabsTrigger>
          <TabsTrigger value="attention">Attention</TabsTrigger>
        </TabsList>

        <TabsContent value="entrance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedAnimations.entrance?.map((animation) => (
              <Card key={animation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{animation.display_name}</CardTitle>
                      <CardDescription className="mt-1">{animation.description}</CardDescription>
                    </div>
                    {animation.is_builtin && (
                      <Badge variant="secondary" className="text-xs">
                        Built-in
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center ${
                          previewAnimation === animation.animation_code ? animation.animation_code : ''
                        }`}
                      >
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Duration: {animation.duration_ms}ms</span>
                      <span>Easing: {animation.easing.split('(')[0]}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handlePreview(animation.animation_code)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedAnimations.scroll?.map((animation) => (
              <Card key={animation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{animation.display_name}</CardTitle>
                      <CardDescription className="mt-1">{animation.description}</CardDescription>
                    </div>
                    {animation.is_builtin && (
                      <Badge variant="secondary" className="text-xs">
                        Built-in
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                      <div className="text-center text-sm text-gray-500">
                        <Sparkles className="w-10 h-10 mx-auto mb-2 text-teal-600" />
                        Scroll-based animation
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" disabled>
                      <Play className="w-4 h-4 mr-2" />
                      Scroll to Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attention">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedAnimations.attention?.map((animation) => (
              <Card key={animation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{animation.display_name}</CardTitle>
                      <CardDescription className="mt-1">{animation.description}</CardDescription>
                    </div>
                    {animation.is_builtin && (
                      <Badge variant="secondary" className="text-xs">
                        Built-in
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center ${
                          previewAnimation === animation.animation_code ? animation.animation_code : ''
                        }`}
                      >
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Duration: {animation.duration_ms}ms</span>
                      <span>Repeat: Infinite</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handlePreview(animation.animation_code)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Using Animations</CardTitle>
          <CardDescription>How to apply animations to your page sections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>📌 Step 1:</strong> Go to Page Builder
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>📌 Step 2:</strong> Select a section to edit
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>📌 Step 3:</strong> Choose animation from dropdown
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>📌 Step 4:</strong> Set trigger (viewport, load, etc)
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>📌 Step 5:</strong> Save and preview on frontend!
              </p>
            </div>
          </div>

          <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-sm text-teal-900">
              💡 <strong>Pro Tip:</strong> Entrance animations work best with scroll trigger for smooth
              user experience. Attention animations are great for CTAs and important elements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
