'use strict';
/*
   Place all the behaviors and hooks related to the matching controller here.
   All this logic will automatically be available in application.js.
   */

class PlayCountdown{
  constructor(opts){
    this.periodInSecs = opts.period 
    this.imagesEndpointUrl = opts.imagesEndpointUrl;
  }

  start(){
    this.fetchImgs(this.triggerCountdown.bind(this));
    this.listenToSubmitEvent();
    let tableEl = document.getElementById('images');
    const rowCount = tableEl.getElementsByTagName("tr").length;
    if(rowCount > 1){
      tableEl.style.display = 'block';
      let emptyPlaceholder = document.getElementById('empty-play-container');
      if(emptyPlaceholder){
        emptyPlaceholder.style.display = 'none';
      }
    }
  }

  listenToSubmitEvent(){
    let form = document.getElementById("new_play");
    if(form){
      form.addEventListener("submit", this.formSubmited.bind(this), false);
    }
  }

  formSubmited(event){
    let btn = document.getElementById("submit");
    if(btn){
      btn.disabled = true;
      setTimeout(function() {
        btn.disabled = false;
      }, 1000);
    }
    const time = document.getElementById("time").value
    const url = document.getElementById("img-input").value
    this.renderSavedElemInTable(time, url);
  }

  renderSavedElemInTable(time, url){
    let tableEl = document.getElementById('images');
    tableEl.style.display = 'block';
    let newRow = tableEl.insertRow(1);
    let timeCell = newRow.insertCell(0);
    let urlCell = newRow.insertCell(1);
    const timeText = document.createTextNode(time);
    let image = new Image(64,64);
    image.src = url;
    timeCell.appendChild(timeText);
    urlCell.appendChild(image);
    const rowCount = tableEl.getElementsByTagName("tr").length;
    if(rowCount > 1){
      tableEl.style.display = 'block';
      let emptyPlaceholder = document.getElementById('empty-play-container');
      if(emptyPlaceholder){
        emptyPlaceholder.style.display = 'none';
      }
    }
  }

  triggerCountdown(){
    //let afterFetchTime = performance.now();
    let fetchTime = this.beforeFetchTime ? Math.floor((afterFetchTime - this.beforeFetchTime) / 1000) : 0;
    this.renderImagesInDom();
    this.secondsElapsed = this.secondsElapsed || 0;  //? (this.secondsElapsed + Math.max(fetchTime,1)) : 0;
    this.display();
    this.timer = setInterval(() => {
      this.secondsElapsed += 1;
      this.display();
    }, 1000);
  }

  renderImagesInDom(){
    this.mapImgToIndex = {};
    this.images.forEach((img,ind) => {
      this.mapImgToIndex[img] = ind;
      let image = new Image(200,200);
      image.src = img;
      image.id = `img${ind}`
      image.classList.add('images');
      document.getElementById('img-container').appendChild(image);
    });
  }

  display(){
    let remainingSeconds = (this.secondsElapsed % 10);
    let timeToDisplay = 10 - remainingSeconds;
    let h1 = document.getElementById("countdown");
    if(h1){
      h1.innerHTML = timeToDisplay.toString();
    }
    let img = document.getElementById("img");
    let index = this.secondsElapsed % this.images.length;
    this.showImgWithId(this.images[index]);
    this.setFormValues(timeToDisplay, this.images[index]);
  }

  setFormValues(time, url){
    let timeEl = document.getElementById("time");
    if(timeEl){
      timeEl.value = time;
      document.getElementById("img-input").value = url;
    }
  }

  showImgWithId(url){
    let images = document.getElementsByClassName('images');
    [].forEach.call(images, img => {
      img.style.display = 'none';
    });
    let id = `img${this.mapImgToIndex[url]}`;
    let selectedImg = document.getElementById(id);
    if(selectedImg){
      selectedImg.style.display = 'block';
    }
  }

  fetchImgs(cb){
    let that = this;
    fetch(this.imagesEndpointUrl)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
                      response.status);
          return;
        }
        // Examine the text in the response
        response.json().then(function(data) {
          that.images = data;
          if(that.images.length > 0){
            cb();
          } else {
            let btn = document.getElementById("submit");
            if(btn)
              btn.disabled = true;
          }
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  }
}

document.addEventListener("DOMContentLoaded", ()  => {
  let countdown = new PlayCountdown({
    period: 10,
    imagesEndpointUrl: './get_random_images/10.json'
  });
  countdown.start();
});
