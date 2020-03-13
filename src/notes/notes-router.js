const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const bodyParser = express.json()

const serializeNotes = notes => ({
  id: notes.id,
  name: xss(notes.name),
  modified: notes.modified,
  content: xss(notes.content),
  folder_id: Number(notes.folder_id)
})


notesRouter
  .route('/')

  .get((req, res, next) => {
    const db = req.app.get('db')
    NotesService.getAllNotes(db)
    .then(notes => {
      res.json(notes.map(serializeNotes))
    })
    .catch(next)
  })

  .post(bodyParser, (req, res, next) => {
    const { name, modified, content, folder_id } = req.body
    const newNotes = { name, modified, content, folder_id }
    const db = req.app.get('db')

    for (const field of ['name', 'content', 'folder_id']) {
      if (!newNotes[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    // const error = getNotesValidationError(newNotes)

    // if (error) return res.status(400).send(error)

    NotesService.insertNotes(db, newNotes)
      .then(notes => {
        logger.info(`Any with id ${notes.id} created.`)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${notes.id}`))
          .json(serializeNotes(notes))
      })
      .catch(next)
  })

  notesRouter
    .route('/:notes_id')

    .all((req, res, next) => {
      const db = req.app.get('db')
      const { notes_id } = req.params
      NotesService.getById(db, notes_id)
        .then(notes => {
          if (!notes) {
            logger.error(`Any with id ${notes_id} not found.`)
            return res.status(404).json({
              error: { message: `Any Not Found` }
            })
          }
          res.notes = notes
          next()
        })
        .catch(next)
    })

    .get((req, res) => {
      res.json(serializeNotes(res.notes))
    })

    .delete((req, res, next) => {
      const db = req.app.get('db')
      const { notes_id } = req.params
      NotesService.deleteNotes(db, notes_id)
        .then(() => {
          logger.info(`Notes with id ${notes_id} deleted.`)
          res.status(204).end()
        })
        .catch(next)
      })

    .patch(bodyParser, (req, res, next) => {
      const { name, modified, content, folder_id } = req.body
      const newNotes = { name, modified, content, folder_id }
      const db = req.app.get('db')

      const numberOfValues = Object.values(newNotes).filter(Boolean).length
      if (numberOfValues === 0) {
        logger.error(`Invalid update without required fields`)
        return res.status(400).json({
          error: {
            message: `Request body must content either 'name', 'modified', 'content', or 'folder_id.`
          }
        })
      }

      // const error = getNotesValidationError(newNotes)
      if (error) return res.status(400).send(error)
      const { notes_id } = req.params

      NotesService.updateNotes(db, notes_id, newNotes)
        .then(() => {
          res.status(204).end()
        })
        .catch(next)

    })

    module.exports = notesRouter