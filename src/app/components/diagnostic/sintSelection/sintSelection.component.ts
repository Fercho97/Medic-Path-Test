import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'sintSelection',
  templateUrl: './sintSelection.component.html',
  styleUrls: ['./sintSelection.component.css'],
})
export class SintSelectionComponent implements OnInit {

  @Input() public selectableSints;
  
  @Input() sintomasSeleccionados;
  @Input() zone;
  constructor(public activeModal: NgbActiveModal) { 

  }

  ngOnInit() {
  }

  return(){

    this.activeModal.close(this.sintomasSeleccionados);
  }

}
