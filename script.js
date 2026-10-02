// ==========================================
// 1. Element Selection using querySelector
// ==========================================
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// ==========================================
// 2. Notes Array State
// ==========================================
let notes = [];

// ==========================================
// 3. Update Dynamic Note Count
// ==========================================
function updateNoteCount() {
    const count = notes.length;
    if (count === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (count === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${count} notes.`;
    }
}

// ==========================================
// 4. Render Function
// ==========================================
function render() {
    // Clear list safely without innerHTML
    notesList.textContent = "";

    notes.forEach((note) => {
        const li = document.createElement("li");
        li.className = `note-card category-${note.category}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";

        const textP = document.createElement("p");
        textP.className = "note-text";
        textP.textContent = note.text; // Prevents XSS

        const metaP = document.createElement("p");
        metaP.className = "note-meta";

        const categoryBadge = document.createElement("span");
        categoryBadge.className = "note-category-badge";
        categoryBadge.textContent = note.category;

        const dateSpan = document.createElement("span");
        dateSpan.textContent = note.createdAt;

        metaP.appendChild(categoryBadge);
        metaP.appendChild(dateSpan);

        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaP);

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-danger";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteNote(note.id));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });

    updateNoteCount();
}

// ==========================================
// 5. Form Submission Logic & Validation
// ==========================================
function addNote(event) {
    event.preventDefault();

    const textValue = noteInput.value.trim();
    const categoryValue = noteCategory.value;

    // Validation 1: Blank input / empty spaces
    if (textValue === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Validation 2: Maximum 200 characters
    if (textValue.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear error message when input is valid
    errorMessage.textContent = "";

    const newNote = {
        id: Date.now(),
        text: textValue,
        category: categoryValue,
        createdAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
    };

    notes.unshift(newNote);
    render();

    noteInput.value = "";
}

// ==========================================
// 6. Delete Note Logic
// ==========================================
function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    render();
}

// ==========================================
// 7. Event Listener setup
// ==========================================
noteForm.addEventListener("submit", addNote);