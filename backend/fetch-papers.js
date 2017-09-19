const createPaper = require('./fetch-papers/create-paper');
const requestPaperResults = require('./fetch-papers/request-paper-results');
const models = require('./models');

async function pullDownPapers(startIndex, maxResults) {
  let [numPapersCreated, numPapersFetched, numAuthorsCreated] = [0, 0, 0];
  await models.knex.transaction(async tx => {
    const papersJSON = await requestPaperResults(startIndex, maxResults);
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
    models.knex.destroy();
  }
}

const START_INDEX = 0;
const MAX_RESULTS = 100;
main({
  startIndex: START_INDEX,
  maxResults: MAX_RESULTS,
  maxQueries: Infinity
});
