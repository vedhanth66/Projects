let play = document.querySelector(".play");
let previous = document.querySelector(".previous");
let next = document.querySelector(".next");
let currentIndex = 0;
let currFolder;
let songs = [];

async function getSongs(folder) {
    try {
        currFolder = folder;
        let a = await fetch(`http://127.0.0.1:5500/Projects/Spotify/${currFolder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;

        let as = div.getElementsByTagName("a");
        songs = []; 
        
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".mp3")) {
                let songUrl = element.href.startsWith("http") ? element.href : `http://127.0.0.1:5500${element.getAttribute("href")}`;
                songs.push(songUrl.split(`/${folder}/`)[1]);
            }
        }

        let songUl = document.querySelector(".song-list ul");
        songUl.innerHTML = "";
        
        for (const song of songs) {
            songUl.innerHTML += `<li>
                <div class="music-icon">
                    <i class="fa-solid fa-music"></i>
                </div>
                <div class="Song-discription">
                    <div>${decodeURIComponent(song)}</div>
                </div>
                <div class="play-now hover-size3">Play now
                    <div class="play-icon"><i class="fa-regular fa-circle-play hover-size"></i></div>
                </div>
            </li>`;
        }

        Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e, index) => {
            e.addEventListener("click", () => {
                playMusic(e.querySelector(".Song-discription").firstElementChild.innerHTML.trim());
                currentIndex = index;
            });
        });

    } catch (error) {
        console.error('Fetch operation failed:', error);
    }
}

let currSong = new Audio();
let isPlaying = false;

function playMusic(track) {
    currSong.src = `http://127.0.0.1:5500/Projects/Spotify/${currFolder}/${track}`;
    document.querySelector(".song-info").innerHTML = decodeURIComponent(track);
    currSong.play();
    isPlaying = true;
    updatePlayPauseIcon();

    currSong.addEventListener('loadedmetadata', () => {
        document.querySelector(".song-time").innerHTML = `0:00 / ${formatTime(currSong.duration)}`;
    });

    currSong.addEventListener('timeupdate', () => {
        document.querySelector(".song-time").innerHTML = `${formatTime(currSong.currentTime)} / ${formatTime(currSong.duration)}`;
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
    });
}

document.querySelector(".seekbar").addEventListener("click", e => {
    let seekbar = e.target.getBoundingClientRect();
    let percent = (e.clientX - seekbar.left) / seekbar.width;
    document.querySelector(".circle").style.left = (percent * 100) + "%";
    currSong.currentTime = percent * currSong.duration;
});

function formatTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

async function displayAlbums() {
    try {
        let a = await fetch(`http://127.0.0.1:5500/Projects/Spotify/songs/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector('.card-container');
        
        for (let i = 0; i < anchors.length; i++) {
            const e = anchors[i];
            if (e.href.includes("/songs/")) {
                let folder = e.href.split("/").slice(-1)[0];
                let response = await fetch(`http://127.0.0.1:5500/Projects/Spotify/songs/${folder}/info.json`);
                let info = await response.json();
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <div class="play-btn">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <img src="songs/${folder}/Cover.jpg" alt="">
                        <p class="happy-hits">${info.title}</p>
                        <p>${info.description}</p>
                    </div>`;
            }
        }

        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0]);
                document.querySelector(".left").style.left = "0";
            });
        });
    } catch (error) {
        console.error('Error loading albums:', error);
    }
}

displayAlbums();

async function main() {
    await getSongs("songs");

    play.addEventListener("click", () => {
        if (!currSong.src) {
            alert("Please select a song to play.");
            return;
        }

        if (currSong.paused) {
            currSong.play();
            isPlaying = true;
        } else {
            currSong.pause();
            isPlaying = false;
        }
        updatePlayPauseIcon();
    });

    previous.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex = (currentIndex - 1) % songs.length;
            playMusic(songs[currentIndex]);
        }
    });

    next.addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex = (currentIndex + 1) % songs.length;
            playMusic(songs[currentIndex]);
        }
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });
    
    document.querySelector(".spotify-playlist").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    let previousVolume = currSong.volume;
    
    document.querySelector(".volume-slider").addEventListener("input", (e) => {
        currSong.volume = parseInt(e.target.value) / 100;
        updateVolumeIcon(currSong.volume);
    });

    document.querySelector(".icon").addEventListener("click", e => {
        if (currSong.volume > 0) {
            previousVolume = currSong.volume;
            currSong.volume = 0;
        } else {
            currSong.volume = previousVolume;
        }
        updateVolumeIcon(currSong.volume);
    });
}

function updatePlayPauseIcon() {
    play.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
}

function updateVolumeIcon(volume) {
    let icon = document.querySelector(".icon i");
    if (volume > 0.5) {
        icon.className = "fa-solid fa-volume-high";
    } else if (volume > 0) {
        icon.className = "fa-solid fa-volume-low";
    } else {
        icon.className = "fa-solid fa-volume-xmark";
    }
}

main();