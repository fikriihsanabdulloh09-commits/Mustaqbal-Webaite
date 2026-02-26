'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_date_start: string;
  event_date_end: string;
  location: string;
  organizer: string;
  max_participants: number;
  registration_url: string;
  banner_url: string;
  is_published: boolean;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  async function fetchEvent() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Event yang Anda cari tidak tersedia</p>
          <Link href="/events">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Event
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const startDate = new Date(event.event_date_start);
  const endDate = new Date(event.event_date_end);
  const isUpcoming = startDate >= now;
  const isOngoing = now >= startDate && now <= endDate;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Banner */}
      {event.banner_url && (
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600">
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-8 left-0 right-0 container mx-auto px-4">
            <Link href="/events">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="mb-6">
              {isOngoing && (
                <Badge className="bg-green-100 text-green-800 mb-4">
                  Sedang Berlangsung
                </Badge>
              )}
              {isUpcoming && (
                <Badge className="bg-blue-100 text-blue-800 mb-4">
                  Upcoming
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tanggal</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(event.event_date_start)}
                        </p>
                        {event.event_date_start !== event.event_date_end && (
                          <p className="text-sm text-gray-600">
                            s/d {formatDate(event.event_date_end)}
                          </p>
                        )}
                      </div>
                    </div>

                    {event.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                          <p className="font-medium text-gray-900">{event.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {event.organizer && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Penyelenggara</p>
                          <p className="font-medium text-gray-900">{event.organizer}</p>
                        </div>
                      </div>
                    )}

                    {event.max_participants && event.max_participants > 0 && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Kuota Peserta</p>
                          <p className="font-medium text-gray-900">
                            {event.max_participants} orang
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {event.registration_url && isUpcoming && (
                  <div className="mt-6 pt-6 border-t">
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700">
                        Daftar Sekarang <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Event</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description || 'Deskripsi event belum tersedia.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
