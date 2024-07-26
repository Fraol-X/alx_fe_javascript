document.addEventListener('DOMContentLoaded', function() {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "If you can dream it, you can do it.", category: "Motivational" },
        { text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.", category: "Funny" },
        { text: "Early to bed and early to rise makes a man healthy, wealthy and wise.", category: "Health" },
        { text: "I have no special talent. I am only passionately curious.", category: "Educational" },
        { text: "One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.", category: "Technology" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const categoryFilter = document.getElementById('categoryFilter');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const formContainer = document.getElementById('formContainer');
    const importFileInput = document.getElementById('importFile');

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function showRandomQuote() {
        const filteredQuotes = categoryFilter.value === 'all'
            ? quotes
            : quotes.filter(quote => quote.category === categoryFilter.value);

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = `<p>No quotes available for the selected category.</p>`;
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<p>Quote: ${quote.text}</p> <p>Category: ${quote.category}</p>`;
    }

    function addQuote() {
        const text = document.getElementById('newQuoteText').value.trim();
        const category = document.getElementById('newQuoteCategory').value.trim();

        if (text === "" || category === "") {
            alert("Input required for Quote and Category");
            return;
        }

        quotes.push({ text, category });
        saveQuotes();
        updateCategoryFilter();
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Successfully added");
    }

    function createAddQuoteForm() {
        if (!formContainer) return;

        formContainer.innerHTML = ''; 
        const textInput = document.createElement('input');
        textInput.id = 'newQuoteText';
        textInput.type = 'text';
        textInput.placeholder = 'Enter a new quote';
        const categoryInput = document.createElement('input');
        categoryInput.id = 'newQuoteCategory';
        categoryInput.type = 'text';
        categoryInput.placeholder = 'Enter quote category';
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Add Quote';
        submitButton.addEventListener('click', addQuote);
        formContainer.appendChild(textInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(submitButton);
    }

    function updateCategoryFilter() {
        if (!categoryFilter) return;

        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function filterQuotes() {
        showRandomQuote();
        localStorage.setItem('selectedCategory', categoryFilter.value);
    }

    function exportToJsonFile() {
        const json = JSON.stringify(quotes);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                quotes.push(...importedQuotes);
                saveQuotes();
                updateCategoryFilter();
                alert('Quotes imported successfully!');
            } catch (error) {
                alert('Failed to import quotes. Please ensure the file is valid JSON.');
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function fetchQuotesFromServer() {
        // Simulate fetching data from a server
        setTimeout(() => {
            console.log('Fetching quotes from server...');
            // Here you would make an actual request to fetch quotes from a server
            // For demonstration, we'll just log a message
        }, 1000);
    }

    function populateCategories() {
        if (!categoryFilter) return;

        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    if (newQuoteButton) newQuoteButton.addEventListener('click', showRandomQuote);
    if (categoryFilter) categoryFilter.addEventListener('change', filterQuotes);
    if (exportQuotesButton) exportQuotesButton.addEventListener('click', exportToJsonFile);
    if (importFileInput) importFileInput.addEventListener('change', importFromJsonFile);

    createAddQuoteForm();
    populateCategories();
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory && categoryFilter) {
        categoryFilter.value = savedCategory;
    }
    showRandomQuote();
    fetchQuotesFromServer();
});
