document.addEventListener('DOMContentLoaded', function() {
    let quotes = [
        { text: "If you can dream it, you can do it.", category: "Motivational" },
        { text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.", category: "Funny" },
        { text: "Early to bed and early to rise makes a man healthy, wealthy and wise.", category: "Health" },
        { text: "I have no special talent. I am only passionately curious.", category: "Educational" },
        { text: "One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.", category: "Technology" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuote');

    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>Quote: ${quote.text}</p><p>Category: ${quote.category}</p>`;
    }

    function addQuote() {
        const text = document.getElementById('newQuoteText').value.trim();
        const category = document.getElementById('newQuoteCategory').value.trim();

        if (text === "" || category === "") {
            alert("Both quote and category are required.");
            return;
        }

        const newQuote = { text, category };
        quotes.push(newQuote);
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        showRandomQuote();
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
    
});
