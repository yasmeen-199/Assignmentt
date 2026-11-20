
const express = require("express");

const router = express.Router();

const {
    insertBook,
    insertManyBooks,
    insertLog,
    updateBook,
    findBookByTitle,
    findBooksByYear,
    findBooksByGenre,
    skipLimitBooks,
    findIntegerYears,
    excludeGenres,
    deleteBooksBeforeYear,
    aggregate1,
    aggregate2,
    aggregate3,
    aggregate4
} = require("../controllers/bookController");

router.post("/", insertBook);
router.post("/batch", insertManyBooks);

router.post("/logs", insertLog);

router.patch("/:title", updateBook);

router.get("/title", findBookByTitle);
router.get("/year", findBooksByYear);
router.get("/genre", findBooksByGenre);
router.get("/skip-limit", skipLimitBooks);
router.get("/year-integer", findIntegerYears);
router.get("/exclude-genres", excludeGenres);

router.delete("/before-year", deleteBooksBeforeYear);

router.get("/aggregate1", aggregate1);
router.get("/aggregate2", aggregate2);
router.get("/aggregate3", aggregate3);
router.get("/aggregate4", aggregate4);

module.exports = router;
