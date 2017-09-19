module.exports = (knex) => {
  return {
    findAll: async (columnName, ids) => {
      return await knex
        .select('authorships.*')
        .from('authorships')
        .whereIn(`authorships.${columnName}`, ids)
    }
  };
}
