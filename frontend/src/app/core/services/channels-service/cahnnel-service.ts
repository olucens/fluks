import { computed, Injectable, signal } from '@angular/core';
import { CHANNELS_MOCK_DATA } from '../../../models/channels.data';
import { ChannelData } from '../../../models/channels.model';

@Injectable({
  providedIn: 'root',
})
export class CahnnelService {
  private readonly channels = signal<ChannelData[]>(CHANNELS_MOCK_DATA);
  readonly searchQuery = signal<string>('');

  readonly filteredChannels = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.channels().filter((channel) =>
      channel.name.toLowerCase().includes(query)
    );
  });

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  getChannels(): ChannelData[] {
    return this.channels();
  }

  getChannelById(id: number): ChannelData | undefined {
    return this.channels().find((channel) => channel.id === id);
  }
}
