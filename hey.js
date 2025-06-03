window.addEventListener("load", () => {
    document.body.style.display = "none";
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = "grid"; // restore display
  });
  