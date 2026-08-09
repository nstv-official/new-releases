/*
========================================
NSTV OFFICIAL WEBSITE
app.js
========================================
*/

// ======================================
// SUMBER UTAMA NSTV
// ======================================

const sourceUpdateUrl =
    "https://raw.githubusercontent.com/nstv-official/nstv/main/update_apk.json";

const sourceRepoApi =
    "https://api.github.com/repos/nstv-official/nstv/contents/";


// ======================================
// SAAT HALAMAN SELESAI DIMUAT
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("NSTV Website Loaded");

    loadLatestRelease();
    initSlider();
    initScrollAnimation();

});


// ======================================
// AMBIL INFORMASI TERBARU DARI REPO UTAMA
// ======================================

function loadLatestRelease() {

    fetch(`${sourceUpdateUrl}?t=${Date.now()}`, {
        cache: "no-store"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Gagal mengambil update_apk.json dari repo utama.");
            }

            return response.json();
        })
        .then(data => {

            console.log("Data update NSTV:", data);

            const version = String(data.latestVersionName || "").replace(/^v/i, "");
            const downloadUrl = data.updateUrl || "";
            const releaseNotes = data.releaseNotes || "";

            if (!version || !downloadUrl) {
                throw new Error("Data versi atau URL APK tidak lengkap.");
            }

            // ==================================
            // TAMPILKAN VERSI
            // ==================================

            const versionElement = document.getElementById("app-version");
            const latestVersion = document.getElementById("latest-version");

            if (versionElement) {
                versionElement.textContent = version;
            }

            if (latestVersion) {
                latestVersion.textContent = version;
            }

            // ==================================
            // TAMPILKAN RELEASE NOTES
            // ==================================

            const notesElement = document.getElementById("release-notes");
            const notesText = document.getElementById("release-notes-text");

            if (notesElement && notesText && releaseNotes) {
                notesText.textContent = releaseNotes;
                notesElement.hidden = false;
            }

            // ==================================
            // ATUR SEMUA TOMBOL DOWNLOAD
            // ==================================

            const latestLinks = document.querySelectorAll(
                "[data-latest-download]"
            );

            latestLinks.forEach(link => {
                link.href = downloadUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.title = `Download NSTV v${version}`;
                link.innerHTML = `⬇ Download NSTV v${version}`;
            });

            // ==================================
            // AMBIL UKURAN APK DARI REPO UTAMA
            // ==================================

            loadApkSize(downloadUrl);

            console.log(`NSTV v${version} berhasil dimuat dari source of truth.`);

        })
        .catch(error => {

            console.error("Error mengambil data update NSTV:", error);

            const versionElement = document.getElementById("app-version");
            const latestVersion = document.getElementById("latest-version");
            const sizeElement = document.getElementById("latest-size");

            if (versionElement) {
                versionElement.textContent = "Tidak tersedia";
            }

            if (latestVersion) {
                latestVersion.textContent = "-";
            }

            if (sizeElement) {
                sizeElement.textContent = "Tidak tersedia";
            }
        });

}


// ======================================
// AMBIL UKURAN APK DARI GITHUB
// ======================================

function loadApkSize(downloadUrl) {

    try {
        const url = new URL(downloadUrl);
        const match = url.pathname.match(/\/releases\/(.+)$/);

        if (!match) {
            throw new Error("Nama file APK tidak ditemukan dari URL.");
        }

        const apkPath = decodeURIComponent(match[0].replace(/^\//, ""));
        const apiUrl = `${sourceRepoApi}${apkPath}`;

        fetch(`${apiUrl}?t=${Date.now()}`, { cache: "no-store" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Gagal mengambil metadata APK.");
                }

                return response.json();
            })
            .then(file => {

                const sizeElement = document.getElementById("latest-size");

                if (sizeElement && typeof file.size === "number") {
                    sizeElement.textContent = formatFileSize(file.size);
                }

            })
            .catch(error => {
                console.error("Gagal mengambil ukuran APK:", error);

                const sizeElement = document.getElementById("latest-size");
                if (sizeElement) {
                    sizeElement.textContent = "-";
                }
            });

    } catch (error) {
        console.error("URL APK tidak valid:", error);

        const sizeElement = document.getElementById("latest-size");
        if (sizeElement) {
            sizeElement.textContent = "-";
        }
    }

}


// ======================================
// FORMAT UKURAN FILE
// ======================================

function formatFileSize(bytes) {

    if (!bytes || bytes <= 0) {
        return "0 MB";
    }

    const mb = bytes / (1024 * 1024);

    if (mb < 1) {
        const kb = bytes / 1024;
        return `${kb.toFixed(0)} KB`;
    }

    return `${mb.toFixed(1)} MB`;

}


// ======================================
// SLIDER SCREENSHOT
// ======================================

function initSlider() {

    const slides = document.querySelectorAll(".slide");

    if (!slides.length) {
        return;
    }

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove("active");
        });

        slides[index].classList.add("active");
    }

    showSlide(currentSlide);

    const nextButton = document.querySelector(".next");

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            currentSlide++;

            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }

            showSlide(currentSlide);
        });
    }

    const prevButton = document.querySelector(".prev");

    if (prevButton) {
        prevButton.addEventListener("click", () => {
            currentSlide--;

            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }

            showSlide(currentSlide);
        });
    }

    setInterval(() => {
        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    }, 5000);

}


// ======================================
// ANIMASI SAAT SCROLL
// ======================================

function initScrollAnimation() {

    const items = document.querySelectorAll(
        ".hero-card, .stat, .feature, .faq-item, .screens img"
    );

    if (!items.length) {
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        },
        { threshold: 0.1 }
    );

    items.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        item.style.transition = "opacity .6s ease, transform .6s ease";
        observer.observe(item);
    });

}


// ======================================
// SMOOTH SCROLL UNTUK LINK INTERNAL
// ======================================

document.addEventListener("click", event => {

    const link = event.target.closest('a[href^="#"]');

    if (!link) {
        return;
    }

    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
        return;
    }

    const target = document.querySelector(targetId);

    if (target) {
        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

});
