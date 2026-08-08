/*
========================================
NSTV OFFICIAL WEBSITE
app.js
========================================
*/

// ======================================
// KONFIGURASI GITHUB
// ======================================

const repoOwner = "nstv-official";
const repoName = "new-releases";


// ======================================
// SAAT HALAMAN SELESAI DIMUAT
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("NSTV Website Loaded");

    // Jalankan fungsi
    loadLatestRelease();
    initSlider();
    initScrollAnimation();

});


// ======================================
// AMBIL RELEASE TERBARU DARI GITHUB
// ======================================

function loadLatestRelease() {

    const apiUrl =
        `https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`;

    fetch(apiUrl)

        .then(response => {

            if (!response.ok) {
                throw new Error("Gagal mengambil release GitHub.");
            }

            return response.json();

        })

        .then(release => {

            console.log("Release terbaru:", release);

            // ==================================
            // AMBIL NOMOR VERSI
            // ==================================

            let version = release.tag_name || "";

            // Hilangkan "v" jika ada
            version = version.replace(/^v/i, "");

            // ==================================
            // CARI FILE APK
            // ==================================

            const apkAsset = release.assets.find(asset =>
                asset.name.toLowerCase().endsWith(".apk")
            );

            if (!apkAsset) {
                throw new Error("File APK tidak ditemukan.");
            }

            // ==================================
            // FORMAT UKURAN FILE
            // ==================================

            const fileSize = formatFileSize(apkAsset.size);


            // ==================================
            // TAMPILKAN VERSI
            // ==================================

            const versionElement =
                document.getElementById("app-version");

            if (versionElement) {

                versionElement.textContent = version;

            }


            // ==================================
            // TAMPILKAN VERSI DI BADGE
            // ==================================

            const versionBadge =
                document.querySelector(".badge");

            if (versionBadge) {

                versionBadge.textContent =
                    `Versi Terbaru ${version}`;

            }


            // ==================================
            // TAMPILKAN UKURAN APK
            // ==================================

            const sizeElements = document.querySelectorAll(
                "#latest-size, .latest-size"
            );

            sizeElements.forEach(element => {

                element.textContent = fileSize;

            });


            // ==================================
            // TOMBOL DOWNLOAD VERSI TERBARU
            // ==================================

            setupLatestDownloadButton(
                apkAsset.browser_download_url,
                version
            );


            // ==================================
            // JIKA ADA LINK DOWNLOAD OTOMATIS
            // ==================================

            const latestLinks = document.querySelectorAll(
                "[data-latest-download]"
            );

            latestLinks.forEach(link => {

                link.href = apkAsset.browser_download_url;

            });


            console.log(
                `NSTV v${version} berhasil dimuat.`
            );

        })

        .catch(error => {

            console.error(
                "Error mengambil release:",
                error
            );

            // Jangan menampilkan
            // "Memeriksa versi terbaru..."

            const versionElement =
                document.getElementById("latest-version");

            if (versionElement) {

                versionElement.textContent = "3.0.6";

            }

        });

}


// ======================================
// BUAT / ATUR TOMBOL DOWNLOAD TERBARU
// ======================================

function setupLatestDownloadButton(downloadUrl, version) {

    /*
    Mencari tombol yang sudah ada.
    Bisa menggunakan beberapa nama class
    agar tidak perlu bongkar HTML lagi.
    */

    let button =
        document.querySelector(
            "#latest-download, .latest-download, .latest-download-button"
        );


    // ==================================
    // JIKA TOMBOL BELUM ADA
    // ==================================

    if (!button) {

        const latestTitle =
            document.querySelector(".latest-release-title");

        const latestDescription =
            document.querySelector(
                ".latest-release-description"
            );


        if (latestDescription) {

            button = document.createElement("a");

            button.id = "latest-download";

            button.className =
                "download-button latest-download-button";

            button.innerHTML =
                "⬇ Download Versi Terbaru";


            /*
            Letakkan tombol setelah deskripsi
            */

            latestDescription.insertAdjacentElement(
                "afterend",
                button
            );

        }

        else if (latestTitle) {

            button = document.createElement("a");

            button.id = "latest-download";

            button.className =
                "download-button latest-download-button";

            button.innerHTML =
                "⬇ Download Versi Terbaru";


            latestTitle.insertAdjacentElement(
                "afterend",
                button
            );

        }

    }


    // ==================================
    // ATUR LINK DOWNLOAD
    // ==================================

    if (button) {

        button.href = downloadUrl;

        button.target = "_blank";

        button.rel = "noopener noreferrer";

        button.title =
            `Download NSTV v${version}`;

        button.innerHTML =
            `⬇ Download NSTV v${version}`;

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

    const slides =
        document.querySelectorAll(".slide");

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


    // Tampilkan slide pertama

    showSlide(currentSlide);


    // ==================================
    // TOMBOL NEXT
    // ==================================

    const nextButton =
        document.querySelector(".next");

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                currentSlide++;

                if (currentSlide >= slides.length) {

                    currentSlide = 0;

                }

                showSlide(currentSlide);

            }
        );

    }


    // ==================================
    // TOMBOL PREVIOUS
    // ==================================

    const prevButton =
        document.querySelector(".prev");

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            () => {

                currentSlide--;

                if (currentSlide < 0) {

                    currentSlide =
                        slides.length - 1;

                }

                showSlide(currentSlide);

            }
        );

    }


    // ==================================
    // AUTO SLIDE
    // ==================================

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

    const items =
        document.querySelectorAll(
            ".hero-card, .stat, .feature, .faq-item, .screens img"
        );


    if (!items.length) {
        return;
    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                });

            },

            {
                threshold: 0.1
            }

        );


    items.forEach(item => {

        item.style.opacity = "0";

        item.style.transform =
            "translateY(20px)";

        item.style.transition =
            "opacity .6s ease, transform .6s ease";

        observer.observe(item);

    });

}


// ======================================
// SMOOTH SCROLL UNTUK LINK INTERNAL
// ======================================

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );

        if (!link) {
            return;
        }


        const targetId =
            link.getAttribute("href");


        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(targetId);


        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }
);
