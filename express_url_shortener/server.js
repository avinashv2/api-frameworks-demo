const express = require('express');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3')

const app = express();
const port = 3000;

const db = new Database('url_shortener.db', { verbose: console.log });
const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS urls (
    original_url TEXT NOT NULL,
    short_url TEXT NOT NULL UNIQUE
  );
`);

// Run the query to create the table
createTable.run();

// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form to input a URL
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>URL Shortener</h1>
        <form method="POST" action="/shorten">
          <label for="url">Enter URL to shorten:</label>
          <input type="text" name="url" id="url" required>
          <button type="submit">Shorten URL</button>
        </form>
      </body>
    </html>
  `);
});

// Handle URL shortening request
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  
  // Generate a short ID for the URL
  const shortUrl = shortid.generate();
  const insertUrl = db.prepare(`
    INSERT INTO urls (original_url, short_url)
    VALUES (?, ?);
  `);
  insertUrl.run(url, shortUrl) 

  // Respond with the shortened URL
  res.send(`
    <h1>Shortened URL</h1>
    <p>Your shortened URL is: <a href="/${shortUrl}">/${shortUrl}</a></p>
    <p><a href="/">Go back</a></p>
  `);
});

// Redirect to original URL when short URL is accessed
app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;

  const filterByShortUrl = db.prepare(`
    SELECT original_url FROM urls WHERE short_url = ?;
  `);
  // Check if the short URL exists in the database
  const originalUrl = filterByShortUrl.get(shortUrl).original_url;
  console.log(originalUrl)
  if (originalUrl) {
    // Redirect to the original URL
    res.redirect(originalUrl);
  } else {
    // If the short URL is not found
    res.status(404).send('Short URL not found!');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`URL shortener app is running at http://localhost:${port}`);
});
