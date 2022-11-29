import { Component } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from "jquery";
import * as Socket from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private serverUrl: string = 'http://localhost:8080/socket'
  title = 'angularSocket';
  private stompClient: any;

  constructor(){
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    
    this.stompClient.connect({}, function(frame: any) {
      that.stompClient.subscribe("/feedback", (message: any) => {
        if(message.body) {
          $(".chat").append("<div class='message'>"+/*JSON.parse(message.body)["cadastro"]*/message.body+"</div>")
          console.log(message.body);
        }
      });
    });

    let ws2 = new SockJS(this.serverUrl);
    let stompClient2 = Stomp.over(ws2);
    stompClient2.connect({}, function(frame: any) {
      stompClient2.subscribe("/feedback2", (message: any) => {
        if(message.body) {
          $(".chat").append("<div class='message'>"+message.body+"</div>")
          console.log(message.body);
        }
      });
    });
  }

  sendMessage(message: any){
    this.stompClient.send("/tester/log" , {}, message);
    $('#input').val('');
  }

  login(message: any){
    this.stompClient.send("/tester/startSession" , {}, message);
    $('#cadastro').val('');
  }
}
