const inputBox = document.querySelector('.input');

inputBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const name = event.target.value;
        if (name) {
            localStorage.setItem("playerName", name);
            window.location.href = `/game?name=${encodeURIComponent(name)}`;
        }
    }
});