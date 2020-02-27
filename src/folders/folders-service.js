const FoldersService = {
    getAllFolders(knex) {
      return knex.select('*').from('folders')
    },
    insertFolders(knex, newFolder) {
      return knex
        .insert(newFolder)
        .into('folders')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('folders').select('*').where('id', id).first()
    },
    deleteArticle(knex, id) {
      return knex('folders')
        .where({ id })
        .delete()
    },
    updateArticle(knex, id, newFoldersFields) {
      return knex('folders')
        .where({ id })
        .update(newFoldersFields)
    },
  }
  
  module.exports = FoldersService
  