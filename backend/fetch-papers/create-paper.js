async function createPaper(tx, paperJSON) {
  const paperAttrs = {
    link: paperJSON.link,
    title: paperJSON.title,
    summary: paperJSON.summary,
    updateDateTime: paperJSON["atom:updated"]["#"],
    publicationDateTime: paperJSON["atom:published"]["#"],
  };

  let [paper, didCreatePaper] = [(await (
    tx
      .select('papers.*')
      .from('papers')
      .first()
  )), false];

  if (!paper) {
    [paper, didCreatePaper] = [(await (
      tx
        .insert(paperAttrs)
        .into('papers')
        .returning('papers.*')
        .first()
    )), true];
  }

  await createPaperStatus(tx, paper);

  const {authors, numCreated: numAuthorsCreated} = await createAuthors(
    tx, paperJSON["atom:author"]
  );
  await createAuthorships(tx, paper, authors);

  return {
    paper,
    didCreatePaper,
    authors,
    numAuthorsCreated,
  };
}
