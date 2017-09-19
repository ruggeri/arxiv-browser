module.exports = (knex) => {
  return {
    findByIds: async (columnName, ids) => {
      return await knex
        .select('authorships.*')
        .from('authorships')
        .whereIn(`authorships.${columnName}`, ids)
    }
  };
}
