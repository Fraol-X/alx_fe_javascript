document.addEventListener('DOMContentLoaded', function() {
    const quotes = [
        {text: "If you can dream it, you can do it.", category:"Motivational"},
        {text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.", category: "Funny"},
        {text: "Early to bed and early to rise makes a man healthy, wealthy and wise.", category: "Health"},
        {text: "I have no special talent. I am only passionately curious.", category: "Educational"},
        {text: "One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.", category: "Technology"}
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');

    function createAddQuoteForm() {
        const divForm = document.createElement('div');
        divForm.id = 'addQuoteForm';

        const newQuoteTextInput = document.createElement('input');
        newQuoteTextInput.id = 'newQuoteText';
        newQuoteTextInput.type = 'text';
        newQuoteTextInput.placeholder = 'Enter a new quote';

        const newQuoteCategoryInput = document.createElement('input');
        newQuoteCategoryInput.id = 'newQuoteCategory';
        newQuoteCategoryInput.type = 'text';
        newQuoteCategoryInput.placeholder = 'Enter quote category';

        const addQuoteButton = document.createElement('button');
        addQuoteButton.id = 'addQuoteButton';
        addQuoteButton.textContent = 'Add Quote';

        divForm.appendChild(newQuoteTextInput);
        divForm.appendChild(newQuoteCategoryInput);
        divForm.appendChild(addQuoteButton);

        document.body.appendChild(divForm);

        addQuoteButton.addEventListener('click', addQuote);
    }

    function showRandomQuote() {
        const randomDisplay = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomDisplay];
        quoteDisplay.innerHTML = `<p>Quote: - ${quote.text}</p><p>Category: - ${quote.category}</p>`;
    }

    function addQuote() {
        const newQuoteTextInput = document.getElementById('newQuoteText');
        const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

        const text = newQuoteTextInput.value.trim();
        const category = newQuoteCategoryInput.value.trim();

        if (text === "" || category === "") {
            alert("Quote and Category Inputs are Required!");
            return;
        }

        const newQuote = { text, category };
        quotes.push(newQuote);
        newQuoteTextInput.value = "";
        newQuoteCategoryInput.value = "";
        showRandomQuote();
    }

    createAddQuoteForm();
    newQuoteButton.addEventListener('click', showRandomQuote);
    showRandomQuote();
});
