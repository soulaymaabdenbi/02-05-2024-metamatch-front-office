import { Component, Input } from "@angular/core";
import { EventInput } from "@fullcalendar/core";

@Component({
  selector: "app-event-tooltip",
  templateUrl: "./event-tooltip.component.html",
  styleUrls: ["./event-tooltip.component.scss"],
})
export class EventTooltipComponent {
  @Input() eventDetails: any;

  showTooltip: boolean = false;

  hide(): void {
    this.showTooltip = false;
  }
}
