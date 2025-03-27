export type Platform = 'spotify' | 'apple' | 'youtube' | 'yandex' | 'vk';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  platformLinks: {
    [key in Platform]?: string;
  };
  artwork?: string;
}

export interface MusicService {
  platform: Platform;
  searchTrack: (query: string) => Promise<Track[]>;
  getTrackById: (id: string) => Promise<Track>;
  generateShareLink: (track: Track) => string;
} 