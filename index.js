
//img link functionalty 
let imgSelA = document.getElementById("signUp");



imgSelA.onclick = function() {location.replace("userAccount/createAccount.html")}


let imgSelB = document.getElementById("move_toabt");
let scrollSel = document.getElementById("aboutSection");
imgSelB.onclick = function () {

  scrollSel.scrollIntoView({behavior: "smooth"});

  
}












//GALLERY STUFF

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

let slideIndexA = 0;
showSlidesAuto();

function showSlidesAuto() {
  let iA;
  let slidesA = document.getElementsByClassName("mySlides");
  let dotsA = document.getElementsByClassName("dot");
  for (iA = 0; iA < slidesA.length; iA++) {
    slidesA[iA].style.display = "none";  
  }
  slideIndexA++;
  if (slideIndexA > slidesA.length) {slideIndexA = 1}    
  for (iA = 0; iA < dotsA.length; iA++) {
    dotsA[iA].className = dotsA[iA].className.replace(" active", "");
  }
  slidesA[slideIndexA-1].style.display = "block";  
  dotsA[slideIndexA-1].className += " active";
  setTimeout(showSlidesAuto, 3000); // Change image every 2 seconds
}


