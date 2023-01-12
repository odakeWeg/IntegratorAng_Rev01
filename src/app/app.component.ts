import { ResultLog } from './models/result-log.model';
import { ProductLog } from './models/product-log.model';
import { TagContainer } from './models/tag-conteiner.model';
import { TestContainer } from './models/test-conteiner.model';
import { Component } from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as $ from "jquery";

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
  positionContainers: ProductLog[] = [] //Added but not implemented
  resultContainers: ResultLog[] = []
 
  //@Todo: Create Cancel buttom
  constructor(){
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    
    this.stompClient.connect({}, function(frame: any) {
      that.stompClient.subscribe("/feedback", (message: any) => {
        if(message.body) {  //fazer append de uma variável e utilizar o ngFor no html
          $(".chat").append("<div class='message'>"+/*JSON.parse(message.body)["cadastro"]*/message.body+"</div>")
          //$(".chat").append("<div style='border: 1px solid grey;'>Teste</div>")
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

  sendMessage(message: String){
    console.log(typeof message)
    console.log(typeof [message,"asd"][0])
    console.log(typeof [message])
    this.stompClient.send("/tester/log", {}, [message, message].toString());
    $('#input').val('');
  }

  login(message: any){
    this.stompClient.send("/tester/startSession", {}, message);
    $('#cadastro').val('');
  }

  response(message: any){
    this.stompClient.send("/tester/confirmation", {}, message);
    $('#resp').val('');
  }
  
  inputResponse(message: any){
    this.stompClient.send("/tester/input", {}, message);
    $('#inputField').val('');
  }

  endSessionResponse(message: any){
    this.stompClient.send("/tester/endSession", {}, message);
    $('#endSession').val('');
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
      //3) Descobrir qual é o container parent a partir do nome do test?
      if (this.testContainers[i].testName==message.testName) {
        let tagContainer = new TagContainer()
        tagContainer.descricao = message.descricao
        tagContainer.errorMessage = message.errorMessage
        tagContainer.log = message.log
        tagContainer.testResult = message.testResult
        //2) Dar Push no valor de Tag
        this.testContainers[i].tagContainer.push(tagContainer)
      }
    }
  }

  stopRoutine(message: any):void {
    this.stompClient.send("/tester/stop" , {}, message);
    $('#stop').val('');
  }

  starting(message: any):void {
    //@Todo -> sort of done
    //$(".chat").append("<div class='message'>"+message.descricao+ "->" + message.position+"</div>")
    //console.log(message.descricao);
    console.log(message);
    let productLog = new ProductLog()
    productLog.serial = message.serial
    productLog.material = message.material
    productLog.produto = message.produto
    productLog.descricao = message.descricao
    productLog.position = message.position
    this.positionContainers.push(productLog)
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
    //$(".end").append("<div class='message'>Result: "+message.result+" Position: "+message.position+"</div>")
    console.log(message);
    let exist = false
    let position = 0
    let result = new ResultLog()
    result.action = message.action
    result.finished = message.finished
    result.position = message.position
    result.result = message.result
    result.status = message.status
    
    this.resultContainers.forEach(function(item) {
      if (item.position==message.position) {
        position = item.position
        exist = true
      }
    })

    if(exist) {
      this.resultContainers[position-1] = result
    } else {
      this.resultContainers.push(result)
    }
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

    /*
    const EXIBIT_VALUES = "exibir"
    const USER_CONFIRM = "confirmacao";
    const USER_INPUT = "input";
    const INIT = "iniciar";
    const SHOW_FINAL_RESULT = "finalizacao";
    const TEST_STATUS_UPDATE = "status";
    */