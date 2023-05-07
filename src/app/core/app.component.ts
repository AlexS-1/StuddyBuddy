import { Component } from '@angular/core';
import { NavBarService } from './nav-bar.service';
import { Router, NavigationEnd, GuardsCheckStart } from '@angular/router';
import { AuthService } from './auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private navBarService: NavBarService, private router: Router, private authService: AuthService){}

  declare sideBarOff: boolean;

  ngOnInit() {
    this.navBarService.isOpen$.subscribe(isOpen => this.sideBarOff = isOpen);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || GuardsCheckStart) {
        if (!this.navBarService.isSideBarFoldedIn ) {
          this.navBarService.toggleSideBar();
        }
      }
    });
  }

  ngOnDestroy(){
    this.authService.logout();
  }

  
  title = 'studdy-buddy';

}
