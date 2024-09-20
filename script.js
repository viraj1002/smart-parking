document.addEventListener("DOMContentLoaded", function () {
    const rotatingImage = document.getElementById("rotating-image");
    const imageArray = ["parking1.jpg", "parking2.jpg", "parking3.jpg"];
    let currentIndex = 0;

    function changeImage() {
        rotatingImage.src = imageArray[currentIndex];
        currentIndex = (currentIndex + 1) % imageArray.length;
    }

    setInterval(changeImage, 3000); // Change image every 3 seconds
});
