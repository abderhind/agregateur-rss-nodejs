const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const fs = require('fs');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 3100;

// Charger les flux RSS depuis le fichier JSON
const rssData = JSON.parse(fs.readFileSync('./rss-feeds.json', 'utf8'));
const { RSS_FEEDS_EN, RSS_FEEDS_FR, RSS_FEEDS_AR } = rssData;

app.use(cors());
app.use(express.static(__dirname)); // Sert les fichiers statiques depuis le répertoire racine

app.get('/rss', async (req, res) => {
    const { category, count, lang } = req.query;

    // Choisir la source de flux RSS selon la langue
    let feedsSource;
    if (lang === 'FR') {
        feedsSource = RSS_FEEDS_FR;
    } else if (lang === 'AR') {
        feedsSource = RSS_FEEDS_AR;
    } else {
        feedsSource = RSS_FEEDS_EN;
    }
    
    const currentFeeds = feedsSource[category];

    if (!category || !currentFeeds) {
        return res.status(400).json({ error: 'Catégorie non valide.' });
    }

    const articleCount = parseInt(count, 10) || 10;
    const feeds = currentFeeds;

    const promises = feeds.map(feed =>
        parser.parseURL(feed.url)
            .then(parsedFeed => parsedFeed.items.map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.contentSnippet || item.content || '',
                source: feed.name,
                pubDate: item.isoDate || item.pubDate,
            })))
            .catch(error => {
                console.warn(`Impossible de charger le flux pour ${feed.name}:`, error.message);
                return [];
            })
    );

    try {
        const results = await Promise.all(promises);
        const allItems = results.flat()
            .map(item => ({ ...item, pubDate: new Date(item.pubDate) })) // Assurer que pubDate est un objet Date
            .filter(item => item.pubDate && !isNaN(item.pubDate.getTime())); // Filtrer les dates invalides

        allItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

        const finalItems = allItems.slice(0, articleCount);
        res.json(finalItems);
    } catch (e) {
        console.error("Erreur lors de la récupération des flux RSS:", e);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des nouvelles." });
    }
});

// Route par défaut pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Le serveur écoute sur le port ${PORT}`);
    console.log(`Accédez à l'application sur http://localhost:${PORT}`);
});
