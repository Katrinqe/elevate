lucide.createIcons();

// --- START LOGIC ---
// Intro verschwindet automatisch per CSS nach 3.5s
// aber wir setzen einen Timer, um es komplett aus dem DOM zu nehmen
setTimeout(() => {
    document.getElementById('intro-screen').style.display = 'none';
}, 3600);

let userData = {
    name: '',
    birthdate: '',
    focus: []
};

// --- SLIDE NAVIGATION (FIXED) ---
const slides = document.querySelectorAll('.slide');

function nextSlide(currentIndex) {
    const currentSlide = slides[currentIndex];
    const nextSlide = slides[currentIndex + 1];

    if (!nextSlide) return;

    // 1. Alte Slide ausblenden
    currentSlide.style.opacity = '0';
    
    // 2. Warten (damit sie weg ist), dann Umschalten
    setTimeout(() => {
        currentSlide.classList.remove('active'); // Versteckt sie via display: none
        
        // 3. Neue Slide vorbereiten (unsichtbar aber da)
        nextSlide.classList.add('active');
        
        // Kurzer Delay damit der Browser das Rendern checkt
        setTimeout(() => {
            nextSlide.style.opacity = '1'; // Einblenden
        }, 50);

    }, 600); // Muss zur CSS Transition passen (0.6s)
}

function saveNameAndNext() {
    const input = document.getElementById('input-name');
    if(input.value.trim() === '') {
        input.style.borderBottomColor = 'red'; // Fehler Feedback
        return;
    }
    userData.name = input.value;
    document.getElementById('final-name').textContent = "Identity: " + userData.name;
    nextSlide(1); // Index 1 = Name Slide
}

function saveDateAndNext() {
    const input = document.getElementById('input-date');
    if(!input.value) return;

    userData.birthdate = input.value;
    
    // Live Berechnung anzeigen
    const birth = new Date(input.value);
    const now = new Date();
    const age = Math.floor((now - birth) / (365.25 * 24 * 60 * 60 * 1000));
    
    document.getElementById('life-stats').innerText = `${age} YEARS LOGGED`;
    document.getElementById('life-stats').style.opacity = 1;

    setTimeout(() => nextSlide(2), 800);
}

function toggleSelect(el, area) {
    el.classList.toggle('selected');
    // Logik für Array add/remove
    if (userData.focus.includes(area)) {
        userData.focus = userData.focus.filter(x => x !== area);
    } else {
        userData.focus.push(area);
    }
}

// --- HOLD BUTTON LOGIC ---
const holdBtn = document.getElementById('commit-btn');
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let holdTimer;
let progress = 0;

function startHold(e) {
    e.preventDefault();
    holdBtn.style.transform = "scale(0.9)";
    holdBtn.style.background = "#222";
    
    holdTimer = setInterval(() => {
        progress += 2; // Geschwindigkeit
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        if (navigator.vibrate) navigator.vibrate(10); // Haptic

        if (progress >= 100) {
            completeCommitment();
        }
    }, 20);
}

function endHold() {
    clearInterval(holdTimer);
    holdBtn.style.transform = "scale(1)";
    holdBtn.style.background = "#111";
    progress = 0;
    circle.style.strokeDashoffset = circumference; // Reset
}

function completeCommitment() {
    clearInterval(holdTimer);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    // Visual Success
    holdBtn.innerHTML = '<i data-lucide="check"></i>';
    holdBtn.style.background = "white";
    holdBtn.style.color = "black";
    circle.style.stroke = "white";

    // Speichern
    localStorage.setItem('elevate_user', JSON.stringify(userData));
    
    setTimeout(() => {
        alert("WELCOME TO ELEVATE.");
        // Hier Weiterleitung zum Dashboard später
    }, 500);
}

holdBtn.addEventListener('mousedown', startHold);
holdBtn.addEventListener('mouseup', endHold);
holdBtn.addEventListener('mouseleave', endHold);
holdBtn.addEventListener('touchstart', startHold);
holdBtn.addEventListener('touchend', endHold);
