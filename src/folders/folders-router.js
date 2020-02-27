const path = require('path')
const express = require('express')
const xss = require('xss')
const FoldersService = require('./folders-service')

const articlesRouter = express.Router()
const jsonParser = express.json()