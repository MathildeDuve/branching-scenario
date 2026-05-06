'use strict';

//DOM
// Navigations bars - Henter referencer til relevante elementer i DOM'en
const bars = document.querySelector("#bars");
const icon = document.querySelector("#bars > i");
const nav = document.querySelector("#menu");
const navLinks = nav.querySelectorAll("li > a");

//Branching scenario - Henter referencer til relevante elementer i DOM'en
const btns = document.querySelectorAll(".stage .btn");
const stage = document.querySelectorAll(".stage");
const main = document.querySelector("main");

//Funktioner
// Funktion til at fange tastatur-fokus og styre navigation med Tab, Shift+Tab og Escape
const trapFocus = (e) => {
    if (!nav.classList.contains("show")) return;

    const first = bars;
    const last = navLinks[navLinks.length - 1];

    if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); // Forhindrer standard Tab-rotation
            last.focus();       // Gør loopet komplet baglæns
        }

        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
    
     window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" || e.key === "Esc") {
        nav.classList.remove("show");// Fjern 'show' → skjul menu

        icon.classList.add("fa-bars");// Skift ikon tilbage til hamburger
        icon.classList.remove("fa-xmark");

        bars.setAttribute("aria-expanded", "false");// Opdater ARIA-attribut: menuen er nu lukket
        bars.setAttribute("aria-label", "åben navigation"); // Opdater label for skærmlæsere
        bars.focus(); // Sæt fokus tilbage på knappen
    }
})};

// Funktion der åbner/lukker navigationen ved klik på bars-knappen
const openNav = () => {
    nav.classList.toggle("show"); 

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");

    const expanded = bars.getAttribute("aria-expanded") === "true";
    bars.setAttribute("aria-expanded", expanded ? "false" : "true");

    const label = bars.getAttribute("aria-label") === "åben navigation";
    bars.setAttribute("aria-label", label ? "luk navigation" : "åben navigation");
};

// Funktion der opdaterer UI i branching scenariet
const startGame = () => {
    buildStage(
        "Du vil logge på offentligt internet",
        "",
        [{name:"Start", type:"safe"}]
    );
};
const endGame = (score) => {
    let text = "";
    let type = "";
    if (score <= 30) {
        text = "❌ Du blev hacket!";
        type = "danger";
    } 
    else if (score <= 70) {
        text = "⚠️ Du tog nogle risici";
        type = "neutral";
    } 
    else {
        text = "✅ Du klarede det perfekt!";
        type = "safe";
    }
    buildStage(
        text,"Din score er " + score + "%",
        [{name:"Start Over", type: type}]
    );
};

const buildStage = (h2Text, pText, btnsText,) => {
    console.log(document.querySelectorAll(".stage").length);
    main.innerHTML = "";
    const section = document.createElement("section");
        section.classList.add("stage");
    const h2 = document.createElement("h2");
        h2.textContent = h2Text;
    const p = document.createElement("p");
        p.textContent = pText;
    section.append(h2, p);
    btnsText.forEach(btn => {
        const button = document.createElement("button");
            button.classList.add("btn", btn.type);
            button.dataset.choice = btn.name;
        const leftWrap = document.createElement("div");
            leftWrap.classList.add("left");
        if (btn.icon) {
            const img = document.createElement("img");
            img.src = btn.icon;
            img.classList.add("icon");
            leftWrap.append(img);
        }
        const name = document.createElement("span");
            name.textContent = btn.name;
        leftWrap.append(name);
        const status = document.createElement("span");
            status.textContent = btn.status;
            status.classList.add("status");
        button.append(leftWrap, status);
        button.addEventListener("click", nextStage);
        section.append(button);
    });
    main.append(section);
};

//Function der afgør hvad der skal ske i branching scenariet
const nextStage = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const choice = btn.dataset.choice;
    if (!choice) return;
    console.log("CHOICE:", choice);
    let h2Text = "";
    let pText = "";
    let btnsText = [];

    switch(choice) {
        case "Start":
            h2Text = "Du sidder på en café";
            pText = "Du skal lave en opgave og finder følgende Wi-Fi netværker.";
            btnsText = [
                {name:"Free_Cafe_WiFi", status:"Gratis", type:"danger", icon:"img/wifi.png"},
                {name:"CafeSecure", status:"Sikkert", type:"safe", icon:"img/lock.png"},
                {name:"Mobil Data", status:"Sikkert", type:"neutral", icon:"img/signal.png"}
            ];
        break;
        case "Free_Cafe_WiFi":
            h2Text = "Du er nu på et åbent internet";
            pText = "Du får et popup vindue: 'Login for at få adgang'";
            btnsText = [
                {name:"Indtast login oplysninger", type:"danger"},
                {name:"Ignorer og fortsæt", type:"safe"}
            ];
        break;
        case "CafeSecure":
            h2Text = "Du er på et password-beskyttet netværk";
            btnsText = [
                {name:"Login med din skolekonto", type:"danger"},
                {name:"Tjek sikkerhed først", type:"safe"}
            ];
        break;
        case "Mobil Data":
            h2Text = "Du bruger din egen forbindelse";
            btnsText = [
                {name:"Login på bank", type:"danger"},
                {name:"Vent med følsomme ting", type:"safe"}
            ];
        break;
        case "Indtast login oplysninger":
            h2Text = "⚠️ Dine oplysninger blev stjålet!";
            pText = "Du loggede ind på en falsk side";
            return endGame(20);
        case "Ignorer og fortsæt":
            h2Text = "⚠️ Din trafik kan overvåges!";
            btnsText = [
                {name:"Panik!", type:"danger"}
            ];
        break;
        case "Login med din skolekonto":
            h2Text = "⚠️ Siden var ikke sikker (http)";
            btnsText = [
                {name:"Fuck!", type:"danger"}
            ];
        break;
        case "Tjek sikkerhed først":
        case "Vent med følsomme ting":
        case "Login på bank":
            h2Text = "✅ Godt valg!";
            btnsText = [
                {name:"Godt Gået!", type:"safe"}
            ];
        break;
        case "Panik!":
            h2Text = "⚠️ Hacker opsnapper dine data!";
            btnsText = [
                {name:"Fortsæt uden", type:"danger"},
                {name:"Brug en VPN", type:"safe"}
            ];
        break;
        case "Fuck!":
            h2Text = "⚠️ Du kunne være blevet hacket!";
            btnsText = [
                {name:"Ignorer", type:"danger"},
                {name:"Log ud", type:"safe"}
            ];
        break;
        case "Godt Gået!":
            h2Text = "✅ Du har taget gode valg!";
            btnsText = [
                {name:"Fortsæt sikkert", type:"safe"}
            ];
        break;
        case "Fortsæt uden":
            return endGame(20);
        case "Brug en VPN":
        case "Ignorer":
        case "Log ud":
            return endGame(60);
        case "Fortsæt sikkert":
            return endGame(100);
        case "Start Over":
            return startGame();
        default:console.log("Error:", choice);
        return;
    }
    buildStage(h2Text, pText, btnsText);
};

//addEventListener
//Bars
bars.addEventListener("click", openNav);

document.addEventListener("keydown", trapFocus);

//Branching scenario
document.addEventListener("DOMContentLoaded", startGame);