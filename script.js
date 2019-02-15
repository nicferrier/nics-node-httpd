window.addEventListener("load", async loadEvt => {
    const img = document.querySelector("img");
    const video = document.querySelector("video");
    const fileElements = document.querySelector(".files").children;
    const urls = document.querySelectorAll(".files li a");
    Array.from(urls).forEach(a => {
        a.addEventListener("focus", async focusEvt => {
            const url = focusEvt.target.getAttribute("href");
            const response = await fetch(url, { method: "HEAD" });
            const contentType = response.headers.get("content-type");
            if (contentType.startsWith("image/")) {
                video.classList.remove("display");
                img.classList.add("display");
                img.src = url;
            }
            else if (contentType.startsWith("video/")) {
                video.classList.add("display");
                img.classList.remove("display");
                video.src = url;
                video.controls = "1";
                video.play();
            }
        });
    });
});
