import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({ selector: '[appScrollIntoView]' })
export class ScrollIntoViewDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly isActive = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isActive()) {
        this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }
}
