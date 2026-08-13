const sourceUpdateUrl="https://raw.githubusercontent.com/nstv-official/nstv/main/update_apk.json";
const downloadReleaseBase="https://github.com/nstv-official/new-releases/releases/download/";
const releaseApiBase="https://api.github.com/repos/nstv-official/new-releases/releases/tags/";

document.addEventListener("DOMContentLoaded",()=>{loadLatestRelease();initSlider();initScrollAnimation();});

async function loadLatestRelease(){
 try{
  const response=await fetch(`${sourceUpdateUrl}?t=${Date.now()}`,{cache:"no-store"});
  if(!response.ok)throw new Error("Gagal mengambil update_apk.json.");
  const data=await response.json();
  const version=String(data.latestVersionName||"").replace(/^v/i,"");
  const sourceDownloadUrl=data.updateUrl||"";
  const releaseNotes=data.releaseNotes||"";
  let apkSizeBytes=Number(data.apkSizeBytes||0);
  if(!version||!sourceDownloadUrl)throw new Error("Data versi atau URL APK tidak lengkap.");

  const apkFileName=getApkFileName(sourceDownloadUrl);
  const releaseTag=`v${version}`;
  const downloadUrl=apkFileName?`${downloadReleaseBase}${encodeURIComponent(releaseTag)}/${encodeURIComponent(apkFileName)}`:sourceDownloadUrl;

  const versionElement=document.getElementById("app-version");
  const latestVersion=document.getElementById("latest-version");
  const sizeElement=document.getElementById("latest-size");
  const downloadCountElement=document.getElementById("download-count");
  if(versionElement)versionElement.textContent=version;
  if(latestVersion)latestVersion.textContent=version;

  let downloadCount=0;
  if(apkFileName){
   try{
    const releaseResponse=await fetch(`${releaseApiBase}${encodeURIComponent(releaseTag)}`,{cache:"no-store",headers:{"Accept":"application/vnd.github+json"}});
    if(releaseResponse.ok){
     const releaseData=await releaseResponse.json();
     const apkAsset=(releaseData.assets||[]).find(asset=>asset.name===apkFileName&&asset.state==="uploaded");
     if(apkAsset){
      if(Number(apkAsset.size)>0)apkSizeBytes=Number(apkAsset.size);
      downloadCount=Number(apkAsset.download_count||0);
     }
    }
   }catch(error){console.warn("Gagal mengambil data GitHub Release:",error);}
  }

  if(sizeElement)sizeElement.textContent=apkSizeBytes>0?formatFileSize(apkSizeBytes):"-";
  if(downloadCountElement)downloadCountElement.textContent=formatDownloadCount(downloadCount);

  const notesElement=document.getElementById("release-notes");
  const notesText=document.getElementById("release-notes-text");
  if(notesElement&&notesText&&releaseNotes){notesText.textContent=releaseNotes;notesElement.hidden=false;}

  document.querySelectorAll("[data-latest-download]").forEach(link=>{
   link.href=downloadUrl;link.removeAttribute("target");link.rel="noopener noreferrer";link.title=`Download NSTV v${version}`;link.innerHTML=`⬇ Download NSTV v${version}`;
  });
 }catch(error){
  console.error(error);
  const versionElement=document.getElementById("app-version");
  const latestVersion=document.getElementById("latest-version");
  const sizeElement=document.getElementById("latest-size");
  const downloadCountElement=document.getElementById("download-count");
  if(versionElement)versionElement.textContent="Tidak tersedia";
  if(latestVersion)latestVersion.textContent="-";
  if(sizeElement)sizeElement.textContent="-";
  if(downloadCountElement)downloadCountElement.textContent="-";
 }
}

function getApkFileName(url){try{const parsedUrl=new URL(url);const name=decodeURIComponent(parsedUrl.pathname.split("/").pop()||"");return name.endsWith(".apk")?name:"";}catch(error){return "";}}
function formatFileSize(bytes){if(!Number.isFinite(bytes)||bytes<=0)return "-";const mb=bytes/(1024*1024);return mb<1?`${(bytes/1024).toFixed(0)} KB`:`${mb.toFixed(1)} MB`;}
function formatDownloadCount(count){if(!Number.isFinite(count)||count<0)return "-";return new Intl.NumberFormat("id-ID").format(count);}

function initSlider(){const slides=document.querySelectorAll(".slide");if(!slides.length)return;let currentSlide=0;function showSlide(index){slides.forEach(slide=>slide.classList.remove("active"));slides[index].classList.add("active");}showSlide(currentSlide);const nextButton=document.querySelector(".next");if(nextButton)nextButton.addEventListener("click",()=>{currentSlide=(currentSlide+1)%slides.length;showSlide(currentSlide);});const prevButton=document.querySelector(".prev");if(prevButton)prevButton.addEventListener("click",()=>{currentSlide=(currentSlide-1+slides.length)%slides.length;showSlide(currentSlide);});setInterval(()=>{currentSlide=(currentSlide+1)%slides.length;showSlide(currentSlide);},5000);}

function initScrollAnimation(){const items=document.querySelectorAll(".hero-card, .stat, .feature, .faq-item, .screens img");if(!items.length)return;const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity="1";entry.target.style.transform="translateY(0)";}});},{threshold:0.1});items.forEach(item=>{item.style.opacity="0";item.style.transform="translateY(20px)";item.style.transition="opacity .6s ease, transform .6s ease";observer.observe(item);});}

document.addEventListener("click",event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const targetId=link.getAttribute("href");if(!targetId||targetId==="#")return;const target=document.querySelector(targetId);if(target){event.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}});
