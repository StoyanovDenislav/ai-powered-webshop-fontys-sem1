const express = require('express');

const app = express();
const PORT = process.env.PORT || 6001;

app.use(express.json());

// Simple in-memory "database" for demo purposes

//NOTE ALL CODE BELOW IS USED TO TEST IF EXPRESS IS WORKING, NOT REAL CODE!!!!!!!!!!!!!!!
let books = [
	{ id: 1, title: 'The Pragmatic Programmer', author: 'Andrew Hunt' },
	{ id: 2, title: 'Clean Code', author: 'Robert C. Martin' },
];

app.get('/', (req, res) => {
	res.json({ message: 'Welcome to the Bookstore API' });
});

app.get('/health', (req, res) => {
	res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/books', (req, res) => {
	res.json(books);
});

app.get('/books/:id', (req, res) => {
	const id = Number(req.params.id);
	const book = books.find((b) => b.id === id);
	if (!book) return res.status(404).json({ error: 'Book not found' });
	res.json(book);
});

app.post('/books', (req, res) => {
	const { title, author } = req.body;
	if (!title || !author) {
		return res.status(400).json({ error: 'title and author are required' });
	}
	const id = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
	const newBook = { id, title, author };
	books.push(newBook);
	res.status(201).json(newBook);
});

// Basic error handler
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
	console.log(`Bookstore API listening on http://localhost:${PORT}`);
});
