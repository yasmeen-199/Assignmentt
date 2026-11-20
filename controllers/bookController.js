
const { getDB } = require("../config/database");
const { ObjectId } = require("mongodb");

const insertBook = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").insertOne(req.body);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const insertManyBooks = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").insertMany(req.body);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const insertLog = async (req, res) => {
    try {
        const db = getDB();

        const logData = { ...req.body };

        if (
            typeof logData.book_id === "string" &&
            ObjectId.isValid(logData.book_id)
        ) {
            logData.book_id = new ObjectId(logData.book_id);
        }

        const result = await db.collection("logs").insertOne(logData);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").updateOne(
            { title: req.params.title },
            { $set: { year: 2022 } }
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findBookByTitle = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").findOne({
            title: req.query.title
        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findBooksByYear = async (req, res) => {
    try {
        const db = getDB();

        const from = Number(req.query.from);
        const to = Number(req.query.to);

        const result = await db.collection("books")
            .find({
                year: {
                    $gte: from,
                    $lte: to
                }
            })
            .project({ _id: 0 })
            .toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findBooksByGenre = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books")
            .find({
                genres: req.query.genre
            })
            .project({ _id: 0 })
            .toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const skipLimitBooks = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books")
            .find({})
            .sort({ year: -1 })
            .skip(2)
            .limit(3)
            .toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findIntegerYears = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books")
            .find({
                year: { $type: "int" }
            })
            .toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const excludeGenres = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books")
            .find({
                genres: {
                    $nin: ["Horror", "Science Fiction"]
                }
            })
            .toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBooksBeforeYear = async (req, res) => {
    try {
        const db = getDB();

        const year = Number(req.query.year);

        const result = await db.collection("books").deleteMany({
            year: { $lt: year }
        });

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Question 16: Aggregation Match And Sort
const aggregate1 = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").aggregate([
            {
                $match: {
                    year: { $gt: 2000 }
                }
            },
            {
                $sort: {
                    year: -1
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    author: 1,
                    year: 1,
                    genres: 1
                }
            }
        ]).toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const aggregate2 = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").aggregate([
            {
                $match: {
                    year: { $gt: 2000 }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    author: 1,
                    year: 1
                }
            }
        ]).toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const aggregate3 = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").aggregate([
            {
                $unwind: "$genres"
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    genres: 1
                }
            }
        ]).toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const aggregate4 = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("logs").aggregate([
            {
                $addFields: {
                    bookObjectId: {
                        $convert: {
                            input: "$book_id",
                            to: "objectId",
                            onError: null,
                            onNull: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "bookObjectId",
                    foreignField: "_id",
                    as: "book_details"
                }
            },
            {
                $project: {
                    _id: 0,
                    action: 1,
                    book_details: {
                        $map: {
                            input: "$book_details",
                            as: "book",
                            in: {
                                title: "$$book.title",
                                author: "$$book.author",
                                year: "$$book.year"
                            }
                        }
                    }
                }
            }
        ]).toArray();

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
