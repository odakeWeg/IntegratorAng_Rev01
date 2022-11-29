import { TagContainer } from './models/tag-conteiner.model';
import { TestContainer } from './models/test-conteiner.model';
import { Component } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from "jquery";

//@Todo: this code is not being used
const EXIBIT_VALUES = "exibir"
const USER_CONFIRM = "confirmacao";
const USER_INPUT = "input";
const INIT = "iniciar";
const SHOW_FINAL_RESULT = "finalizacao";
const TEST_STATUS_UPDATE = "status";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private serverUrl: string = 'http://localhost:8080/socket'
  title = 'angularSocket';
  private stompClient: any;

  testContainers: TestContainer[] = []

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
          let exp = "that."+JSON.parse(message.body).action+"(JSON.parse(message.body))"
          eval(exp)
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

  iniciar(message: any):void {
    //1) Acertar valores na variavel de container parent e dar push
    let testContainer = new TestContainer()
    testContainer.testName = message.testName
    testContainer.testResult = message.testResult
    //2) Iniciar array de Tags
    testContainer.tagContainer = []
    this.testContainers.push(testContainer)
  }

  exibir(message: any):void {
    //1) Acertar valores de Tag
    for (let i = 0; i < this.testContainers.length; i++) {
      if (this.testContainers[i].testName==message.testName) {
        let tagContainer = new TagContainer()
        tagContainer.descricao = message.descricao
        tagContainer.errorMessage = message.errorMessage
        tagContainer.log = message.log
        tagContainer.testResult = message.testResult
        this.testContainers[i].tagContainer.push(tagContainer)
      }
    }
    //2) Dar Push no valor de Tag
    //3) Descobrir qual é o container parent a partir do nome do test?
  }

  status(message: any):void {
    //@Todo
    $(".chat").append("<p>UpdateTestStatus:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  confirmacao(message: any):void {
    //@Todo
    $(".chat").append("<p>UserConfirmation:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  input(message: any):void {
    //@Todo
    $(".chat").append("<p>UserInput:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  finalizacao(message: any):void {
    //@Todo
    $(".chat").append("<p>EndTest:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }
}


/*
initiateTestConnect():void {
    let ws2 = new SockJS(this.serverUrl);
    let stompClient2 = Stomp.over(ws2);
    let that = this;
    stompClient2.connect({}, function(frame: any) {
      stompClient2.subscribe("/iniciar", (message: any) => {
        if(message.body) {
          that.initiateTest(message)
        }
        console.log("Aqui")
      });
    });
  }

  updateTagLogConnect():void {
    let ws2 = new SockJS(this.serverUrl);
    let stompClient2 = Stomp.over(ws2);
    let that = this;
    stompClient2.connect({}, function(frame: any) {
      stompClient2.subscribe("/exibir", (message: any) => {
        if(message.body) {
          that.updateTagLog(message)
        }
        console.log("Aqui")
      });
    });
  }

  updateTestStatusConnect():void {
    let ws2 = new SockJS(this.serverUrl);
    let stompClient2 = Stomp.over(ws2);
    let that = this;
    stompClient2.connect({}, function(frame: any) {
      stompClient2.subscribe("/status", (message: any) => {
        if(message.body) {
          that.updateTestStatus(message)
        }
        console.log("Aqui")
      });
    });
  }

  userConfirmationConnect():void {
    let ws2 = new SockJS(this.serverUrl);
    let stompClient2 = Stomp.over(ws2);
    let that = this;
    stompClient2.connect({}, function(frame: any) {
      stompClient2.subscribe("/confirmacao", (message: any) => {
        if(message.body) {
          that.userConfirmation(message)
        }
        console.log("Aqui")
      });
    });
  }

  userInputConnect():void {
    let ws2 = new SockJS(this.serverUrl);
    let stompClient2 = Stomp.over(ws2);
    let that = this;
    stompClient2.connect({}, function(frame: any) {
      stompClient2.subscribe("/input", (message: any) => {
        if(message.body) {
          that.userInput(message)
        }
        console.log("Aqui")
      });
    });
  }

  endTestConnect():void {
    let ws2 = new SockJS(this.serverUrl);
    let stompClient2 = Stomp.over(ws2);
    let that = this;
    stompClient2.connect({}, function(frame: any) {
      stompClient2.subscribe("/finalizacao", (message: any) => {
        if(message.body) {
          that.endTest(message)
        }
        console.log("Aqui")
      });
    });
  }
*/

/*
iniciar(message: any):void {
    $(".chat").append("<p>InitiateTest:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  exibir(message: any):void {
    $(".chat").append("<p>UpdateTagLog:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  status(message: any):void {
    $(".chat").append("<p>UpdateTestStatus:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  confirmacao(message: any):void {
    $(".chat").append("<p>UserConfirmation:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  input(message: any):void {
    $(".chat").append("<p>UserInput:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }

  finalizacao(message: any):void {
    $(".chat").append("<p>EndTest:</p><div class='message'>"+message.body+"</div>")
    console.log(message.body);
  }
*/

/*
    let a = new TestContainer()
    a.testResult = "testres1"
    a.testName = "name1"
    let tag = new TagContainer()
    tag.descricao = "desc1"
    tag.errorMessage = "err1"
    tag.log = "log1"
    tag.testResult = "trTag1"
    let tag2 = new TagContainer()
    tag2.descricao = "desc2"
    tag2.errorMessage = "err2"
    tag2.log = "log2"
    tag2.testResult = "trTag2"
    a.tagContainer = [tag, tag2]
    let b = new TestContainer()
    b.testResult = "testres2"
    b.testName = "name2"
    b.tagContainer = [tag]
    this.testContainers = [a, b]
    */