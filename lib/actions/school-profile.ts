'use server';

import { supabase } from '@/lib/supabase';
import { SchoolProfile } from '@/lib/supabase';
import { SCHOOL_PROFILE_DUMMY_CONTENT, getYoutubeId } from '@/lib/constants/school-profile';

/**
 * Fetch school profile data from Supabase
 * Returns the first active record
 */
export async function getSchoolProfile(): Promise<SchoolProfile | null> {
    try {
        const { data, error } = await supabase
            .from('school_profile')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching school profile:', error);
            return null;
        }

        return data as SchoolProfile;
    } catch (error) {
        console.error('Error fetching school profile:', error);
        return null;
    }
}

/**
 * Fetch school profile with client-side caching
 * Use this for client components
 */
export async function fetchSchoolProfile(): Promise<{
    profilText: string;
    profileHighlightQuote: string;
    tagLine: string;
    quoteText: string;
    tagLineDescription: string;
    youtubeVideoUrl: string;
    youtubeVideoId: string;
    videoFileUrl: string;
}> {
    const profile = await getSchoolProfile();

    if (!profile) {
        return {
            profilText: SCHOOL_PROFILE_DUMMY_CONTENT.profil_text,
            profileHighlightQuote: SCHOOL_PROFILE_DUMMY_CONTENT.profile_highlight_quote,
            tagLine: SCHOOL_PROFILE_DUMMY_CONTENT.tag_line,
            quoteText: SCHOOL_PROFILE_DUMMY_CONTENT.quote_text,
            tagLineDescription: SCHOOL_PROFILE_DUMMY_CONTENT.tag_line_description,
            youtubeVideoUrl: SCHOOL_PROFILE_DUMMY_CONTENT.youtube_video_url,
            youtubeVideoId: 'dQw4w9WgXcQ',
            videoFileUrl: SCHOOL_PROFILE_DUMMY_CONTENT.video_file_url,
        };
    }

    const youtubeVideoUrl =
        profile.youtube_video_url || `https://www.youtube.com/watch?v=${profile.youtube_video_id}`;
    const hasModernQuote = typeof profile.quote_text === 'string';

    return {
        profilText: profile.profil_text,
        profileHighlightQuote: profile.profile_highlight_quote || '',
        tagLine: hasModernQuote ? profile.tag_line || 'Tag Line' : 'Tag Line',
        quoteText: hasModernQuote ? profile.quote_text || 'Reach Your Success...' : profile.tag_line,
        tagLineDescription: profile.tag_line_description,
        youtubeVideoUrl,
        youtubeVideoId: getYoutubeId(youtubeVideoUrl) || profile.youtube_video_id,
        videoFileUrl: profile.video_file_url || '',
    };
}
