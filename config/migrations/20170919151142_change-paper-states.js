exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('paperStatuses', table => {
    table.dropColumn('isArchived');
    table.enu('state', [
      'isAwaitingReview',
      'isIgnored',
      'isSavedForLaterReading',
      'isReviewed',
    ]).notNullable();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('paperStatuses', table => {
    table.dropColumn('state');
    table.boolean('isArchived');
  });

  await (
    knex
      .update({isArchived: false})
      .into('paperStatuses')
  );

  await knex.schema.alterTable('paperStatuses', table => {
    table.boolean('isArchived').notNullable().alter();
  })
};
