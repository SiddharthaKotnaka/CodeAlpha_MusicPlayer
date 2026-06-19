/**
 * Crazy Sidd's Music Player
 * Main Application Logic & View Routing Architecture
 */

const searchedImage = "https://images.unsplash.com/photo-1633933703119-5d25460ad829?auto=format&fit=crop&w=1200&q=82";

// Track Manifest Database
const tracks = [
    {
        id: "afterglow",
        title: "Afterglow",
        artist: "Lunara",
        album: "Fading Light",
        year: 2026,
        genre: "Electronic",
        duration: 228,
        art: "assets/afterglow.png",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        desc: "A slow-burning electronic reverie, built from glassy synths, distant percussion and the warm pulse that remains when the night starts to fade."
    },
    {
        id: "neon-drift",
        title: "Neon Drift",
        artist: "Sidd",
        album: "Night Signal",
        year: 2026,
        genre: "Synthwave",
        duration: 262,
        art: searchedImage,
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        desc: "A late-night glide through saturated streets, taut drums and luminous chords."
    },
    {
        id: "velvet-sky",
        title: "Velvet Sky",
        artist: "Mira Vale",
        album: "Soft Focus",
        year: 2025,
        genre: "Dream Pop",
        duration: 214,
        art: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=82",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        desc: "Dream-pop weightlessness with a soft vocal haze and a midnight-blue heart."
    },
    {
        id: "parallel-lines",
        title: "Parallel Lines",
        artist: "North Arcade",
        album: "Vector",
        year: 2025,
        genre: "Indie Electronic",
        duration: 196,
        art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=82",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        desc: "Clean guitars and restless circuitry moving side by side, never quite touching."
    },
    {
        id: "moonwater",
        title: "Moonwater",
        artist: "Eira",
        album: "Still Tides",
        year: 2026,
        genre: "Ambient",
        duration: 289,
        art: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        desc: "An ambient wash of slow piano, breath and silver-blue space."
    },
    {
        id: "signal-bloom",
        title: "Signal Bloom",
        artist: "Arc Static",
        album: "Open Circuit",
        year: 2024,
        genre: "Alternative",
        duration: 241,
        art: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=82",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        desc: "A bright collision of distorted bass, fractured rhythm and melodic release."
    },
    {
        id: "slow-motion",
        title: "Slow Motion",
        artist: "Kei Rose",
        album: "Silver Hours",
        year: 2025,
        genre: "R&B",
        duration: 205,
        art: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=82",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        desc: "Minimal nocturnal R&B with close vocals and room for every note to linger."
    },
    {
        id: "quiet-geometry",
        title: "Quiet Geometry",
        artist: "Aster House",
        album: "Rooms",
        year: 2024,
        genre: "Modern Classical",
        duration: 233,
        art: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=900&q=82",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        desc: "Piano, cello and subtle tape noise arranged in patient, architectural forms."
    }
];

// Global Reactive Core State Management
const state = {
    route: "home",
    current: 0,
    playing: false,
    shuffle: false,
    repeat: false,
    favs: new Set(JSON.parse(localStorage.getItem("cs-favs") || '["afterglow","moonwater"]')),
    recent: JSON.parse(localStorage.getItem("cs-recent") || '["afterglow","neon-drift","velvet-sky","parallel-lines"]')
};

// Selection Query Helpers
const $ = selector => document.querySelector(selector);
const main = $("#main");
const audio = $("#audio");
const progress = $("#progress");
const volume = $("#volume");
const queue = $("#queue");
const sidebar = $("#sidebar");
const scrim = $("#scrim");
let toastTimer;

// Time Formatting calculations (Converts Seconds into M:SS strings)
const fmt = totalSeconds => {
    const minutes = Math.floor((totalSeconds || 0) / 60);
    const seconds = String(Math.floor((totalSeconds || 0) % 60)).padStart(2, "0");
    return `${minutes}:${seconds}`;
};

// Find Target Track By Unique String ID
const byId = id => tracks.find(track => track.id === id);

// Trigger Icon Engine Refreshing Layer
const icons = () => {
    if (window.lucide) {
        lucide.createIcons({
            attrs: { "stroke-width": 1.8 }
        });
    }
};

/* ==========================================================================
   Component Templates (HTML Template String Generators)
   ========================================================================== */

// Card Dashboard Element Grid Item
const card = track => {
    return `
        <button class="card" data-open="${track.id}" aria-label="Open ${track.title} by ${track.artist}">
            <span class="art">
                <img src="${track.art}" alt="${track.title} artwork" loading="lazy">
                <span class="cardplay" data-play="${track.id}">
                    <i data-lucide="play"></i>
                </span>
            </span>
            <h3>${track.title}</h3>
            <p>${track.artist}</p>
        </button>
    `;
};

// Inline Track Row Data Layer Listing
const rows = list => {
    const activeTrackId = tracks[state.current].id;
    return `
        <div class="tracks">
            ${list.map(track => `
                <div class="track ${activeTrackId === track.id ? "current" : ""}" data-open="${track.id}">
                    <img src="${track.art}" alt="" loading="lazy">
                    <span class="meta">
                        <strong>${track.title}</strong>
                        <small>${track.artist}</small>
                    </span>
                    <span class="album">${track.album}</span>
                    <button class="heart ${state.favs.has(track.id) ? "liked" : ""}" data-fav="${track.id}" title="Favourite" aria-label="Favourite ${track.title}">
                        <i data-lucide="heart"></i>
                    </button>
                    <span class="time">${fmt(track.duration)}</span>
                </div>
            `).join("")}
        </div>
    `;
};

// Wrapper Module Segments Block
const section = (title, list, route) => {
    const seeAllBtn = route ? `<button data-route="${route}">See all</button>` : "";
    const internalContent = Array.isArray(list) ? `<div class="grid">${list.map(card).join("")}</div>` : list;
    
    return `
        <section class="section">
            <div class="sectionhead">
                <h2>${title}</h2>
                ${seeAllBtn}
            </div>
            ${internalContent}
        </section>
    `;
};

/* ==========================================================================
   Page Route View Injections
   ========================================================================== */

function home() {
    return `
        <div class="wrap">
            <section class="hero">
                <div>
                    <p class="eyebrow">Curated for deep listening</p>
                    <h1>Feel every <span>frequency.</span></h1>
                    <p>A focused home for the music you love—beautifully organized, effortlessly played, and always one tap away.</p>
                    <div class="buttons">
                        <button class="primary" data-play="afterglow">
                            <i data-lucide="play"></i>Play Afterglow
                        </button>
                        <button class="secondary" data-route="browse">
                            <i data-lucide="layout-grid"></i>Explore music
                        </button>
                    </div>
                </div>
                <div class="heroart">
                    <img src="assets/afterglow.png" alt="Abstract luminous glass orb album artwork">
                </div>
            </section>
            
            ${section("Recently Played", state.recent.slice(0, 5).map(byId), "recent")}
            ${section("Favourites", [...state.favs].slice(0, 5).map(byId), "favorites")}
            ${section("Made for Sidd", rows(tracks.slice(2, 7)))}
        </div>
    `;
}

function library(title, desc, list) {
    const playAllBtn = list.length ? `<button class="primary" data-play="${list[0].id}"><i data-lucide="play"></i>Play all</button>` : "";
    const mainViewContent = list.length ? `<div class="grid">${list.map(card).join("")}</div>${section("All tracks", rows(list))}` : empty("Nothing here yet", "Tap the heart beside a track and it will appear here.");
    
    return `
        <div class="wrap">
            <header class="pagehead">
                <div>
                    <p class="eyebrow">Your Library</p>
                    <h1>${title}</h1>
                </div>
                ${playAllBtn}
            </header>
            <p class="intro">${desc}</p>
            ${mainViewContent}
        </div>
    `;
}

function browse() {
    return `
        <div class="wrap">
            <header class="pagehead">
                <div>
                    <p class="eyebrow">New sounds, no noise</p>
                    <h1>Browse</h1>
                </div>
                <button class="primary" data-shuffle>
                    <i data-lucide="shuffle"></i>Shuffle all
                </button>
            </header>
            <p class="intro">A hand-picked mix of late-night electronics, quiet pop, ambient textures and modern soul.</p>
            <div class="grid">${tracks.map(card).join("")}</div>
            ${section("All tracks", rows(tracks))}
        </div>
    `;
}

function radio() {
    let stationsList = [
        ["Night Signal", "Electronic · Live", searchedImage, "neon-drift"],
        ["Soft Focus", "Dream Pop · Curated", tracks[2].art, "velvet-sky"],
        ["Still Tides", "Ambient · Nonstop", tracks[4].art, "moonwater"]
    ];
    
    return `
        <div class="wrap">
            <header class="pagehead">
                <div>
                    <p class="eyebrow">Always on</p>
                    <h1>Radio</h1>
                </div>
            </header>
            <p class="intro">Three focused stations, tuned for making, moving and switching off.</p>
            <div class="stations">
                ${stationsList.map(stationItem => `
                    <button class="station" data-play="${stationItem[3]}" style="background-image:url('${stationItem[2]}')">
                        <p>${stationItem[1]}</p>
                        <h3>${stationItem[0]}</h3>
                    </button>
                `).join("")}
            </div>
            ${section("Featured on radio", rows([tracks[1], tracks[2], tracks[4], tracks[5]]))}
        </div>
    `;
}

function detail(trackInstance) {
    return `
        <div class="wrap">
            <button class="secondary" data-route="home">
                <i data-lucide="arrow-left"></i>Back
            </button>
            <section class="detailhero">
                <img class="detailart" src="${trackInstance.art}" alt="${trackInstance.title} artwork">
                <div class="detail">
                    <p class="eyebrow">Single</p>
                    <h1>${trackInstance.title}</h1>
                    <p class="artist">${trackInstance.artist}</p>
                    <p class="facts">${trackInstance.album} · ${trackInstance.year} · ${trackInstance.genre} · ${fmt(trackInstance.duration)}</p>
                    <div class="buttons">
                        <button class="primary" data-play="${trackInstance.id}">
                            <i data-lucide="play"></i>Play
                        </button>
                        <button class="secondary ${state.favs.has(trackInstance.id) ? "isactive" : ""}" data-fav="${trackInstance.id}">
                            <i data-lucide="heart"></i>${state.favs.has(trackInstance.id) ? "Favourited" : "Favourite"}
                        </button>
                        <button class="icon" data-toast="Added to your queue" title="Add to queue">
                            <i data-lucide="list-plus"></i>
                        </button>
                        <button class="icon" data-toast="Link copied" title="Share">
                            <i data-lucide="share-2"></i>
                        </button>
                    </div>
                    <p class="description">${trackInstance.desc}</p>
                </div>
            </section>
            ${section("More like this", tracks.filter(x => x.id !== trackInstance.id).slice(0, 5))}
        </div>
    `;
}

const empty = (title, copy) => {
    return `
        <div class="empty">
            <div>
                <i data-lucide="music-2"></i>
                <br>
                <strong>${title}</strong>
                <p>${copy}</p>
            </div>
        </div>
    `;
};

function searchPage(queryText) {
    let matches = tracks.filter(t => `${t.title} ${t.artist} ${t.album} ${t.genre}`.toLowerCase().includes(queryText.toLowerCase()));
    const resultCountString = `${matches.length} ${matches.length === 1 ? "track" : "tracks"} found.`;
    
    return `
        <div class="wrap">
            <header class="pagehead">
                <div>
                    <p class="eyebrow">Search results</p>
                    <h1>“${queryText}”</h1>
                </div>
            </header>
            <p class="intro">${resultCountString}</p>
            ${matches.length ? `<div class="grid">${matches.map(card).join("")}</div>${section("Matches", rows(matches))}` : empty("No matches", "Try a title, artist, album or genre.")}
        </div>
    `;
}

/* ==========================================================================
   Core Application Operations
   ========================================================================== */

// Client-Side Template Router Engine
function render(route = state.route, payload) {
    state.route = route;
    
    if (route === "track") {
        main.innerHTML = detail(byId(payload));
    } else if (route === "browse") {
        main.innerHTML = browse();
    } else if (route === "radio") {
        main.innerHTML = radio();
    } else if (route === "favorites") {
        main.innerHTML = library("Favourites", "The songs you never want to lose.", [...state.favs].map(byId));
    } else if (route === "recent") {
        main.innerHTML = library("Recently Played", "Pick up exactly where the mood left you.", state.recent.map(byId));
    } else if (route === "search") {
        main.innerHTML = searchPage(payload);
    } else {
        main.innerHTML = home();
    }
    
    // Toggle active link visual elements states
    document.querySelectorAll("[data-route]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.route === route);
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    icons();
}

// Storage Commit Operations
function save() {
    localStorage.setItem("cs-favs", JSON.stringify([...state.favs]));
    localStorage.setItem("cs-recent", JSON.stringify(state.recent));
}

// Global Message Alert Center Toast Management
function toast(messageText) {
    const toastElement = $("#toast");
    toastElement.textContent = messageText;
    toastElement.classList.add("show");
    
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastElement.classList.remove("show");
    }, 1800);
}

// Global Dynamic Hardware Audio Source Sync Channel
function setTrack(id, autoPlayFlag = true) {
    let indexFound = tracks.findIndex(track => track.id === id);
    if (indexFound < 0) return;
    
    state.current = indexFound;
    let selectedTrack = tracks[indexFound];
    
    audio.src = selectedTrack.audio;
    $("#pArt").src = selectedTrack.art;
    $("#pTitle").textContent = selectedTrack.title;
    $("#pArtist").textContent = selectedTrack.artist;
    $("#duration").textContent = fmt(selectedTrack.duration);
    
    $("#favCurrent").classList.toggle("on", state.favs.has(id));
    $("#openCurrent").dataset.open = id;
    
    // Manage dynamic update history listing tracks
    state.recent = [id, ...state.recent.filter(trackId => trackId !== id)].slice(0, 8);
    
    save();
    renderQueue();
    
    if (autoPlayFlag) {
        playAudio();
    }
}

// Hardware Streaming Promise Execution Engine
async function playAudio() {
    try {
        await audio.play();
        state.playing = true;
        updatePlayStateUI();
    } catch (err) {
        state.playing = false;
        updatePlayStateUI();
        toast("Tap play once more to start audio");
    }
}

function pause() {
    audio.pause();
    state.playing = false;
    updatePlayStateUI();
}

// Update Active Playback Button Layout Elements
function updatePlayStateUI() {
    const playButtonElement = $("#play");
    playButtonElement.innerHTML = `<i data-lucide="${state.playing ? "pause" : "play"}"></i>`;
    playButtonElement.title = state.playing ? "Pause" : "Play";
    icons();
}

// Tracking Vector Skips Controls (Forward/Backward Channels)
function next(direction = 1) {
    let targetIndex;
    
    if (state.shuffle) {
        do {
            targetIndex = Math.floor(Math.random() * tracks.length);
        } while (targetIndex === state.current && tracks.length > 1);
    } else {
        targetIndex = (state.current + direction + tracks.length) % tracks.length;
    }
    
    setTrack(tracks[targetIndex].id);
}

// User Profile Liked Track State Modification Handlers
function fav(id) {
    if (state.favs.has(id)) {
        state.favs.delete(id);
        toast("Removed from favourites");
    } else {
        state.favs.add(id);
        toast("Added to favourites");
    }
    
    save();
    $("#favCurrent").classList.toggle("on", state.favs.has(tracks[state.current].id));
    
    if (["favorites", "home"].includes(state.route)) {
        render(state.route);
    } else if (state.route === "track") {
        render("track", id);
    }
}

// Queue Canvas View Sync Engine
function renderQueue() {
    $("#queueList").innerHTML = tracks.map((trackItem, index) => `
        <button class="qitem ${index === state.current ? "active" : ""}" data-play="${trackItem.id}">
            <img src="${trackItem.art}" alt="">
            <span>
                <strong>${trackItem.title}</strong>
                <small>${trackItem.artist}</small>
            </span>
            <small>${fmt(trackItem.duration)}</small>
        </button>
    `).join("");
}

// Close Drawers Windows Utilities
function closeAllDrawers() {
    queue.classList.remove("open");
    sidebar.classList.remove("open");
    scrim.classList.remove("open");
}

/* ==========================================================================
   Event Binding & System Hook Channels
   ========================================================================== */

// Event Delegation Architecture Click Channel Interceptor
document.addEventListener("click", e => {
    let routeBtn = e.target.closest("[data-route]");
    if (routeBtn) {
        render(routeBtn.dataset.route);
        closeAllDrawers();
        return;
    }
    
    let playBtn = e.target.closest("[data-play]");
    if (playBtn) {
        e.preventDefault();
        e.stopPropagation();
        setTrack(playBtn.dataset.play);
        closeAllDrawers();
        return;
    }
    
    let openBtn = e.target.closest("[data-open]");
    if (openBtn) {
        render("track", openBtn.dataset.open);
        return;
    }
    
    let favBtn = e.target.closest("[data-fav]");
    if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        fav(favBtn.dataset.fav);
        return;
    }
    
    let toastBtn = e.target.closest("[data-toast]");
    if (toastBtn) {
        toast(toastBtn.dataset.toast);
    }
    
    if (e.target.closest("[data-shuffle]")) {
        state.shuffle = true;
        $("#shuffle").classList.add("on");
        next();
    }
});

// Primary Deck Interface Event Channels Hooks
$("#play").onclick = () => {
    if (!audio.src) {
        setTrack(tracks[state.current].id);
    } else if (state.playing) {
        pause();
    } else {
        playAudio();
    }
};

$("#next").onclick = () => next();

$("#prev").onclick = () => {
    if (audio.currentTime > 4) {
        audio.currentTime = 0;
    } else {
        next(-1);
    }
};

$("#shuffle").onclick = e => {
    state.shuffle = !state.shuffle;
    e.currentTarget.classList.toggle("on", state.shuffle);
    toast(`Shuffle ${state.shuffle ? "on" : "off"}`);
};

$("#repeat").onclick = e => {
    state.repeat = !state.repeat;
    audio.loop = state.repeat;
    e.currentTarget.classList.toggle("on", state.repeat);
    toast(`Repeat ${state.repeat ? "on" : "off"}`);
};

$("#favCurrent").onclick = () => fav(tracks[state.current].id);

$("#queueBtn").onclick = () => {
    queue.classList.add("open");
    scrim.classList.add("open");
};

$("#closeQueue").onclick = closeAllDrawers;

$("#menu").onclick = () => {
    sidebar.classList.add("open");
    scrim.classList.add("open");
};

$("#closeMenu").onclick = closeAllDrawers;
scrim.onclick = closeAllDrawers;

// Mobile Search Panel Navigation Logic
$(".avatar").onclick = () => {
    if (window.innerWidth <= 580) {
        $(".search").classList.toggle("open");
    } else {
        toast("Profile synced locally");
    }
};

// Live Dynamic Search Input Filtering Pipeline
$("#search").oninput = e => {
    let queryValue = e.target.value.trim();
    if (queryValue) {
        render("search", queryValue);
    } else {
        render("home");
    }
};

// Global Accessibility Interface Keyboard Shortcut Channels
document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        $(".search").classList.add("open");
        $("#search").focus();
    }
    
    if (e.code === "Space" && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        if (state.playing) {
            pause();
        } else {
            playAudio();
        }
    }
    
    if (e.key === "Escape") {
        closeAllDrawers();
    }
});

/* ==========================================================================
   Hardware Audio Interface Pipeline Engine Hooks
   ========================================================================== */

audio.ontimeupdate = () => {
    let trackDuration = audio.duration || tracks[state.current].duration;
    let timelinePercentage = trackDuration ? (audio.currentTime / trackDuration) * 100 : 0;
    
    progress.value = timelinePercentage;
    progress.style.setProperty("--progress", `${timelinePercentage}%`);
    
    $("#current").textContent = fmt(audio.currentTime);
    $("#duration").textContent = fmt(trackDuration);
};

audio.onended = () => {
    if (!state.repeat) {
        next();
    }
};

audio.onplay = () => {
    state.playing = true;
    updatePlayStateUI();
};

audio.onpause = () => {
    state.playing = false;
    updatePlayStateUI();
};

progress.oninput = e => {
    let currentTrackDuration = audio.duration || tracks[state.current].duration;
    audio.currentTime = (Number(e.target.value) / 100) * currentTrackDuration;
};

volume.oninput = e => {
    audio.volume = Number(e.target.value) / 100;
    e.target.style.setProperty("--progress", `${e.target.value}%`);
};

// Core Execution Application Start Intercepts
audio.volume = 0.72;
setTrack("afterglow", false);
render("home");
renderQueue();
icons();
