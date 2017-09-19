exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('paperStatuses', table => {
    table.dropColumn('isArchived');
    table.enu('state', [
      'isAwaitingReview',
      'isIgnored',
      'isSavedForLaterReading',
      'isRead',
    ]).notNullable();
  });
};

exports.down = function(knex, Promise) {
  throw "No going back!";
};
