import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Announcement } from 'src/app/interfaces';

@Component({
  selector: 'app-announcement-card',
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.css']
})
export class AnnouncementCardComponent implements OnChanges {
  @Input() announcement !: Announcement;

  dateString: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['announcement']) {
      const date = changes['announcement'].currentValue.date;
      this.dateString = new Date(date).toLocaleDateString();
    }
  }
}
