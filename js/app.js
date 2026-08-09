/*
========================================
NSTV OFFICIAL WEBSITE
app.js
========================================
*/

const sourceUpdateUrl =
    "https://raw.githubusercontent.com/nstv-official/nstv/main/update_apk.json";

const sourceReleasesApi =
    "https://api.github.com/repos/nstv-official/nstv/contents/releases";

document.addEventListener("DOMContentLoaded", () => {
    console.log("NSTV Website Loaded");

    loadLatestRelease();
    initSlider();
    initScrollAnimation();
});

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

            const versionElement = document.getElementById("app-version");
            const latestVersion = document.getElementById("latest-version");

            if (versionElement) {
                versionElement.textContent = version;
            }

            if (latestVersion) {
                latestVersion.textContent = version;
            }

            const notesElement = document.getElementById("release-notes");
            const notesText = document.getElementById("release-notes-text");

            if (notesElement && notesText && releaseNotes) {
                notesText.textContent = releaseNotes;
                notesElement.hidden = false;
            }

            const latestLinks = document.querySelectorAll("[data-latest-download]");

            latestLinks.forEach(link => {
                link.href = downloadUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.title = `Download NSTV v${version}`;
                link.innerHTML = `⬇ Download NSTV v${version}`;
            });

            loadApkSize(downloadUrl);

            console.log(`NSTV v${version} berhasil dimuat dari source of truth.`);
        })
        .catch(error => {
            console.error("Error mengambil data update NSTV:", error);

            const versionElement = document.getElementById("app-version");
            const latestVersion = document.getElementById("latest-version");
            const sizeElement = document.getElementById("latest-size");

            if (versionElement) versionElement.textContent = "Tidak tersedia";
            if (latestVersion) latestVersion.textContent = "-";
            if (sizeElement) sizeElement.textContent = "Tidak tersedia";
        });
}

// ======================================
// AMBIL UKURAN APK DARI FOLDER RELEASES
// ======================================

function loadApkSize(downloadUrl) {
    const sizeElement = document.getElementById("latest-size");

    if (!sizeElement) return;

    try {
        const url = new URL(downloadUrl);
        const fileName = decodeURIComponent(url.pathname.split("/").pop());

        if (!fileName) {
            throw new Error("Nama file APK tidak ditemukan.");
        }

        fetch(`${sourceReleasesApi}?t=${Date.now()}`, {
            cache: "no-store",
            headers: {
                "Accept": "application/vnd.github+json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`GitHub API gagal (${response.status}).`);
                }
                return response.json();
            })
            .then(files => {
                const apk = files.find(file => file.name === fileName);

                if (!apk || typeof apk.size !== "number") {
                    throw new Error("Metadata ukuran APK tidak ditemukan.");
                }

                sizeElement.textContent = formatFileSize(apk.size);
                console.log(`Ukuran ${fileName}: ${apk.size} bytes`);
            })
            .catch(error => {
                console.error("Gagal mengambil ukuran APK:", error);
                sizeElement.textContent = "-";
            });
    } catch (error) {
        console.error("URL APK tidak valid:", error);
        sizeElement.textContent = "-";
    }
}

function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "0 MB";
    }

    const mb = bytes / (1024 * 1024);

    if (mb < 1) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${mb.toFixed(1)} MB`;
}

// ======================================
// SLIDER SCREENSHOT
// ======================================

function initSlider() {
    const slides = document.querySelectorAll(".slide");

    if (!slides.length) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        slides[index].classList.add("active");
    }

    showSlide(currentSlide);

    const nextButton = document.querySelector(".next");
    if (nextButton) {
        nextButton.addEventListener("click", () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
    }

    const prevButton = document.querySelector(".prev");
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
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

    if (!items.length) return;

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
// SMOOTH SCROLL
// ======================================

document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) return;

    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {
        event.preventDefault();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});
