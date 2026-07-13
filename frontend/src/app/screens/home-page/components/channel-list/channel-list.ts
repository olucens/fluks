import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChannelCard } from '../channel-card/channel-card';
import { CahnnelService } from '../../../../core/services/channels-service/cahnnel-service';

@Component({
  selector: 'app-channel-list',
  imports: [ChannelCard],
  templateUrl: './channel-list.html',
  styleUrl: './channel-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelList {
  private readonly channelService = inject(CahnnelService);

  readonly channels = this.channelService.filteredChannels;

  setQuery(value: string): void {
    this.channelService.setSearchQuery(value);
  }
}
