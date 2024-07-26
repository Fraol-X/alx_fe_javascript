document.addEventListener('DOMContentLoaded', function(){
    const quotes = [

        {text: "If you can dream it, you can do it.", category:"Motivational"},

        {text: "Better to remain silent and be thought a fool than to speak out and remove all doubt.", category: "Funny"},

        {text: "Early to bed and early to rise makes a man healthy, wealthy and wise.", category: "Health"},

        {text: "I have no special talent. I am only passionately curious.", category: "Educational"},

        {text: "One machine can do the work of fifty ordinary men. No machine can do the work of one extraordinary man.", category: "Technology"}
    ];
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
    const addQuoteButton = document.getElementById('addQuoteButton');

    function showRandomQuote() {

        const randomDisplay = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomDisplay];
        quoteDisplay.innerHTML = `<p>Quote: - ${quote.text}</p><p>Category: - ${quote.category}</p>`;
    }

    function addQuote() {

        const text = newQuoteTextInput.value.trim();
        const category = newQuoteCategoryInput.value.trim();


        if (text === "" || category === "") {
            alert("Quote and Category Inputs Required")
            return;
        }

        const newQuote = { text, category };
        quotes.push(newQuote);
        newQuoteTextInput.value = "";
        newQuoteCategoryInput.value = "";
        showRandomQuote();

    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click' , addQuote);
    showRandomQuote();
});