exports.up = async function(knex, Promise) {
  await knex.schema.createTable('papers', (table) => {
    table.increments('id').primary().notNullable();
    table.string('link', 1024).notNullable().unique();
    table.string('title', 1024).notNullable();
    table.text('summary').notNullable();
    table.dateTime('publicationDateTime').notNullable();
    table.dateTime('updateDateTime').notNullable();
    table.timestamp('createdAt').notNullable();
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('papers');
};
