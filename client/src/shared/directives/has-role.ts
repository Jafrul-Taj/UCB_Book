import { Directive, inject, Input, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../core/services/account-service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRole implements OnInit {
  
  @Input() appHasRole: string[]=[];
  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templeteRef = inject(TemplateRef);

  ngOnInit(): void {
    if(this.accountService.currentUser()?.roles?.some(r=> this.appHasRole.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templeteRef);
    }else{
      this.viewContainerRef.clear();
    }
  }

}
