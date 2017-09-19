exports.up = async function(knex, Promise) {
  await knex.schema.createTable('authorStatuses', (table) => {
    table.increments('id').primary().notNullable();
    table.integer('authorId').notNullable().references('authors.id').unique();
    table.boolean('isStarred').notNullable();
    table.timestamp('createdAt').notNullable();
  });

  await knex.schema.createTable('paperStatuses', (table) => {
    table.increments('id').primary().notNullable();
    table.integer('paperId').notNullable().references('papers.id').unique();
    table.boolean('isStarred').notNullable();
    table.boolean('isArchived').notNullable();
    table.timestamp('createdAt').notNullable();
  })
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('authorStatuses');
  await knex.schema.dropTable('paperStatuses');
};
