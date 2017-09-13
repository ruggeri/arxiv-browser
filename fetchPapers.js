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

async function createAuthor(tx, authorJSON) {
  const authorAttrs = {
    name: authorJSON["name"]["#"]
  }

  let [author, didCreate] = [await models.Author.findOne({
    where: {name: authorAttrs.name},
    transaction: tx
  }), false];
  if (!author) {
    [author, didCreate] = [new models.Author(), true];
  }

  author.set(authorAttrs);
  await author.save({transaction: tx});

  await createAuthorStatus(tx, author);

  if (didCreate) {
    console.log(`Added author ${author.name} to the DB!`);
  }

  return author;
}

async function createAuthors(tx, authorsJSON) {
  if (!Array.isArray(authorsJSON)) {
    // This happens when there is a sole author I think.
    return await createAuthors(tx, [authorsJSON]);
  }

  const authors = [];
  for (authorJSON of authorsJSON) {
    authors.push(await createAuthor(tx, authorJSON));
  }

  return authors;
}

async function createAuthorships(tx, paper, authors) {
  for (author of authors) {
    await models.Authorship.findOrCreate({
      where: {paperId: paper.id, authorId: author.id},
      transaction: tx
    });
  }
}

async function createPaperStatus(tx, paper) {
  await models.PaperStatus.findOrCreate({
    where: {paperId: paper.id},
    defaults: {isArchived: false, isStarred: false},
    transaction: tx,
  });
}

async function createAuthorStatus(tx, author) {
  await models.AuthorStatus.findOrCreate({
    where: {authorId: author.id},
    defaults: {isStarred: false},
    transaction: tx,
  });
}

async function createPaper(tx, paperJSON) {
  const paperAttrs = {
    link: paperJSON.link,
    title: paperJSON.title,
    summary: paperJSON.summary,
    updateDateTime: paperJSON["atom:updated"]["#"],
    publicationDateTime: paperJSON["atom:published"]["#"],
  };

  let [paper, didCreate] = [await models.Paper.findOne({
    where: {link: paperAttrs.link},
    transaction: tx,
  }), false];
  if (!paper) {
    // Else we need to build a new paper!
    [paper, didCreate] = [new models.Paper(), true];
  }
  paper.set(paperAttrs);
  await paper.save({transaction: tx});
  await createPaperStatus(tx, paper);

  const authors = await createAuthors(tx, paperJSON["atom:author"]);
  await createAuthorships(tx, paper, authors);

  if (didCreate) {
    console.log(`Added paper ${paper.link} to the DB!`);
  }
}

async function main(startIndex, maxResults) {
  try {
    await models.sequelize.transaction(async tx => {
      const papersJSON = await fetchResults(startIndex, maxResults);
      for (paperJSON of papersJSON) {
        await createPaper(tx, paperJSON);
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
