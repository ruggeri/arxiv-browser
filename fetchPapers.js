const feedParser = require('feedparser');
const request = require('request');
const models = require('./models');

const BASE_URL = 'http://export.arxiv.org/api/query';
const CATEGORIES = [
  "cat:cs.AI",
  "cat:cs.CL",
  "cat:cs.CV",
  "cat:cs.LG",
  "cat:stat.ML",
  "cat:cs.NE",
];
const buildQueryString = (startIndex, maxResults) => (
  `search_query=${CATEGORIES.join("+OR+")}` +
    `&sortBy=lastUpdatedDate` +
    `&start=${startIndex}` +
    `&max_results=${maxResults}`
);

async function fetchResults(startIndex, maxResults) {
  const url = BASE_URL + "?" + buildQueryString(startIndex, maxResults);
  const result = request(url);

  const promise = new Promise((resolve, reject) => {
    const results = [];

    const fp = new feedParser();
    result.pipe(fp).on('readable', () => {
      let item;
      while (item = fp.read()) {
        results.push(item);
      }
    }).on('end', () => resolve(results));
  });

  return await promise;
}

async function parseAuthor(tx, authorJSON) {
  const name = authorJSON["name"]["#"];

  const [author, didCreate] = await models.Author.findOrCreate({
    where: {name: name},
    transaction: tx
  });

  if (didCreate) {
    console.log(`Added author ${name} to the DB!`);
  }

  return author;
}

async function parseAuthors(tx, authorsJSON) {
  if (!Array.isArray(authorsJSON)) {
    // This happens when there is a sole author I think.
    return parseAuthors(tx, [authorsJSON]);
  }

  console.log(authorsJSON)
  const authors = await Promise.all(
    authorsJSON.map(
      async authorJSON => await parseAuthor(tx, authorJSON)
    )
  );

  return authors;
}

async function parseAuthorships(tx, paper, authors) {
  debugger
  for (author of authors) {
    await models.Authorship.findOrCreate({
      where: {paperLink: paper.link, authorName: author.name},
      transaction: tx
    });
  }
}

async function parsePaper(tx, paperJSON) {
  const link = paperJSON.link;

  let paper = await models.Paper.findOne(
    {where: {link: link}}, {transaction: tx}
  );
  if (!paper) {
    // Else we need to build a new paper!
    paper = new models.Paper({
      link: paperJSON.link,
      title: paperJSON.title,
      summary: paperJSON.summary,
      updateDateTime: paperJSON["atom:updated"]["#"],
      publicationDateTime: paperJSON["atom:published"]["#"],
    });
  }

  const authors = await parseAuthors(tx, paperJSON["atom:author"]);
  await paper.save();
  await parseAuthorships(tx, paper, authors);

  console.log(`Added paper ${link} to the DB!`);
}

async function main(startIndex, maxResults) {
  try {
    await models.sequelize.transaction(async tx => {
      const papersJSON = await fetchResults(startIndex, maxResults);
      for (paperJSON of papersJSON) {
        await parsePaper(tx, paperJSON);
      }
    });
  } catch (err) {
    console.log(err);
  } finally {
    models.sequelize.close();
  }
}

const START_INDEX = 0;
const MAX_RESULTS = 100;
main(START_INDEX, MAX_RESULTS);
