// renderer.js

document.addEventListener('DOMContentLoaded', () => {
  const fontListElement = document.getElementById('font-list');
  const fontPreviewElement = document.getElementById('font-preview');
  const cssCodeContainerElement = document.getElementById('css-code-container');
  const cssCodeElement = document.getElementById('css-code');
  const copyCssButton = document.getElementById('copy-css-button');
  const messageBox = document.getElementById('message-box');

  // Function to display a message in the message box
  function showMessage(message, duration = 2000) {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden');
    setTimeout(() => {
      messageBox.classList.add('hidden');
    }, duration);
  }

  // --- Font Listing Logic (Placeholder) ---
  // In a real Electron app, you would use Node.js APIs (potentially with a native module)
  // to list system fonts here. This is a complex, OS-specific task.
  // For demonstration, we'll use a placeholder list.

  const systemFonts = [
    'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Georgia',
    'Times New Roman', 'Courier New', 'Lucida Console', 'Impact',
    'Comic Sans MS', 'Roboto', 'Open Sans', 'Lato' // Added more common ones
    // Add logic here to get actual system fonts
    // Example (conceptual - requires Node.js fs and path, potentially a font parsing library):
    /*
    const fs = require('fs');
    const path = require('path');
    const fontDirs = [
        // Common font directories for different OS
        '/System/Library/Fonts', // macOS
        '/Library/Fonts', // macOS
        path.join(process.env.HOME, 'Library/Fonts'), // macOS
        'C:\\Windows\\Fonts', // Windows
        '/usr/share/fonts', // Linux
        '/usr/local/share/fonts' // Linux
    ];
    let availableFonts = [];
    fontDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach(file => {
                if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.woff') || file.endsWith('.woff2')) {
                    // You would need a font parsing library here to get the actual font family name
                    // For simplicity, we'll just use the filename (not accurate)
                    const fontName = path.basename(file, path.extname(file));
                    if (!availableFonts.includes(fontName)) {
                        availableFonts.push(fontName);
                    }
                }
            });
        }
    });
    displayFonts(availableFonts);
    */
  ];

  // Display the placeholder fonts initially
  displayFonts(systemFonts);
  showMessage("Displaying a placeholder list of common fonts. Actual system font listing requires additional implementation.", 5000);


  // Function to display fonts in the list
  function displayFonts(fonts) {
    fontListElement.innerHTML = ''; // Clear loading message
    if (fonts.length === 0) {
      fontListElement.innerHTML = '<li class="p-2 text-gray-600">No fonts found or accessible.</li>';
      return;
    }
    fonts.sort(); // Sort alphabetically
    fonts.forEach(fontName => {
      const listItem = document.createElement('li');
      listItem.classList.add('font-list-item', 'p-2', 'rounded-md', 'text-gray-700');
      listItem.textContent = fontName;
      listItem.dataset.fontName = fontName; // Store font name
      // Apply the font to the list item itself for preview
      listItem.style.fontFamily = `'${fontName}', sans-serif`;
      fontListElement.appendChild(listItem);
    });
  }

  // --- Event Listener for Font List Clicks ---
  fontListElement.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('font-list-item')) {
      const selectedFont = target.dataset.fontName;
      displayFontDetails(selectedFont);

      // Remove active class from previous selection and add to current
      fontListElement.querySelectorAll('.font-list-item').forEach(item => {
        item.classList.remove('bg-blue-200', 'font-semibold');
      });
      target.classList.add('bg-blue-200', 'font-semibold');
    }
  });

  // --- Function to Display Font Details and CSS ---
  function displayFontDetails(fontName) {
    // Update preview text style
    fontPreviewElement.style.fontFamily = `'${fontName}', sans-serif`;
    fontPreviewElement.textContent = `Preview of ${fontName}`;

    // Generate CSS code
    const cssCode = `font-family: '${fontName}', sans-serif;
/* Add other properties as needed, e.g., */
/* font-size: 16px; */
/* font-weight: normal; */
/* color: #333; */`;

    // Display CSS code
    cssCodeElement.textContent = cssCode;
    cssCodeContainerElement.classList.remove('hidden');
  }

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
navigator.permissions.query({ name: 'local-fonts' }).then((result) => {
  console.log('Queried permission to local-fonts is: ', result)
})

window.queryLocalFonts().then(fonts => {
  // If setPermissionCheckHandler returns false: fonts.length is 0
  // If setPermissionCheckHandler returns false: fonts.length is about 1000 on my local machine
  console.log(fonts)
})