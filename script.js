window.addEventListener("load", async loadEvt => {
    const viewer = document.querySelector("body");
    const fileElements = document.querySelector(".files").children;
    const urls = document.querySelectorAll(".files li a");
    Array.from(urls).forEach(a => {
        a.addEventListener("focus", async focusEvt => {
            const url = focusEvt.target.getAttribute("href");
            const response = await fetch(url, { method: "HEAD" });
            if (response.headers.get("content-type").startsWith("image/")) {
                viewer.style.backgroundImage = `url(${url})`;
                viewer.style.height = "100%";
            }
        });
    });
});
