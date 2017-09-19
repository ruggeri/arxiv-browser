const feedParser = require('feedparser');
const request = require('request');

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

module.exports = async function requestPaperResults(startIndex, maxResults) {
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
