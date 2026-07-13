import { InjectionToken } from '@angular/core';

export interface YoutubePlayerConfig {
  autoplay: 0 | 1;
  controls: 0 | 1;
  rel: 0 | 1;
  modestbranding: 0 | 1;
  fs: 0 | 1;
}

export const YOUTUBE_PLAYER_CONFIG = new InjectionToken<YoutubePlayerConfig>(
  'YOUTUBE_PLAYER_CONFIG',
  {
    providedIn: 'root',
    factory: () => ({
      autoplay: 1,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      fs: 1,
    }),
  }
);
