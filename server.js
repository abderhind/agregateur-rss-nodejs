const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname)); // Sert les fichiers statiques depuis le répertoire racine

const RSS_FEEDS = {
  Technologie: [
    { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
    { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
    { name: "Wired", url: "https://www.wired.com/feed/rss" },
    { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index/" },
    { name: "Engadget", url: "https://www.engadget.com/rss.xml" },
    { name: "TheNextWeb", url: "https://thenextweb.com/feed" },
    { name: "CNET", url: "https://www.cnet.com/rss/news/" },
    { name: "Mashable", url: "https://mashable.com/feeds/rss/all" },
  ],
  Politique: [
    { name: "NY Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml" },
    { name: "BBC", url: "http://feeds.bbci.co.uk/news/politics/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/politics/rss" },
    { name: "Fox News", url: "https://moxie.foxnews.com/google-publisher/politics.xml" },
    { name: "AP News", url: "https://apnews.com/hub/politics/rss.xml" },
    { name: "Washington Post", url: "http://feeds.washingtonpost.com/rss/politics" },
  ],
  Science: [
    { name: "Nature", url: "https://www.nature.com/nature.rss" },
    { name: "NPR", url: "https://feeds.npr.org/1007/rss.xml" },
    { name: "Phys.org", url: "https://phys.org/rss-feed/" },
    { name: "New Scientist", url: "https://www.newscientist.com/feed/home/" },
    { name: "ScienceDaily", url: "https://www.sciencedaily.com/rss/all.xml" },
    { name: "Scientific American", url: "https://rss.sciam.com/sciam/health-and-medicine" },
    { name: "Live Science", url: "https://www.livescience.com/feeds/all" },
  ],
  Affaires: [
    { name: "Financial Times", url: "https://www.ft.com/rss/home" },
    { name: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html" },
    { name: "Forbes", url: "https://www.forbes.com/business/feed/" },
    { name: "The Economist", url: "https://www.economist.com/business/rss.xml" },
    { name: "Bloomberg", url: "https://feeds.bloomberg.com/markets/news.rss" },
    { name: "Wall Street Journal", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml" },
    { name: "MarketWatch", url: "http://feeds.marketwatch.com/marketwatch/topstories/" },
  ],
};

app.get('/rss', async (req, res) => {
    const { category, count } = req.query;

    if (!category || !RSS_FEEDS[category]) {
        return res.status(400).json({ error: 'Catégorie non valide.' });
    }

    const articleCount = parseInt(count, 10) || 10;
    const feeds = RSS_FEEDS[category];

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
