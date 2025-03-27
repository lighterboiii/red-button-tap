import { Track, Platform, MusicService } from '../types/music';

class SpotifyService implements MusicService {
  platform: Platform = 'spotify';

  async searchTrack(query: string): Promise<Track[]> {
    // Реализация поиска через Spotify API
    return [];
  }

  async getTrackById(id: string): Promise<Track> {
    // Реализация получения трека по ID
    throw new Error('Not implemented');
  }

  generateShareLink(track: Track): string {
    return track.platformLinks.spotify || '';
  }
}

class AppleMusicService implements MusicService {
  platform: Platform = 'apple';

  async searchTrack(query: string): Promise<Track[]> {
    // Реализация поиска через Apple Music API
    return [];
  }

  async getTrackById(id: string): Promise<Track> {
    // Реализация получения трека по ID
    throw new Error('Not implemented');
  }

  generateShareLink(track: Track): string {
    return track.platformLinks.apple || '';
  }
}

export const musicServices: Record<Platform, MusicService> = {
  spotify: new SpotifyService(),
  apple: new AppleMusicService(),
  youtube: {} as MusicService, // Реализовать позже
  yandex: {} as MusicService, // Реализовать позже
  vk: {} as MusicService, // Реализовать позже
}; 