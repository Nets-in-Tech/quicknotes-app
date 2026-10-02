// ==========================================
// 1. Element Selection using querySelector
// ==========================================
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const notesList = document.querySelector('#notes-list');

// ==========================================
// 2. Notes Array State
// ==========================================
let notes = [];

// ==========================================
// 3. Render Function
// ==========================================
function render() {
    // Clear list safely without innerHTML
    notesList.textContent = '';

    notes.forEach((note) => {
        const li = document.createElement('li');
        li.className = `note-card category-${note.category}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'note-content';

        const textP = document.createElement('p');
        textP.className = 'note-text';
        textP.textContent = note.text; // Prevents XSS

        const metaP = document.createElement('p');
        metaP.className = 'note-meta';

        const categoryBadge = document.createElement('span');
        categoryBadge.className = 'note-category-badge';
        categoryBadge.textContent = note.category;

        const dateSpan = document.createElement('span');
        dateSpan.textContent = note.createdAt;

        metaP.appendChild(categoryBadge);
        metaP.appendChild(dateSpan);

        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaP);

        li.appendChild(contentDiv);
        notesList.appendChild(li);
    });
}

// ==========================================
// 4. Form Submission Logic
// ==========================================
function addNote(event) {
    event.preventDefault();

    const textValue = noteInput.value;
    const categoryValue = noteCategory.value;

    const newNote = {
        id: Date.now(),
        text: textValue,
        category: categoryValue,
        createdAt: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    notes.unshift(newNote);
    render();

    noteInput.value = '';
}

// ==========================================
// 5. Event Listener setup
// ==========================================
noteForm.addEventListener('submit', addNote);