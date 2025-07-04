# Clipboard Notes Extension

This Chrome extension allows you to easily save and manage your clipboard contents. With just a click of a button, you can capture what’s currently in your clipboard, add a custom title, and store it as a note. The extension also lets you quickly copy the contents of saved notes when you need them. It's perfect for persisting important information you copied at any time.

## Features:
- Capture clipboard content by clicking the paste button.
- Add a custom title to each clipboard note.
- Store clipboard contents as notes for easy access.
- Copy note content back to the clipboard with a simple click.

## How to Use

### 1. Clone or Download the Repository
Clone or download the repository to your local machine.

### 2. Import the Extension in Chrome
- Open Chrome and navigate to `chrome://extensions/`.
- Enable **Developer Mode** in the top right.
- Click on **Load unpacked**.
- Select the folder where you downloaded or cloned the repository (the folder should contain the extension files).
- The extension will now be available in your browser!

### 3. Using the Extension
- Click the extension icon in your browser to capture the current clipboard content.
- Click the 'New / Paste' button
- Add a custom title, edit (if needed), and save the clipboard content as a note.
- To copy content from any saved note, simply click on the note, and the content will be copied to your clipboard.

### 4. Exporting and Importing Notes
- You can export your saved notes to a JSON file by using the export option in the extension. The JSON file will follow the format:
``` json
{
  "values": [
    {
      "createdAt": 1677988235000,
      "title": "Note Title",
      "text": "The clipboard content saved as a note."
    }
  ]
}
```
- You can import notes by uploading a JSON file with the same format. This allows you to restore your saved notes or transfer them between devices.

### 5. Managing Notes
All your saved notes can be accessed through the extension. You can view, copy, and delete notes as needed.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

``` vb
This `README.md` includes all the necessary information for users to understand how to install and use the extension, along with features like exporting and importing notes. Let me know if you need anything else!
```