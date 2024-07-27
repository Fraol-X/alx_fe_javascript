document.addEventListener('DOMContentLoaded', function() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
    const quotes = storedQuotes || [
        {text: "If you can dream it, you can do it.", category: "Motivational"},
        {text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.", category: "Funny"},
        {text: "Early to bed and early to rise makes a man healthy, wealthy and wise.", category: "Health"},
        {text: "I have no special talent. I am only passionately curious.", category: "Educational"},
        {text: "One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.", category: "Technology"}
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const exportButton = document.getElementById('exportQuotes');
    let newQuoteTextInput;
    let newQuoteCategoryInput;
    let addQuoteButton;

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function saveLastViewedQuote(index) {
        sessionStorage.setItem('lastViewedQuoteIndex', index);
    }

    function getLastViewedQuote() {
        return sessionStorage.getItem('lastViewedQuoteIndex');
    }

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>Quote: ${quote.text}</p><p>Category: ${quote.category}</p>`;
        saveLastViewedQuote(randomIndex);
    }

    function showLastViewedQuote() {
        const lastViewedQuoteIndex = getLastViewedQuote();
        if (lastViewedQuoteIndex !== null) {
            const quote = quotes[lastViewedQuoteIndex];
            quoteDisplay.innerHTML = `<p>Quote: ${quote.text}</p><p>Category: ${quote.category}</p>`;
        } else {
            showRandomQuote();
        }
    }

    function addQuote() {
        const text = newQuoteTextInput.value.trim();
        const category = newQuoteCategoryInput.value.trim();

        if (text === "" || category === "") {
            alert("Quote and Category Inputs are Required!");
            return;
        }

        const newQuote = { text, category };
        quotes.push(newQuote);
        saveQuotes();
        newQuoteTextInput.value = "";
        newQuoteCategoryInput.value = "";
        showRandomQuote();
    }

    function createAddQuoteForm() {
        const divForm = document.createElement('div');
        divForm.id = 'addQuoteForm';

        newQuoteTextInput = document.createElement('input');
        newQuoteTextInput.id = 'newQuoteText';
        newQuoteTextInput.type = 'text';
        newQuoteTextInput.placeholder = 'Enter a new quote';

        newQuoteCategoryInput = document.createElement('input');
        newQuoteCategoryInput.id = 'newQuoteCategory';
        newQuoteCategoryInput.type = 'text';
        newQuoteCategoryInput.placeholder = 'Enter quote category';

        addQuoteButton = document.createElement('button');
        addQuoteButton.id = 'addQuoteButton';
        addQuoteButton.textContent = 'Add Quote';

        divForm.appendChild(newQuoteTextInput);
        divForm.appendChild(newQuoteCategoryInput);
        divForm.appendChild(addQuoteButton);

        document.body.appendChild(divForm);

        addQuoteButton.addEventListener('click', addQuote);
    }

    function exportToJsonFile() {
        const jsonString = JSON.stringify(quotes);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            showRandomQuote();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    exportButton.addEventListener('click', exportToJsonFile);
    createAddQuoteForm();
    newQuoteButton.addEventListener('click', showRandomQuote);
    showLastViewedQuote();
});
