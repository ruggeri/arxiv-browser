module.exports = async function createPaperStatus(tx, paper) {
  let [paperStatus, didCreate] = [(await (
    tx
      .select('paperStatuses.*')
      .from('paperStatuses')
      .where('paperId', paper.id)
      .first()
  )), false];

  if (!paperStatus) {
    [paperStatus, didCreate] = [(await (
      tx
        .insert({paperId: paper.id, isArchived: false isStarred: false})
        .into('paperStatuses')
        .returning('paperStatuses.*')
        .first()
    )), true];
  }

  return {paperStatus, didCreate};
};
