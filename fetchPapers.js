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

  let author = await models.Author.findOne(
    {where: {name: name}}, {transaction: tx}
  );
  if (author) {
    return author;
  }

  // Else we need to add this author!
  author = await models.Author.findOrCreate({
    where: {name: name}
  }, {transaction: tx});
  console.log(`Added author ${name} to the DB!`);

  return author;
}

async function parseAuthors(tx, paperJSON) {
  const authors = paperJSON["atom:author"].map(
    async authorJSON => await parseAuthor(tx, authorJSON)
  );

  return authors;
}

async function parsePaper(tx, paperJSON) {
  const link = paperJSON.link;

  let paper = await models.Paper.findOne(
    {where: {link: link}}, {transaction: tx}
  );
  if (paper) {
    console.log(`Skipping already processed paper: ${link}`);
    return;
  }

  // Else we need to build a new paper!
  paper = new models.Paper({
    link: paperJSON.link,
    title: paperJSON.title,
    summary: paperJSON.summary,
    updateDateTime: paperJSON["atom:updated"]["#"],
    publicationDateTime: paperJSON["atom:published"]["#"],
  });

  await parseAuthors(tx, paperJSON["atom:author"]);
  await paper.save();
  console.log(`Added paper ${link} to the DB!`);
}

async function main(startIndex, maxResults) {
  try {
    await models.sequelize.transaction(async tx => {
      const papersJSON = await fetchResults(startIndex, maxResults)
      papersJSON.forEach(async paperJSON => await parsePaper(tx, paperJSON));
    });
  } catch (err) {
    console.log(err);
  }
}

const START_INDEX = 0;
const MAX_RESULTS = 100;
main(START_INDEX, MAX_RESULTS);
