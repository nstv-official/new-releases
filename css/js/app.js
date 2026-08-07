/*
==========================================
NSTV Official Website
app.js
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("NSTV Website Loaded");

    // Efek muncul saat scroll
    const items = document.querySelectorAll(
        ".hero-card, .stat, .feature, .faq-item, .screens img"
    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    }, {
        threshold: 0.15
    });

    items.forEach(item => {

        item.style.opacity = "0";
        item.style.transform = "translateY(40px)";
        item.style.transition = "all .6s ease";

        observer.observe(item);

    });

    // Efek klik tombol download
    const downloadBtn = document.querySelector(".download-button");

    if (downloadBtn) {

        downloadBtn.addEventListener("click", () => {

            downloadBtn.innerHTML = "⏳ Membuka Download...";

            setTimeout(() => {

                downloadBtn.innerHTML = "⬇ DOWNLOAD APK";

            }, 2500);

        });

    }

    // Highlight menu saat scroll
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".menu a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 120;
            const height = section.offsetHeight;

            if (pageYOffset >= top) {
                current = section.getAttribute("id");
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href && href.startsWith("#") && href === "#" + current) {

                link.classList.add("active");

            }

        });

    });

    // Smooth scroll untuk menu internal
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function(e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

});

/* ===== Screenshot Slider ===== */

const slides=document.querySelectorAll(".slide");
const next=document.querySelector(".next");
const prev=document.querySelector(".prev");

if(slides.length){

let current=0;

function showSlide(index){

slides.forEach(s=>s.classList.remove("active"));

slides[index].classList.add("active");

}

next.onclick=()=>{

current++;

if(current>=slides.length) current=0;

showSlide(current);

}

prev.onclick=()=>{

current--;

if(current<0) current=slides.length-1;

showSlide(current);

}

setInterval(()=>{

current++;

if(current>=slides.length) current=0;

showSlide(current);

},3000);

}

/* ===== Hero Auto Preview ===== */

const hero=document.getElementById("hero-image");

const gallery=[
"img/screenshot1.jpg",
"img/screenshot2.jpg",
"img/screenshot3.jpg",
"img/screenshot4.jpg"
];

let i=0;

setInterval(()=>{

i++;

if(i>=gallery.length)i=0;

hero.src=gallery[i];

},3000);
