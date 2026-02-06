lucide.createIcons();

// --- 1. VIDEO HANDLING ---
const video = document.getElementById('intro-video');
const splash = document.getElementById('splash-screen');
const main = document.getElementById('onboarding');

video.onended = function() {
    startOnboarding();
};

// Fallback, falls Video nicht lädt oder User klickt
splash.addEventListener('click', () => {
    video.pause();
    startOnboarding();
});

function startOnboarding() {
    splash.style.opacity = '0';
    setTimeout(() => {
        splash.style.display = 'none';
        main.classList.remove('hidden');
    }, 500); // Warte auf Fade-Out
}

// --- 2. DATA STORAGE ---
let userData = {
    name: '',
    birthdate: '',
    focus: []
};

// --- 3. SLIDE NAVIGATION ---
const slides = document.querySelectorAll('.slide');

function nextSlide(currentIndex) {
    // Aktuellen Slide ausblenden
    slides[currentIndex].style.opacity = '0';
    slides[currentIndex].classList.remove('active');

    // Nächsten Slide einblenden (mit kurzer Verzögerung für Smoothness)
    setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (slides[nextIndex]) {
            slides[nextIndex].classList.add('active');
            slides[nextIndex].style.opacity = '1';
        }
    }, 400);
}

// Slide 2: Name speichern
function saveNameAndNext() {
    const input = document.getElementById('input-name');
    if(input.value.trim() === '') return; // Validierung
    
    userData.name = input.value;
    console.log("Name saved:", userData.name);
    nextSlide(1); // Index von Slide Name ist 1
}

// Slide 3: Datum & Calculation
function saveDateAndNext() {
    const input = document.getElementById('input-date');
    if(!input.value) return;

    userData.birthdate = input.value;
    
    // Kleines Extra: Berechnung
    const birth = new Date(input.value);
    const now = new Date();
    const diff = now - birth;
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    document.getElementById('life-stats').innerText = `${years} Years Active`;
    
    setTimeout(() => nextSlide(2), 500);
}

// Slide 4: Toggle Selection
function toggleSelect(el, area) {
    el.classList.toggle('selected');
    if (userData.focus.includes(area)) {
        userData.focus = userData.focus.filter(x => x !== area);
    } else {
        userData.focus.push(area);
    }
}

// --- 4. HOLD TO COMMIT LOGIC ---
const holdBtn = document.getElementById('commit-btn');
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let holdTimer;
let progress = 0;
const holdDuration = 2000; // 2 Sekunden halten
const step = 20; // Update Intervall in ms

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function startHold(e) {
    e.preventDefault(); // Verhindert Scrollen/Kontextmenü am Handy
    holdBtn.style.transform = "scale(0.9)";
    
    holdTimer = setInterval(() => {
        progress += (step / holdDuration) * 100;
        setProgress(progress);

        // Handy vibrieren lassen (Haptic Feedback)
        if (navigator.vibrate) navigator.vibrate(20);

        if (progress >= 100) {
            completeCommitment();
        }
    }, step);
}

function endHold() {
    clearInterval(holdTimer);
    holdBtn.style.transform = "scale(1)";
    progress = 0;
    setProgress(0); // Reset wenn losgelassen
}

function completeCommitment() {
    clearInterval(holdTimer);
    // Success Feedback
    holdBtn.style.background = "white";
    holdBtn.style.color = "black";
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Starkes Vibrieren
    
    // Daten speichern (LocalStorage vorerst)
    localStorage.setItem('elevate_user', JSON.stringify(userData));
    
    setTimeout(() => {
        alert("SYSTEM INITIALIZED. Welcome " + userData.name);
        // Hier würde man zum Dashboard weiterleiten
        // window.location.href = 'dashboard.html';
    }, 500);
}

// Event Listeners für Maus und Touch
holdBtn.addEventListener('mousedown', startHold);
holdBtn.addEventListener('mouseup', endHold);
holdBtn.addEventListener('mouseleave', endHold);

holdBtn.addEventListener('touchstart', startHold);
holdBtn.addEventListener('touchend', endHold);
