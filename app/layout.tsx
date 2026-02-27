import './globals.css';
import type { Metadata } from 'next';
import {
  Inter,
  Poppins,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Raleway,
  PT_Sans,
  Merriweather,
  Playfair_Display,
  Lora,
  Nunito,
  Rubik,
  Work_Sans,
  Quicksand,
  Josefin_Sans,
  DM_Sans,
  IBM_Plex_Sans,
  Fira_Sans,
  Crimson_Text
} from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-poppins', display: 'swap' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto', display: 'swap' });
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-open-sans', display: 'swap' });
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-montserrat', display: 'swap' });
const raleway = Raleway({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-raleway', display: 'swap' });
const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pt-sans', display: 'swap' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather', display: 'swap' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-playfair-display', display: 'swap' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-lora', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-nunito', display: 'swap' });
const rubik = Rubik({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-rubik', display: 'swap' });
const workSans = Work_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-work-sans', display: 'swap' });
const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-quicksand', display: 'swap' });
const josefinSans = Josefin_Sans({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-josefin-sans', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-dm-sans', display: 'swap' });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-ibm-plex-sans', display: 'swap' });
const firaSans = Fira_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-fira-sans', display: 'swap' });
const crimsonText = Crimson_Text({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-crimson-text', display: 'swap' });

export const metadata: Metadata = {
  title: 'SMK Mustaqbal - Membangun Generasi Unggul',
  description:
    'SMK Mustaqbal adalah sekolah menengah kejuruan yang menyediakan pendidikan berkualitas dengan kurikulum berbasis industri dan fasilitas modern.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`scroll-smooth ${inter.variable} ${poppins.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${raleway.variable} ${ptSans.variable} ${merriweather.variable} ${playfairDisplay.variable} ${lora.variable} ${nunito.variable} ${rubik.variable} ${workSans.variable} ${quicksand.variable} ${josefinSans.variable} ${dmSans.variable} ${ibmPlexSans.variable} ${firaSans.variable} ${crimsonText.variable}`}
    >
      <body className="font-sans bg-slate-50 text-slate-800 antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
