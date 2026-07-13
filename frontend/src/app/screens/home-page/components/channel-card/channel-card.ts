import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { ChannelData } from '../../../../models/channels.model';
import { ViewersPipe } from '../../../../core/pipes/viewers-pipe';

@Component({
  selector: 'app-channel-card',
  imports: [ViewersPipe],
  templateUrl: './channel-card.html',
  styleUrl: './channel-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelCard {
  readonly channel = input.required<ChannelData>();

  readonly name = computed(() => this.channel().name);
  readonly description = computed(() => this.channel().description);
  readonly coverUrl = computed(() => this.channel().coverUrl);
  readonly category = computed(() => this.channel().category);
  readonly viewers = computed(() => this.channel().viewers);
}
