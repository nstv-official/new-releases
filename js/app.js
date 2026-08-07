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

/* =====================================================
   NSTV - DOWNLOAD VERSI TERBARU + STATISTIK
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const repoOwner = "nstv-official";
    const repoName = "new-releases";

    const oldDownloadButton = document.querySelector(".download-button");

    if (!oldDownloadButton) {
        console.warn("Tombol download lama tidak ditemukan.");
        return;
    }

    // Buat container download versi terbaru
    const latestBox = document.createElement("div");

    latestBox.id = "latest-download";
    latestBox.style.marginTop = "25px";

    oldDownloadButton.parentNode.insertBefore(
        latestBox,
        oldDownloadButton.nextSibling
    );

    // Loading
    latestBox.innerHTML = `
        <div style="
            margin-top:20px;
            padding:20px;
            border-radius:18px;
            background:#172338;
            text-align:center;
        ">
            <div style="
                font-size:15px;
                color:#cbd5e1;
            ">
                Memeriksa versi terbaru...
            </div>
        </div>
    `;

    // Ambil release terbaru dari GitHub
    fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`
    )
    .then(response => {

        if (!response.ok) {
            throw new Error("Gagal mengambil data GitHub.");
        }

        return response.json();

    })
    .then(release => {

        // Cari file APK
        const apk = release.assets.find(asset =>
            asset.name.toLowerCase().endsWith(".apk")
        );

        if (!apk) {
            throw new Error("File APK tidak ditemukan.");
        }

        // Format jumlah download
        const downloadCount = apk.download_count.toLocaleString("id-ID");

        // Nama versi
        const version = release.tag_name;

        // Link APK GitHub
        const downloadUrl = apk.browser_download_url;

        latestBox.innerHTML = `
            <div style="
                margin-top:25px;
                padding:25px 20px;
                border-radius:20px;
                background:#172338;
                border:1px solid rgba(34,197,94,.18);
                text-align:center;
            ">

                <div style="
                    display:inline-block;
                    padding:7px 15px;
                    border-radius:30px;
                    background:#1e293b;
                    color:#22c55e;
                    font-size:14px;
                    font-weight:600;
                    margin-bottom:12px;
                ">
                    ✨ VERSI TERBARU
                </div>

                <h3 style="
                    margin:5px 0 8px;
                    color:#ffffff;
                    font-size:24px;
                ">
                    NSTV ${version}
                </h3>

                <p style="
                    margin:0 0 8px;
                    color:#cbd5e1;
                    font-size:14px;
                ">
                    ${apk.name}
                </p>

                <p style="
                    margin:0 0 20px;
                    color:#22c55e;
                    font-size:15px;
                    font-weight:600;
                ">
                    📥 ${downloadCount} Downloads
                </p>

                <a
                    href="${downloadUrl}"
                    class="latest-download-button"
                    target="_blank"
                    rel="noopener"
                    style="
                        display:inline-block;
                        padding:15px 28px;
                        border-radius:12px;
                        background:#22c55e;
                        color:#ffffff;
                        text-decoration:none;
                        font-size:16px;
                        font-weight:700;
                        transition:.2s;
                    "
                >
                    ↓ DOWNLOAD ${version}
                </a>

            </div>
        `;

    })
    .catch(error => {

        console.error("NSTV GitHub Release:", error);

        latestBox.innerHTML = `
            <div style="
                margin-top:20px;
                padding:15px;
                border-radius:15px;
                background:#172338;
                color:#94a3b8;
                text-align:center;
                font-size:14px;
            ">
                Versi terbaru belum dapat dimuat.
            </div>
        `;

    });

});
