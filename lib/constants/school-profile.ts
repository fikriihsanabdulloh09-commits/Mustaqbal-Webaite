export interface SchoolProfileContent {
  profil_text: string;
  profile_highlight_quote: string;
  tag_line: string;
  quote_text: string;
  tag_line_description: string;
  youtube_video_url: string;
  video_file_url: string;
}

export const SCHOOL_PROFILE_DUMMY_CONTENT: SchoolProfileContent = {
  profil_text:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. SMK Mustaqbal tumbuh sebagai sekolah vokasi yang memadukan karakter, kompetensi, dan kesiapan kerja agar lulusan mampu bersaing di dunia industri modern.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sejak awal berdiri, sekolah fokus pada pembelajaran berbasis praktik, kemitraan industri, dan budaya belajar yang disiplin namun tetap humanis.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Komitmen ini menjadikan SMK Mustaqbal sebagai ruang tumbuh bagi siswa untuk meraih masa depan yang lebih terarah.',
  profile_highlight_quote:
    'SMK Mustaqbal membina karakter, menguatkan skill, dan mengantar siswa menuju masa depan profesional.',
  tag_line: 'Tag Line',
  quote_text: 'Reach Your Success...',
  tag_line_description:
    'Setiap siswa punya potensi besar. Kami hadir untuk membimbingnya menjadi kompetensi nyata yang siap diterapkan di dunia kerja.',
  youtube_video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  video_file_url: '',
};

export function getYoutubeId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (match?.[1]) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return '';
}
