const noButton = document.querySelector('.No');
const yesbtn = document.querySelector(".Yes");

function moveButton() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const randomX = Math.floor(Math.random() * (viewportWidth - noButton.offsetWidth));
    const randomY = Math.floor(Math.random() * (viewportHeight - noButton.offsetHeight));

    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;
}

noButton.addEventListener('mouseenter', moveButton);

yesbtn.addEventListener("click", () => {
    document.querySelector("body").style.backgroundColor = "#ff0090";
    document.querySelector(".head").innerText = "I knew it !!!";
})
