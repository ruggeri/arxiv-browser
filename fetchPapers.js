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

  return {author, didCreate};
}

async function createAuthors(tx, authorsJSON) {
  if (!Array.isArray(authorsJSON)) {
    // This happens when there is a sole author I think.
    return await createAuthors(tx, [authorsJSON]);
  }

  const authors = [];
  let numCreated = 0;
  for (authorJSON of authorsJSON) {
    const {author, didCreate} = await createAuthor(tx, authorJSON);
    authors.push(author);
    if (didCreate) {
      numCreated += 1;
    }
  }

  return {
    authors,
    numCreated
  }
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

  let [paper, didCreatePaper] = [await models.Paper.findOne({
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

  const {authors, numCreated: numAuthorsCreated} = await createAuthors(
    tx, paperJSON["atom:author"]
  );
  await createAuthorships(tx, paper, authors);

  if (didCreatePaper) {
    console.log(`Added paper ${paper.link} to the DB!`);
  }

  return {
    paper,
    didCreatePaper,
    authors,
    numAuthorsCreated,
  };
}

async function pullDownPapers(startIndex, maxResults) {
  let [numPapersCreated, numPapersFetched, numAuthorsCreated] = [0, 0, 0];
  await models.sequelize.transaction(async tx => {
    const papersJSON = await fetchResults(startIndex, maxResults);
    numPapersFetched = papersJSON.length;

    for (paperJSON of papersJSON) {
      const result = await createPaper(tx, paperJSON);
      if (result.didCreatePaper) {
        numPapersCreated += 1;
      }
      numAuthorsCreated += result.numAuthorsCreated;
    }
  });

  return {
    numPapersCreated,
    numPapersFetched,
    numAuthorsCreated,
  };
}

async function delay(millis) {
  await new Promise(resolve => setTimeout(resolve, millis));
}

async function main({startIndex, maxResults, maxQueries}) {
  if (!maxQueries) {
    maxQueries = Infinity;
  }

  try {
    let numQueries = 0;
    let skipLevel = 1;
    while (true) {
      console.log({
        startIndex,
        maxResults,
        maxQueries,
        numQueries,
        skipLevel,
      });

      const result = await pullDownPapers(startIndex, maxResults);
      console.log(result);
      if (result.numPapersFetched == 0) {
        console.log("Maybe rate limited?");
      }

      numQueries += 1;
      if (numQueries >= maxQueries) {
        break;
      } else {
        if (result.numPapersFetched > 0) {
          if (result.numPapersCreated > 0) {
            skipLevel = 1;
          } else {
            skipLevel += 1;
          }

          startIndex += (maxResults * skipLevel);
          await delay(5000);
        } else {
          await delay(10000);
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    models.sequelize.close();
  }
}

// Turn off logging?
models.sequelize.options.logging = null;

const START_INDEX = 0;
const MAX_RESULTS = 100;
main({
  startIndex: START_INDEX,
  maxResults: MAX_RESULTS,
  maxQueries: Infinity
});
