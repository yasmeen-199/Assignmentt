
const express = require("express");

const router = express.Router();

const {
    insertLog
} = require("../controllers/bookController");

router.post("/", insertLog);

module.exports = router;
