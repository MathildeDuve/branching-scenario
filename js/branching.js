'use script';

// Navigation bars - henter referencer til relevante elementer i DOM'en
const bars = document.querySelector("#bars");
const icon = document.querySelector("#bars < i");
const nav = document.querySelector("#menu");
const navLinks = nav.querySelectorAll("li > a");

// Funktioner
// Funktion til at fange tastatur-fokus og styre navigation med Tab, Shift+Tab og Escape
const trapFocus = (e) => {
    if (!nav.classList.contains("show")) return;
}