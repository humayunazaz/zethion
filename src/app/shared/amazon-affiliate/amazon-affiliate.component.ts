import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-amazon-affiliate',
  templateUrl: './amazon-affiliate.component.html',
  styleUrls: ['./amazon-affiliate.component.scss']
})
export class AmazonAffiliateComponent implements OnInit {

  @Input() affiliateItem: any;
  @Input() isBottom: boolean;
  @Input() type: string;

  constructor() { }

  ngOnInit(): void {
  }

  openLink(): void {
    window.open(this.affiliateItem.url, '_blank');
  }

}
