import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent implements OnInit {

  windowScrolled : boolean;
  constructor (@Inject(DOCUMENT) private document:Document) {}
  @HostListener("window:scroll",[])

  onWindowScroll(){
    if (window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop>100) {
      this.windowScrolled = true  
    } else if( this.windowScrolled && window.scrollY || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
}
  }
  scrollToTop() {
    window.scrollTo(0,0)
}

  ngOnInit() {
    
  }

}
