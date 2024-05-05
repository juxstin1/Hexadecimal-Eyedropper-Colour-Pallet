function chooseColor() {
  var colorInput = document.getElementById("color-input");
  var colorBox = document.getElementById("color-box");
  var colorCode = document.getElementById("color-code");

  // Get the selected color value
  var selectedColor = colorInput.value;

  // Set the background color of the color box
  colorBox.style.backgroundColor = selectedColor;

  // Display the color code
  colorCode.textContent = "Selected Color: " + selectedColor;
}
