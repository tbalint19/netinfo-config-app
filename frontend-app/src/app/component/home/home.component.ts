import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "../../service/message.service";
import {Message} from "../../model/message.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private messages: MessageService) { }

  ngOnInit() {
    sessionStorage.removeItem("credential");
  }

  logout(){
    localStorage.removeItem("auth-token");
    this.messages.add(new Message("default", "Logout completed", "Be back soon"));
    this.router.navigate(['start']);
  }

}
