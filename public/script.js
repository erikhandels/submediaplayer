const videoContainer = document.getElementById('videoContainer');
const overlay = document.getElementById('overlay');
const videoTemplate = document.getElementById('videoClone');
const buttonTemplate = document.getElementById('buttonClone');
const sourceTemplate = document.createElement("source");
sourceTemplate.type = "video/mp4";

const setup = (key, value, data) => {
  const item = data[key]
  const newSource = sourceTemplate.cloneNode();
  newSource.src = item.video.source;

  const newVideo = videoTemplate.cloneNode();
  newVideo.id = item.video.id;
  newVideo.appendChild(newSource);

  const newButton = buttonTemplate.cloneNode(true);
  newButton.id = key;
  Object.assign(newButton.style, item.button.style);

  const saveButton = document.getElementById('saveButton')
  const escapeButton = document.getElementById('escapeButton')

  if(window.location.search.includes('debug')){
    newButton.classList.add('debug')
    newButton.querySelector('.debugName').innerHTML = key;
    
    const resizeElement = newButton.querySelector('.debugResize');
    const dragElement = newButton.querySelector('.dragArea')
    let startX;
    let startY;
    let startWidth;
    let startHeight;
    let touchOffsetX;
    let touchOffsetY;

    resizeElement.addEventListener('touchstart', function(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(newButton).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(newButton).height, 10);
    })

    resizeElement.addEventListener('touchmove', function(event) {
        var touch = event.touches[0];
        var deltaX = touch.clientX - startX;
        var newWidth = startWidth + deltaX;

        var deltaY = touch.clientY - startY;
        var newHeight = startHeight + deltaY;

        // Set a minimum width to prevent the div from becoming too small
        if (newWidth > 50) {
          newButton.style.width = newWidth + 'px';
        }
        if (newHeight > 50) {
          newButton.style.height = newHeight + 'px';
      }
    });

    resizeElement.addEventListener('touchend', function(event) {
        startWidth = parseInt(document.defaultView.getComputedStyle(newButton).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(newButton).height, 10);
    });

    dragElement.addEventListener('touchstart', function(event) {
      // Get the touch position relative to the element
      var touch = event.touches[0];
      touchOffsetX = touch.clientX - newButton.getBoundingClientRect().left;
      touchOffsetY = touch.clientY - newButton.getBoundingClientRect().top;
    });

    dragElement.addEventListener('touchmove', function(event) {
        // Prevent scrolling
        event.preventDefault();

        var touch = event.touches[0];
        var newX = touch.clientX - touchOffsetX;
        var newY = touch.clientY - touchOffsetY;

        // Ensure the element stays within the bounds of the viewport
        newX = Math.max(0, Math.min(window.innerWidth - newButton.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - newButton.offsetHeight, newY));

        newButton.style.left = newX + 'px';
        newButton.style.top = newY + 'px';
    });

  }else{
    newButton.innerHTML = '';
    if(saveButton){
      saveButton.remove()
    }
    if(escapeButton){
      escapeButton.remove()
    }
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
  .then(data => Object.keys(data).forEach((key, value) => setup(key, value, data)))
  .then(() => {
    videoTemplate.remove();
    buttonTemplate.remove();
    
    videoContainer.getElementsByTagName('video')[0].style.opacity = 1;
    videoContainer.getElementsByTagName('video')[0].play();

    
    saveButton.addEventListener('touchstart', function(event) {
      console.log('save positions to JSON')
      let updatedValues = {}
      document.querySelectorAll('.button').forEach(button => {
        let style = document.defaultView.getComputedStyle(button)
        updatedValues[button.id] = {"style": {"left": style.left, "top": style.top, "width": style.width, "height": style.height}}
        
      })

      console.log(updatedValues)

      fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedValues)
      })
      .then(response => response.json())
      .then(response => console.log(response.status))
      .catch(error => {
        // Handle error
      });

      setTimeout(() => {
        // window.location.href = window.location.origin
      }, 1000);
    })

    escapeButton.addEventListener('touchstart', function(event) {
      window.location.href = window.location.origin
    })
  })
