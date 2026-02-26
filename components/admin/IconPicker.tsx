'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  description?: string;
}

// List of popular icons for quick access
const popularIcons = [
  'Code', 'Cpu', 'Smartphone', 'Monitor', 'Database', 'Server', 'Cloud',
  'Wrench', 'Settings', 'Cog', 'Tool', 'Hammer', 'Boxes',
  'Palette', 'Brush', 'Paintbrush', 'Camera', 'Video',
  'Book', 'GraduationCap', 'BookOpen', 'Award', 'Trophy',
  'Heart', 'Star', 'Zap', 'Sparkles', 'Rocket',
  'Globe', 'MapPin', 'Navigation', 'Compass',
  'Users', 'User', 'UserCheck', 'Shield', 'Lock',
];

export function IconPicker({ value, onChange, label = 'Icon', description }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Get all available Lucide icon names
  const allIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(
      key => key !== 'createLucideIcon' && key !== 'default' && typeof (LucideIcons as any)[key] === 'function'
    );
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search) return allIcons;
    return allIcons.filter(name =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allIcons]);

  // Get the icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  const handleSelectIcon = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch('');
  };

  const clearIcon = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {description && <p className="text-sm text-gray-500">{description}</p>}

      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 flex-1"
            >
              {value ? (
                <>
                  {getIconComponent(value)}
                  <span>{value}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Pilih Icon</span>
                </>
              )}
            </Button>
          </DialogTrigger>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearIcon}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Pilih Icon</DialogTitle>
              <DialogDescription>
                Pilih icon untuk program dari {allIcons.length}+ icons yang tersedia
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari icon... (contoh: code, computer, book)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Popular Icons */}
              {!search && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Popular Icons</p>
                    <Badge variant="secondary">{popularIcons.length} icons</Badge>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {popularIcons.map(iconName => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleSelectIcon(iconName)}
                        className={`p-3 border rounded-lg hover:bg-teal-50 hover:border-teal-500 transition-all flex items-center justify-center ${
                          value === iconName ? 'bg-teal-50 border-teal-500' : ''
                        }`}
                        title={iconName}
                      >
                        {getIconComponent(iconName)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Icons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {search ? 'Search Results' : 'All Icons'}
                  </p>
                  <Badge variant="secondary">{filteredIcons.length} icons</Badge>
                </div>
                <ScrollArea className="h-[400px] border rounded-lg p-4">
                  <div className="grid grid-cols-8 gap-2">
                    {filteredIcons.map(iconName => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleSelectIcon(iconName)}
                        className={`p-3 border rounded-lg hover:bg-teal-50 hover:border-teal-500 transition-all flex items-center justify-center ${
                          value === iconName ? 'bg-teal-50 border-teal-500' : ''
                        }`}
                        title={iconName}
                      >
                        {getIconComponent(iconName)}
                      </button>
                    ))}
                  </div>
                  {filteredIcons.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Tidak ada icon ditemukan</p>
                      <p className="text-sm">Coba kata kunci lain</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview */}
      {value && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-teal-100 text-teal-600">
            {getIconComponent(value)}
          </div>
          <div>
            <p className="text-sm font-medium">{value}</p>
            <p className="text-xs text-gray-500">Icon yang dipilih</p>
          </div>
        </div>
      )}
    </div>
  );
}
