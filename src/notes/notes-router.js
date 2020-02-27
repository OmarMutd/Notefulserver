const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const articlesRouter = express.Router()
const jsonParser = express.json()