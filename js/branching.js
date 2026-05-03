'use strict';

//DOM
// Navigations bars - Henter referencer til relevante elementer i DOM'en
const bars = document.querySelector("#bars");
const icon = document.querySelector("#bars > i");
const nav = document.querySelector("#menu");
const navLinks = nav.querySelectorAll("li > a");

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

//addEventListener
//Bars
bars.addEventListener("click", openNav);

document.addEventListener("keydown", trapFocus);