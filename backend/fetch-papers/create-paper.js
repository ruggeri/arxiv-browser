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
