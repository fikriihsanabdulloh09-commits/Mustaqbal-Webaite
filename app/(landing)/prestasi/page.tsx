'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Medal, Award, Calendar, User, MapPin, Loader2 } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';

interface Achievement {
  id: string;
  title: string;
  student_name: string;
  category: string;
  level: string;
  rank: string;
  year: number;
  event_date: string;
  description: string;
  image_url: string;
  is_featured: boolean;
}

export default function PrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const years = ['all', '2024', '2023', '2022', '2021'];
  const categories = ['all', 'akademik', 'olahraga', 'seni', 'teknologi', 'lainnya'];
  const levels = ['all', 'internasional', 'nasional', 'provinsi', 'kota'];

  useEffect(() => {
    fetchAchievements();
  }, []);

  useEffect(() => {
    filterData();
  }, [achievements, filterYear, filterCategory, filterLevel]);

  async function fetchAchievements() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterData() {
    let filtered = [...achievements];

    if (filterYear !== 'all') {
      filtered = filtered.filter(a => a.year === parseInt(filterYear));
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(a => a.category.toLowerCase() === filterCategory);
    }

    if (filterLevel !== 'all') {
      filtered = filtered.filter(a => a.level.toLowerCase() === filterLevel);
    }

    setFilteredAchievements(filtered);
  }

  const getRankIcon = (rank: string) => {
    if (rank === 'Juara 1' || rank.includes('Gold') || rank.includes('Emas')) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    }
    if (rank === 'Juara 2' || rank.includes('Silver') || rank.includes('Perak')) {
      return <Medal className="w-5 h-5 text-gray-400" />;
    }
    if (rank === 'Juara 3' || rank.includes('Bronze') || rank.includes('Perunggu')) {
      return <Award className="w-5 h-5 text-orange-600" />;
    }
    return <Award className="w-5 h-5 text-teal-600" />;
  };

  const getLevelColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower === 'internasional') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (levelLower === 'nasional') return 'bg-red-100 text-red-800 border-red-200';
    if (levelLower === 'provinsi') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (levelLower === 'kota') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryColor = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower === 'akademik') return 'bg-blue-50 text-blue-700';
    if (catLower === 'olahraga') return 'bg-green-50 text-green-700';
    if (catLower === 'seni') return 'bg-pink-50 text-pink-700';
    if (catLower === 'teknologi') return 'bg-purple-50 text-purple-700';
    return 'bg-gray-50 text-gray-700';
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
                <Trophy className="w-4 h-4" />
                Hall of Fame
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Prestasi Siswa
              </h1>
              <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
                Kebanggaan SMK Mustaqbal - Daftar prestasi gemilang yang diraih siswa-siswi kami di berbagai kompetisi
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedSection animation="fade-up" delay={0.1}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">
                  {achievements.length}
                </div>
                <div className="text-sm text-gray-600">Total Prestasi</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.2}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {achievements.filter(a => a.level.toLowerCase() === 'internasional').length}
                </div>
                <div className="text-sm text-gray-600">Internasional</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.3}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  {achievements.filter(a => a.level.toLowerCase() === 'nasional').length}
                </div>
                <div className="text-sm text-gray-600">Nasional</div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.4}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {achievements.filter(a => a.level.toLowerCase() === 'provinsi').length}
                </div>
                <div className="text-sm text-gray-600">Provinsi</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>
                      {year === 'all' ? 'Semua Tahun' : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'Semua Kategori' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Tingkat" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === 'all' ? 'Semua Tingkat' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Menampilkan {filteredAchievements.length} prestasi
          </p>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada prestasi ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement, index) => (
                <AnimatedSection
                  key={achievement.id}
                  animation="fade-up"
                  delay={index * 0.1}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
                    {achievement.image_url && (
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={achievement.image_url}
                          alt={achievement.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          {getRankIcon(achievement.rank)}
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge className={`${getLevelColor(achievement.level)} border`}>
                          {achievement.level}
                        </Badge>
                        <Badge className={getCategoryColor(achievement.category)}>
                          {achievement.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {achievement.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{achievement.student_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          <span className="font-medium text-teal-600">{achievement.rank}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(achievement.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
                        </div>
                      </div>
                      {achievement.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {achievement.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
