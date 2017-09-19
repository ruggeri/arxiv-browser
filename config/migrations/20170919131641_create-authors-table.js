
exports.up = async function(knex, Promise) {
  await knex.schema.createTable('authors', (table) => {
    table.increments('id').primary().notNullable();
    table.string('name').notNullable().unique();
    table.timestamp('createdAt').notNullable();
  });

  await knex.schema.createTable('authorships', (table) => {
    table.increments('id').primary().notNullable();
    table.integer('paperId').notNullable().references('papers.id');
    table.integer('authorId').notNullable().references('authors.id');
    table.timestamp('createdAt').notNullable();
    table.unique(['paperId', 'authorId']);
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('authorships');
  await knex.schema.dropTable('authors');
};
