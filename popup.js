const readClipboardText = async () => {
  return await navigator.clipboard.readText();
}

const handleCreateNewNote = (text) => {
  const createForm = document.querySelector(".createForm")
  if(!createForm) return;

  createForm.innerHTML = ""

  const titleFormControl = document.createElement("div")
  const textFormControl = document.createElement("div")

  const noteTitle = document.createElement("input")
  const noteText = document.createElement("textarea")
  const titleLabel = document.createElement("label")
  const textLabel = document.createElement("label")

  const submitBtn = document.createElement("button")

  createForm.appendChild(titleFormControl)
  titleFormControl.className = "form_control"

  titleFormControl.appendChild(titleLabel)
  titleLabel.textContent = "Title:"
  titleLabel.for = "title"

  titleFormControl.appendChild(noteTitle)
  noteTitle.id = "title"
  noteTitle.name = "title"
  noteTitle.type = "text"

  createForm.appendChild(textFormControl)
  textFormControl.className = "form_control"

  textFormControl.appendChild(textLabel)
  textLabel.textContent = "Text:"
  titleLabel.for = "text"

  textFormControl.appendChild(noteText)
  noteText.id = "text"
  noteText.name = "text"
  noteText.textContent = text

  createForm.appendChild(submitBtn)
  submitBtn.id = "create_submit_btn"
  submitBtn.textContent = "Save"

  createForm.addEventListener("submit", handleSubmitNew)
}

const handleSubmitNew = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  if (!data.text) return;
  if(!Boolean(data.title)){
    data.title = data.text.substring(0, 22) + (data.text.length > 22 ? "..." : "")
  }

  const result = await chrome.storage.sync.get(["notes"]);
  let notes = result.notes ?? { values: [] };

  notes.values.push({...data, createdAt: Date.now()});

  chrome.storage.sync.set({ notes });

  window.location = "/popup.html"
};

const hasDuplicates = (notesValues, value) => {
  for (let note of notesValues) {
    if(note.title.trim() === value.title.trim() && note.text.trim() === value.text.trim()) {
      return true
    }
  }

  return false
}

const renderNotesList = async () => {
  const notesList = document.getElementById("notes_list")
  if(!notesList) return

  notesList.innerHTML = ""

  const result = await chrome.storage.sync.get(["notes"]);
  let notes = result.notes ?? { values: [] };

  notes.values.map(note => {
    const listItem = document.createElement("li")
    listItem.className = "notesListItem"

    const itemTitle = document.createElement("div")
    itemTitle.className = "notesListTitle"
    itemTitle.textContent = note.title
    itemTitle.title = note.text

    const itemActions = document.createElement("div")
    itemActions.className = "notesListActions"

    const deleteAnchor = document.createElement("a")
    deleteAnchor.className = "noteDeleteAnchor"
    deleteAnchor.href = "/"
    deleteAnchor.textContent = "❌"
    deleteAnchor.title = "delete note"

    deleteAnchor.addEventListener("click", async(e) => {
      e.preventDefault()
      const result = await chrome.storage.sync.get(["notes"]);
      let notes = result.notes ?? { values: [] };

      const values = notes.values.filter(n => n.createdAt !== note.createdAt)
      
      await chrome.storage.sync.set({notes: {values}});

      listItem.remove()
    })

    itemTitle.addEventListener("click", async () => {
      navigator.clipboard.writeText(note.text)
    })

    itemActions.appendChild(deleteAnchor)

    listItem.appendChild(itemTitle)
    listItem.appendChild(itemActions)
    notesList.appendChild(listItem)
  })
}

const handleJsonNotes = () => {
  const importBtn = document.getElementById("import_json")
  const exportBtn = document.getElementById("export_json")

  const inputJson = document.getElementById("input_json")

  exportBtn.addEventListener("click", async (e) => {
    e.preventDefault()

    const result = await chrome.storage.sync.get(["notes"]);
    const notes = result.notes ?? { values: [] };

    const json = JSON.stringify(notes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "notes.json";
    link.click();
    link.remove()

    URL.revokeObjectURL(url);
  })

  inputJson.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    const result = await chrome.storage.sync.get(["notes"]);
    let notes = result.notes ?? { values: [] };

    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        let baseTime = Date.now();

        let updatedData = jsonData.values.map((note, index) => {
          note.createdAt = baseTime + index;
          return note;
        });

        notes.values = [
          ...notes.values, 
          ...updatedData.filter(data => !hasDuplicates(notes.values, data))
        ]

        console.log(notes)

        await chrome.storage.sync.set({notes});

        window.location = "/popup.html"
      } catch (err) {
        console.error("error while reading JSON:", err);
      }
    };

    reader.readAsText(file);
  });

  importBtn.addEventListener("click", (e) => {
    e.preventDefault()
    inputJson.click()
  })


}

document.getElementById("new_btn").addEventListener("click", async () => {
  try {
    const text = await readClipboardText()
    handleCreateNewNote(text ?? "")

  } catch (err) {
    console.error("Error while trying to read the clipboard:", err);
  }
});

renderNotesList()
handleJsonNotes()

