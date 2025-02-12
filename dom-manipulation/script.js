document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const storedQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const quotes = storedQuotes.length > 0 ? storedQuotes : [
        {text: "If you can dream it, you can do it.", category: "Motivational"},
        {text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.", category: "Funny"},
        {text: "Early to bed and early to rise makes a man healthy, wealthy and wise.", category: "Health"},
        {text: "I have no special talent. I am only passionately curious.", category: "Educational"},
        {text: "One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.", category: "Technology"}
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const exportButton = document.getElementById('exportQuotes');
    const categoryFilter = document.getElementById('categoryFilter');
    let newQuoteTextInput;
    let newQuoteCategoryInput;
    let addQuoteButton;

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function saveSelectedCategory(category) {
        localStorage.setItem('selectedCategory', category);
    }

    function getSelectedCategory() {
        return localStorage.getItem('selectedCategory') || 'all';
    }

    function saveLastViewedQuote(index) {
        sessionStorage.setItem('lastViewedQuoteIndex', index);
    }

    function getLastViewedQuote() {
        return sessionStorage.getItem('lastViewedQuoteIndex');
    }

    function showRandomQuote() {
        if (quotes.length === 0) return;

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>Quote: ${quote.text}</p><p>Category: ${quote.category}</p>`;
        saveLastViewedQuote(randomIndex);
    }

    function showLastViewedQuote() {
        const lastViewedQuoteIndex = getLastViewedQuote();
        if (lastViewedQuoteIndex !== null) {
            const quote = quotes[lastViewedQuoteIndex];
            if (quote) {
                quoteDisplay.innerHTML = `<p>Quote: ${quote.text}</p><p>Category: ${quote.category}</p>`;
            } else {
                showRandomQuote();
            }
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
        populateCategories();
        syncQuotes();
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

    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.value = getSelectedCategory();
        filterQuotes();
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        saveSelectedCategory(selectedCategory);
        let filteredQuotes = quotes;

        if (selectedCategory !== 'all') {
            filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        }

        quoteDisplay.innerHTML = filteredQuotes.map(quote => 
            `<p>Quote: ${quote.text}</p><p>Category: ${quote.category}</p>`
        ).join('');
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
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    alert('Quotes imported successfully!');
                    showRandomQuote();
                    populateCategories();
                } else {
                    alert('Invalid file format.');
                }
            } catch (e) {
                alert('Error parsing JSON file.');
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    function notifyUser(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }

    async function syncQuotes() {
        try {
            await postQuotesToServer();

            const serverQuotes = await fetchQuotesFromServer();
            if (serverQuotes) {
                const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
                
                const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
                
                localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
                quotes.length = 0;
                quotes.push(...mergedQuotes);
                
                populateCategories();
                filterQuotes();
                notifyUser('Quotes synced with server!');
            }
        } catch (error) {
            console.error('Error syncing quotes:', error);
            notifyUser('Error syncing data with server.');
        }
    }

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.map(item => ({ text: item.title, category: 'General' }));
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
        }
    }

    async function postQuotesToServer() {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quotes)
            });
            if (!response.ok) throw new Error('Failed to post quotes to server');
        } catch (error) {
            console.error('Error posting quotes to server:', error);
        }
    }

    function mergeQuotes(localQuotes, serverQuotes) {
        const serverQuoteMap = new Map(serverQuotes.map(q => [q.text, q]));
        const merged = localQuotes.filter(q => !serverQuoteMap.has(q.text));
        return [...merged, ...serverQuotes];
    }

    function startPeriodicFetch() {
        setInterval(syncQuotes, 60000);
    }

    if (exportButton) {
        exportButton.addEventListener('click', exportToJsonFile);
    }
    categoryFilter.addEventListener('change', filterQuotes);
    createAddQuoteForm();
    newQuoteButton.addEventListener('click', showRandomQuote);
    showLastViewedQuote();
    populateCategories();
    startPeriodicFetch();
});
