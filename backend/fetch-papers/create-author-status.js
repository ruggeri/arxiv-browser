module.exports = async function createAuthorStatus(tx, author) {
  let [authorStatus, didCreate] = [(await (
    tx
      .select('authorStatuses.*')
      .from('authorStatuses')
      .where('authorId', author.id)
      .first()
  )), false];

  if (!authorStatus) {
    [authorStatus, didCreate] = [(await (
      tx
        .insert({authorId: author.id, isStarred: false})
        .into('authorStatuses')
        .returning('authorStatuses.*')
        .first()
    )), true];
  }

  return {authorStatus, didCreate};
};
