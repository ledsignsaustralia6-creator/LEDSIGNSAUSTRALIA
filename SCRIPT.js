const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("fullImage");
const closeBtn = document.querySelector(".close-btn");

// 1. Open modal when clicking any project image
document.querySelectorAll(".project-item img").forEach(img => {
    img.addEventListener("click", function() {
        modal.style.display = "flex";
        modalImg.src = this.src;
    });
});

// 2. Close modal when clicking the close button
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// 3. Close modal when clicking anywhere outside the image background
modal.addEventListener("click", function(e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});