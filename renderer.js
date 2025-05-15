// renderer.js

// We no longer require system-font-families directly here.
// We will access it via the 'electronAPI' exposed by the preload script.

document.addEventListener('DOMContentLoaded', async () => { // Made the event listener async
  const fontListElement = document.getElementById('font-list');
  const fontPreviewElement = document.getElementById('font-preview');
  const cssCodeContainerElement = document.getElementById('css-code-container');
  const cssCodeElement = document.getElementById('css-code');
  const copyCssButton = document.getElementById('copy-css-button');
  const messageBox = document.getElementById('message-box');

  // Get references to the new input elements
  const customTextInput = document.getElementById('custom-text');
  const fontWeightSelect = document.getElementById('font-weight');
  const fontSizeInput = document.getElementById('font-size');
  const textDecorationSelect = document.getElementById('text-decoration');
  const fontSearchInput = document.getElementById('font-search'); // Get reference to the search input

  // Variable to store the full list of fonts
  let allFonts = [];

  // Set initial text in the CSS code block
  cssCodeElement.textContent = '/* Select a font to see its CSS */';


  // Function to display a message in the message box
  function showMessage(message, duration = 2000) {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden');
    setTimeout(() => {
      messageBox.classList.add('hidden');
    }, duration);
  }

  // --- Font Listing Logic using IPC ---
  console.log("Attempting to list system fonts via IPC...");

  try {
    // Call the function exposed by the preload script to get fonts from the main process
    const fontFamilies = await window.electronAPI.getSystemFonts();

    console.log("Fonts received via IPC:", fontFamilies.length);

    if (fontFamilies.length > 0) {
      allFonts = fontFamilies; // Store the full list
      displayFonts(allFonts); // Display the full list initially
    } else {
      console.log("No fonts received via IPC.");
      fontListElement.innerHTML = '<li class="p-2 text-gray-600">No fonts found or accessible.</li>';
      showMessage("Could not access system fonts.", 3000);
    }

  } catch (error) {
    console.error("Error listing fonts via IPC:", error);
    fontListElement.innerHTML = '<li class="p-2 text-gray-600">Error accessing fonts. Check console.</li>';
    showMessage("Error accessing system fonts. See console for details.", 5000);
  }


  // Function to display fonts in the list (now takes a list to display)
  function displayFonts(fontsToDisplay) {
    fontListElement.innerHTML = ''; // Clear current list
    console.log("displayFonts called with fonts:", fontsToDisplay.length);
    if (fontsToDisplay.length === 0) {
      fontListElement.innerHTML = '<li class="p-2 text-gray-600">No matching fonts found.</li>';
      return;
    }
    fontsToDisplay.sort(); // Sort alphabetically by family name
    fontsToDisplay.forEach(fontName => {
      const listItem = document.createElement('li');
      listItem.classList.add('font-list-item', 'p-2', 'rounded-md', 'text-gray-700');
      listItem.textContent = fontName;
      listItem.dataset.fontName = fontName; // Store font name
      // Apply the font to the list item itself for preview
      listItem.style.fontFamily = `'${fontName}', sans-serif`;
      fontListElement.appendChild(listItem);
    });
    console.log("Fonts displayed in the list. Number of fonts:", fontsToDisplay.length);
  }

  // --- Function to get the currently selected font name from the list ---
  function getSelectedFontName() {
    const selectedItem = fontListElement.querySelector('.font-list-item.bg-blue-200');
    return selectedItem ? selectedItem.dataset.fontName : null;
  }

  // --- Function to Display Font Details and CSS ---
  // This function now handles updating ALL preview styles and generating CSS
  function displayFontDetails(fontName) {
    // Get current style values from inputs
    const customText = customTextInput.value || "The quick brown fox jumps over the lazy dog."; // Default text
    const fontWeight = fontWeightSelect.value;
    const fontSize = fontSizeInput.value + 'px';
    const textDecoration = textDecorationSelect.value;

    // Update preview text and style
    fontPreviewElement.textContent = customText;
    fontPreviewElement.style.fontWeight = fontWeight;
    fontPreviewElement.style.fontSize = fontSize;
    fontPreviewElement.style.textDecoration = textDecoration;

    // Set font family only if a fontName is provided
    if (fontName) {
      fontPreviewElement.style.fontFamily = `'${fontName}', sans-serif`;

      // Generate CSS code
      let cssCode = `font-family: '${fontName}', sans-serif;`;

      // Add other properties if they are not default
      if (fontWeight !== 'normal') {
        cssCode += `\nfont-weight: ${fontWeight};`;
      }
      if (fontSize !== '16px') { // Assuming 16px is the default size
        cssCode += `\nfont-size: ${fontSize};`;
      }
      if (textDecoration !== 'none') {
        cssCode += `\ntext-decoration: ${textDecoration};`;
      }
      cssCodeElement.textContent = cssCode;
    } else {
      // If no font is selected, reset font family and show placeholder CSS
      fontPreviewElement.style.fontFamily = ''; // Reset to default browser font
      cssCodeElement.textContent = '/* Select a font to see its CSS */';
    }
  }

  // --- Event Listeners for Style Controls ---
  // When a style control changes, get the selected font and update details
  customTextInput.addEventListener('input', () => {
    const selectedFont = getSelectedFontName();
    displayFontDetails(selectedFont);
  });

  fontWeightSelect.addEventListener('change', () => {
    const selectedFont = getSelectedFontName();
    displayFontDetails(selectedFont);
  });

  fontSizeInput.addEventListener('input', () => {
    const selectedFont = getSelectedFontName();
    displayFontDetails(selectedFont);
  });

  textDecorationSelect.addEventListener('change', () => {
    const selectedFont = getSelectedFontName();
    displayFontDetails(selectedFont);
  });

  // --- Event Listener for Font Search Input ---
  fontSearchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredFonts = allFonts.filter(fontName =>
      fontName.toLowerCase().includes(searchTerm)
    );
    displayFonts(filteredFonts);

    // Check if the currently selected font is still in the filtered list
    const selectedFontName = getSelectedFontName();
    if (selectedFontName && !filteredFonts.includes(selectedFontName)) {
      // If the selected font is filtered out, clear the selection and update preview/CSS
      fontListElement.querySelectorAll('.font-list-item').forEach(item => {
        item.classList.remove('bg-blue-200', 'font-semibold');
      });
      displayFontDetails(null); // Call with null to reset preview/CSS
    }
  });


  // --- Event Listener for Font List Clicks ---
  fontListElement.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('font-list-item')) {
      const selectedFont = target.dataset.fontName;
      displayFontDetails(selectedFont); // Update preview and CSS for the selected font

      // Remove active class from previous selection and add to current
      fontListElement.querySelectorAll('.font-list-item').forEach(item => {
        item.classList.remove('bg-blue-200', 'font-semibold');
      });
      target.classList.add('bg-blue-200', 'font-semibold');
    }
  });


  // --- Copy CSS Button Logic ---
  copyCssButton.addEventListener('click', () => {
    const cssText = cssCodeElement.textContent;
    navigator.clipboard.writeText(cssText).then(() => {
      showMessage('CSS copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy CSS:', err);
      showMessage('Failed to copy CSS.', 3000);
    });
  });

});
