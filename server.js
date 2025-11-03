const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 3100;

app.use(cors());
app.use(express.static(__dirname)); // Sert les fichiers statiques depuis le répertoire racine

const RSS_FEEDS_EN = {
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
    { name: "AP News", url: "https://rsshub.app/apnews/topics/politics" },
    { name: "Washington Post", url: "http://feeds.washingtonpost.com/rss/politics" },
    { name: "AL Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    
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
  Culture: [
    { name: "Art Newspaper", url: "https://www.theartnewspaper.com/rss.xml" },
    { name: "Literary Hub", url: "https://lithub.com/feed/" },
    { name: "BBC Arts", url: "http://feeds.bbci.co.uk/news/arts_and_entertainment/rss.xml" },
    { name: "Le Monde Culture", url: "https://www.lemonde.fr/culture/rss_full.xml" },
    { name: "The Guardian Arts", url: "https://www.theguardian.com/arts/rss" },
    { name: "Variety Arts", url: "https://variety.com/feed/" },
    { name: "The Art Story", url: "http://feeds.feedburner.com/theartstory" },
  ],
  Divertissement: [
    { name: "Entertainment Weekly", url: "https://ew.com/feed/" },
    { name: "Variety", url: "https://variety.com/feed/" },
    { name: "Rolling Stone", url: "https://www.rollingstone.com/culture/culture-news/feed/" },
    { name: "The Hollywood Reporter", url: "https://www.hollywoodreporter.com/feed/" },
    { name: "E! Online", url: "https://www.eonline.com/ca/feeds/rss" },
    { name: "TMZ", url: "https://www.tmz.com/rss.xml" },
    { name: "Vulture", url: "https://www.vulture.com/rss/index.xml" },
  ],
  Sports: [
    { name: "ESPN", url: "https://www.espn.com/espn/rss/news/feed" },
    { name: "BBC Sport", url: "http://feeds.bbci.co.uk/sport/rss.xml" },
    { name: "Sky Sports", url: "https://www.skysports.com/rss/12040" },
    { name: "The Guardian Sport", url: "https://www.theguardian.com/sport/rss" },
    { name: "CNN Sports", url: "https://edition.cnn.com/cnn/specials/sport/digital-view/feed" },
    { name: "USA Today Sports", url: "https://www.usatoday.com/sports/rss/football/" },
    { name: "Bleacher Report", url: "https://bleacherreport.com/feed" },
  ],
};

const RSS_FEEDS_FR = {
  Technologie: [
    { name: "Bfmtv Tech", url: "https://www.bfmtv.com/rss/tech/" },
    { name: "01net", url: "https://www.01net.com/rss/actualites/" },
    { name: "Numerama", url: "https://www.numerama.com/feed/" },
    { name: "Siècle Digital", url: "https://siecledigital.fr/feed/" },
    { name: "Le Figaro Tech", url: "https://www.lefigaro.fr/rss/figaro_actualites.xml" },
    { name: "Clubic", url: "https://www.clubic.com/feed/rss" },
    { name: "Tom's Guide", url: "https://www.tomsguide.fr/feed" },
    { name: "Frandroid", url: "https://www.frandroid.com/rss/feed.xml" },
    { name: "France24", url: "https://www.france24.com/fr/%C3%A9co-tech/rss"}
    
  ],
  Politique: [
    { name: "Le Monde Politique", url: "https://www.lemonde.fr/politique/rss_full.xml" },
    { name: "Le Figaro Politique", url: "https://www.lefigaro.fr/rss/figaro_politique.xml" },
    { name: "Libération", url: "https://www.liberation.fr/arc/outboundfeeds/rss/section/politique/index.xml" },
    { name: "France 24 Politique", url: "https://www.france24.com/fr/rss" },
    { name: "LCI Politique", url: "https://www.lci.fr/politique/rss" },
    { name: "Bfmtv Politique", url: "https://www.bfmtv.com/rss/politique.rss.xml" },
    { name: "L'Obs Politique", url: "https://www.nouvelobs.com/rss/politique.xml" },
  ],
  Science: [
    { name: "Pour la Science", url: "https://www.pourlascience.fr/rss/actualites.rss" },
    { name: "Sciences et Vie", url: "https://www.sciencesetvie.com/feed" },
    { name: "Futura Sciences", url: "https://www.futura-sciences.com/feed" },
    { name: "Le Figaro Sciences", url: "https://www.lefigaro.fr/rss/figaro_sciences.xml" },
    { name: "CNRS Le Journal", url: "https://lejournal.cnrs.fr/rss/all.xml" },
    { name: "Cairn Info", url: "https://www.cairn.info/rss.xml" },
    { name: "Techniques de l'Ingénieur", url: "https://www.techniques-ingenieur.fr/feed/rss" },
  ],
  Affaires: [
    { name: "Les Echos", url: "https://www.lesechos.fr/rss/rss_bourse.xml" },
    { name: "Le Figaro Économie", url: "https://www.lefigaro.fr/rss/figaro_economie.xml" },
    { name: "Bfmtv Business", url: "https://www.bfmtv.com/rss/economie/" },
    { name: "L'Express Business", url: "https://www.lexpress.fr/rss/business.xml" },
    { name: "Capital", url: "https://www.capital.fr/rss" },
    { name: "Challenges", url: "https://www.challenges.fr/rss/actualites.rss" },
    { name: "L'Obs Économie", url: "https://www.nouvelobs.com/rss/economie.xml" },
  ],
  Culture: [
    { name: "Le Monde Culture", url: "https://www.lemonde.fr/culture/rss_full.xml" },
    { name: "Le Figaro Culture", url: "https://www.lefigaro.fr/rss/figaro_culture.xml" },
    { name: "Libération Culture", url: "https://www.liberation.fr/arc/outboundfeeds/rss/section/culture/index.xml" },
    { name: "Télérama", url: "https://www.telerama.fr/rss/rss_culture.xml" },
    { name: "L'Obs Culture", url: "https://www.nouvelobs.com/rss/culture.xml" },
    { name: "France Culture", url: "https://www.franceculture.fr/rss/culture.xml" },
    { name: "Les Inrocks", url: "https://www.lesinrocks.com/feed/" },
  ],
  Divertissement: [
    { name: "Allociné", url: "https://www.allocine.fr/rss/actualite-cinema.xml" },
    { name: "Premiere", url: "https://www.premiere.fr/feed" },
    { name: "Le Figaro Divertissement", url: "https://www.lefigaro.fr/rss/figaro_divertissement.xml" },
    { name: "Purepeople", url: "https://www.purepeople.com/rss/all.xml" },
    { name: "Public", url: "https://www.public.fr/rss" },
    { name: "Closer", url: "https://www.closermag.fr/rss.xml" },
    { name: "Gala", url: "https://www.gala.fr/rss/people" },
  ],
  Sports: [
    { name: "L'Équipe", url: "https://www.lequipe.fr/rss/actu_rss.xml" },
    { name: "RMC Sport", url: "https://rmcsport.bfmtv.com/rss/actu-sports.xml" },
    { name: "France Football", url: "https://www.francefootball.fr/rss/rss_ff.xml" },
    { name: "Le Figaro Sport", url: "https://www.lefigaro.fr/rss/figaro_sport.xml" },
    { name: "L'Equipe Live", url: "https://www.lequipe.fr/LIVE/rss/live" },
    { name: "RTL Sport", url: "https://www.rtl.fr/rss/sport.xml" },
    { name: "CNEWS Sport", url: "https://www.cnews.fr/sport/rss.xml" },
  ],
};

const RSS_FEEDS_AR = {
  Technologie: [
    { name: "Arabnet Tech", url: "https://www.arabnet.me/feed/" },
    { name: "Wamda Tech", url: "https://www.wamda.com/feed" },
    { name: "TechWadi", url: "https://techwadi.org/feed/" },
    { name: "MENA Tech", url: "https://menabytes.com/feed/" },
    { name: "Digital上下文", url: "https://www.digitalcontext.com/feed" },
    { name: "Alemný Tech", url: "https://www.alemny.com/feed" },
    { name: "Teqneia", url: "https://teqneia.com/feed/" },
    { name: "Bey2ollak Tech", url: "https://tech.bey2ollak.com/feed/" },
  ],
  Politique: [
    { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    { name: "BBC Arabic", url: "http://feeds.bbci.co.uk/news/arabic/rss.xml" },
    { name: "Reuters Arabic", url: "https://ara.reuters.com/rss/top_news" },
    { name: "Arab News", url: "https://arabnews.com/rss" },
    { name: "Middle East Eye", url: "https://www.middleeasteye.net/rss" },
    { name: "Al Arabiya", url: "https://english.alarabiya.net/feed/rss" },
    { name: "Arab Times", url: "https://arabtimes.com/feed/" },
    { name: "Anadolu Agency", url: "https://www.aa.com.tr/en/rss/47/all" },
  ],
  Science: [
    { name: "Arab Science", url: "https://www.arabscientist.org/feed/" },
    { name: "Science Arabic", url: "https://sciencearabic.com/rss" },
    { name: "Futura Sciences Arabic", url: "https://www.futura-sciences.com/feed/" },
    { name: "Al Jazeera Science", url: "https://www.aljazeera.com/science/rss" },
    { name: "Arab Research", url: "https://www.arabresearch.org/feed/" },
    { name: "MENA Science", url: "https://www.mena-science.com/feed/" },
    { name: "Technologia Arab", url: "https://technologia.tepago.com/feed/" },
  ],
  Affaires: [
    { name: "Arab Business", url: "https://arabbusiness.com/rss" },
    { name: "Forbes Middle East", url: "https://www.forbes.com/middleeast/feed/" },
    { name: "Gulf Business", url: "https://gulfbusiness.com/feed/" },
    { name: "Asharq Business", url: "https://english.aawsat.com/asharq-business/rss" },
    { name: "Zawya", url: "https://www.zawya.com/rss.xml" },
    { name: "Al Bawaba Business", url: "https://www.albawaba.com/rss/business" },
    { name: "MENA Business", url: "https://menabytes.com/category/business/feed/" },
    { name: "Egyptian Gazette", url: "https://gate.ahram.org.eg/rss/more/rss_2_93.aspx" },
  ],
  Culture: [
    { name: "Al Jazeera Culture", url: "https://www.aljazeera.com/culture/rss" },
    { name: "Arab Culture", url: "https://www.arabculturemagazine.com/feed/" },
    { name: "Bey2ollak Culture", url: "https://culture.bey2ollak.com/feed/" },
    { name: "Zawya Culture", url: "https://www.zawya.com/entertainment/rss.xml" },
    { name: "Arab Cinema", url: "https://www.arabcinema.com/feed/" },
    { name: "Elaph Culture", url: "https://www.elaph.com/rss/culture" },
    { name: "MENA Culture", url: "https://menabytes.com/category/culture/feed/" },
    { name: "Arab Art", url: "https://www.arabartmag.com/feed/" },
  ],
  Divertissement: [
    { name: "MBC Drama", url: "https://mbc.net/rss/drama" },
    { name: "Rotana Cinema", url: "https://www.rotana.net/rss/cinema" },
    { name: "Arab Movie", url: "https://www.arabmovie.com/feed/" },
    { name: "Elaph Entertainment", url: "https://www.elaph.com/rss/entertainment" },
    { name: "Middle East Entertainment", url: "https://middleeastentertainment.com/feed/" },
    { name: "Zawya Entertainment", url: "https://www.zawya.com/entertainment/rss.xml" },
    { name: "Al Arabiya Entertainment", url: "https://english.alarabiya.net/lifestyle/rss" },
    { name: "MENA Entertainment", url: "https://menabytes.com/category/entertainment/feed/" },
  ],
  Sports: [
    { name: "Kooora", url: "https://www.kooora.com/rss.xml" },
    { name: "Al Jazeera Sports", url: "https://www.aljazeera.com/sport/rss" },
    { name: "Arab Football", url: "https://www.arabfootball.com/feed/" },
    { name: "Saudi Sports", url: "https://www.saudigazette.com.sa/rss/sport.xml" },
    { name: "Emirates Sport", url: "https://www.emirates24-7.com/rss/sports.xml" },
    { name: "Qatar Sports", url: "https://www.thepeninsulaqatar.com/rss/sport" },
    { name: "Elaph Sports", url: "https://www.elaph.com/rss/sports" },
    { name: "Middle East Sports", url: "https://middleeastsports.net/feed/" },
  ],
};

const RSS_FEEDS=RSS_FEEDS_FR

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
