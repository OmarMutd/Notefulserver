const NotesService = {
    getAllNotes(knex) {
      return knex.select('*').from('notes')
    },
    insertNotes(knex, newNotes) {
      return knex
        .insert(newNotes)
        .into('notes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from('notes').select('*').where('id', id).first()
    },
    deleteNote(knex, id) {
      return knex('notes')
        .where({ id })
        .delete()
    },
    updateNote(knex, id, newNotesFields) {
      return knex('notes')
        .where({ id })
        .update(newNotesFields)
    },
  }
  
  module.exports = NotesService
  