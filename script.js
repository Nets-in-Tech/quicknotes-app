// ==========================================
// 1. Element Selection using querySelector
// ==========================================
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const clearAllBtn = document.querySelector("#clear-all-btn");

// ==========================================
// 2. Notes State
// ==========================================
let notes = [];

// ==========================================
// 3. Persistence (Task 5)
// ==========================================
function saveNotes() {
    localStorage.setItem("quicknotes_data", JSON.stringify(notes));
}

function loadNotes() {
    const data = localStorage.getItem("quicknotes_data");
    if (data) {
        try {
            notes = JSON.parse(data);
        } catch (e) {
            console.error("Error reading localStorage:", e);
            notes = [];
        }
    }
}

// ==========================================
// 4. Update Dynamic Note Count
// ==========================================
function updateNoteCount(displayedCount) {
    const count = displayedCount !== undefined ? displayedCount : notes.length;
    if (count === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (count === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${count} notes.`;
    }
}

// ==========================================
// 5. Render Function (Task 5 Search Integration)
// ==========================================
function render(filterWord = "") {
    // Clear list safely without innerHTML
    notesList.textContent = "";

    const searchTerm = filterWord.trim().toLowerCase();
    const filteredNotes = notes.filter((note) =>
        note.text.toLowerCase().includes(searchTerm)
    );

    // Search finding nothing check
    if (filteredNotes.length === 0) {
        if (notes.length > 0 && searchTerm !== "") {
            const emptyLi = document.createElement("li");
            emptyLi.className = "no-notes-msg";
            emptyLi.textContent = "No notes match your search.";
            notesList.appendChild(emptyLi);
        }
        updateNoteCount(0);
        return;
    }

    // Render matching note cards
    filteredNotes.forEach((note) => {
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

    updateNoteCount(filteredNotes.length);
}

// ==========================================
// 6. Form Submission Logic & Validation
// ==========================================
function addNote(event) {
    event.preventDefault();

    const textValue = noteInput.value.trim();
    const categoryValue = noteCategory.value;

    // Validation 1: Blank input
    if (textValue === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Validation 2: Maximum 200 characters
    if (textValue.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

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
    saveNotes();
    render(searchInput.value);

    noteInput.value = "";
}

// ==========================================
// 7. Delete Note & Clear All
// ==========================================
function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    saveNotes();
    render(searchInput.value);
}

function clearAllNotes() {
    if (notes.length === 0) return;

    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        render();
    }
}

// ==========================================
// 8. Event Listeners & Startup
// ==========================================
noteForm.addEventListener("submit", addNote);

searchInput.addEventListener("input", (e) => {
    render(e.target.value);
});

clearAllBtn.addEventListener("click", clearAllNotes);

function init() {
    loadNotes();
    render();
}

init();