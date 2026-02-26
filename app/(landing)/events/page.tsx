'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Clock, ExternalLink, Loader2 } from 'lucide-react';
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
  created_at: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date_start', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.event_date_start) >= now);
  const pastEvents = events.filter(e => new Date(e.event_date_start) < now);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.event_date_start);
    const endDate = new Date(event.event_date_end);

    if (now < startDate) {
      const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 7) {
        return { label: `${daysUntil} hari lagi`, color: 'bg-orange-100 text-orange-800' };
      }
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    }

    if (now >= startDate && now <= endDate) {
      return { label: 'Sedang Berlangsung', color: 'bg-green-100 text-green-800' };
    }

    return { label: 'Selesai', color: 'bg-gray-100 text-gray-800' };
  };

  const EventCard = ({ event, index }: { event: Event; index: number }) => {
    const status = getEventStatus(event);

    return (
      <AnimatedSection animation="fade-up" delay={index * 0.1}>
        <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
          {event.banner_url && (
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600">
              <img
                src={event.banner_url}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className={status.color}>
                  {status.label}
                </Badge>
              </div>
            </div>
          )}
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
              {event.title}
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDateRange(event.event_date_start, event.event_date_end)}
                  </p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.organizer && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span>Organizer: {event.organizer}</span>
                </div>
              )}

              {event.max_participants && event.max_participants > 0 && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span>Kuota: {event.max_participants} peserta</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-gray-600 line-clamp-3 mb-4">
                {event.description}
              </p>
            )}

            <div className="flex gap-3">
              <Link href={`/events/${event.slug}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Detail Event
                </Button>
              </Link>
              {event.registration_url && new Date(event.event_date_start) >= now && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Daftar <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-6">
                <Calendar className="w-4 h-4" />
                Event Calendar
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Event & Kegiatan
              </h1>
              <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
                Ikuti berbagai kegiatan menarik dan bermanfaat yang diselenggarakan oleh SMK Mustaqbal
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatedSection animation="fade-up" delay={0.1}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">
                  {events.length}
                </div>
                <div className="text-sm text-gray-600">Total Event</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {upcomingEvents.length}
                </div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.3}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-600 mb-2">
                  {pastEvents.length}
                </div>
                <div className="text-sm text-gray-600">Selesai</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Selesai ({pastEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Belum ada event mendatang</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Belum ada event yang selesai</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
