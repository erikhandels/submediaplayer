const videoContainer = document.getElementById('videoContainer');
const overlay = document.getElementById('overlay');
const videoTemplate = document.getElementById('videoClone');
const buttonTemplate = document.getElementById('buttonClone');
const sourceTemplate = document.createElement("source");
sourceTemplate.type = "video/mp4";

const setup = item => {
  const newSource = sourceTemplate.cloneNode();
  newSource.src = item.video.source; //'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

  const newVideo = videoTemplate.cloneNode();
  newVideo.id = item.video.id;
  newVideo.appendChild(newSource);

  const newButton = buttonTemplate.cloneNode();
  newButton.id = item.button.id;
  Object.assign(newButton.style, item.button.style);
  if(window.location.search.includes('debug')){
    newButton.classList.add('debug')
    newButton.innerHTML = `<div class="debugName">${item.button.id}</div>`;
  }

  videoContainer.append(newVideo);
  overlay.append(newButton);

  newButton.addEventListener('touchstart', (e) => {
    document.querySelectorAll('.video').forEach(el => {
      el.style.opacity = 0;
      el.pause();
      el.currentTime = 0;
    })
    newVideo.play();
    newVideo.style.opacity = 1;
  })
}

fetch('./config.json')
  .then(response => response.json())
  .then(data => data.settings.forEach(item => setup(item)))
  .then(() => {
    videoTemplate.remove();
    buttonTemplate.remove();
    
    videoContainer.getElementsByTagName('video')[0].style.opacity = 1;
    videoContainer.getElementsByTagName('video')[0].play();
  })

