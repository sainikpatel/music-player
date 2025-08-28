console.log("Script loaded successfully");

let currentSong = new Audio();
async function getSongs() {
  
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const cleanName = (name) => {
    let clean = name.replaceAll("%20", " ").replaceAll("%", "");
    // remove .mp3 extension
    clean = clean.replace(".mp3", "");
    // cut anything after "("
    if (clean.includes("(")) {
        clean = clean.split("(")[0].trim();
    }
    return clean;
};

const playMusic = (track,pause = false) => {
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/" + track;
    if(!pause) {
        currentSong.play();
        playbtn.src = "pause.svg";
    }
    currentSong.play();
    document.querySelector(".songinfo").innerHTML = cleanName(track);
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00";
    // audio.play();
}
async function main() {

    let songs = await getSongs();
    playMusic(songs[0],true) 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML += ` <li>
                        <img class="invert" src="music.svg" alt="library">
                        <div class="info">
                            <div> ${song.replaceAll("%20", " ").replaceAll("%", "").slice()}</div>
                            
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                        <img class="invert" src="play-button.svg" alt="library">
                    </div>
                    </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    playbtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playbtn.src = "pause.svg";
        } else {
            currentSong.pause();
            playbtn.src = "play-button.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        let currentTime = Math.floor(currentSong.currentTime);
        let duration = Math.floor(currentSong.duration);
        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = currentTime % 60;
        let durationMinutes = Math.floor(duration / 60);
        let durationSeconds = duration % 60;

        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }

        document.querySelector(".songtime").innerHTML = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;

        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration)
         * 100) + "%";
    })
    //add event listener for seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent) / 100;
    });

    // for hamburger menu
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="0"
    })
    //add an event listner for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="-120%"
    })
}
main()





