const logoInput = document.getElementById("logoInput");
const logoImg = document.getElementById("outLogo");
const removeLogoBtn = document.getElementById("removeLogo");

function showLogo(dataUrl) {
  if (dataUrl) {
    logoImg.src = dataUrl;
    logoImg.style.display = "block";
  } else {
    logoImg.removeAttribute("src");
    logoImg.style.display = "none";
  }
}

logoInput.addEventListener("change", function () {
  const file = logoInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    const img = new Image();

    img.onload = function () {
      const maxHeight = 120;
      const scale = Math.min(1, maxHeight / img.height);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png");
      showLogo(dataUrl);

      try {
        localStorage.setItem("pennaLogo", dataUrl);
      } catch (error) {
        console.log("Logo too big to save");
      }
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

removeLogoBtn.addEventListener("click", function () {
  logoInput.value = "";
  localStorage.removeItem("pennaLogo");
  showLogo(null);
});

showLogo(localStorage.getItem("pennaLogo"));