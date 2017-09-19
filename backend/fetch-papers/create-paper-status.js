async function createPaperStatus(tx, paper) {
  await models.PaperStatus.findOrCreate({
    where: {paperId: paper.id},
    defaults: {isArchived: false, isStarred: false},
    transaction: tx,
  });
}
