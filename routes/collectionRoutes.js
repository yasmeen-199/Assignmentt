
const express = require("express");

const router = express.Router();

const {
    createBooksCollection,
    createAuthorsCollection,
    createLogsCollection,
    createBooksIndex
} = require("../controllers/collectionController");

router.post("/books", createBooksCollection);

router.post("/authors", createAuthorsCollection);

router.post("/logs/capped", createLogsCollection);

router.post("/books/index", createBooksIndex);

module.exports = router;
