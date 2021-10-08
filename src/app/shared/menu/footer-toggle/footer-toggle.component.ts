import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { SocialType } from 'src/app/news/news-section/social-type';

@Component({
  selector: 'footer-toggle',
  templateUrl: './footer-toggle.component.html',
  styleUrls: ['./footer-toggle.component.scss']
})
export class FooterToggleComponent implements OnInit {

  @Output() logoChanged = new EventEmitter<string>();
  @Input() displayedLogo = 'zt';
  spinEffect = false;
  constructor() { }

  ngOnInit(): void {
  }

  changeLogo(logo: SocialType) {
    this.displayedLogo = logo;
    this.doLogoSpin();
    this.logoChanged.emit(logo);
  }

  private doLogoSpin() {
    this.spinEffect = true;
    setTimeout(() => { this.spinEffect = false; }, 400);
  }


}
