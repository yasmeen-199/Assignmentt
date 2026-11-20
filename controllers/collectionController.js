
const { getDB } = require("../config/database");

const createBooksCollection = async (req, res) => {
    try {
        const db = getDB();

        await db.createCollection("books", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title"],
                    properties: {
                        title: {
                            bsonType: "string",
                            minLength: 1,
                            pattern: ".*\\S.*"
                        }
                    }
                }
            },
            validationLevel: "strict",
            validationAction: "error"
        });

        res.status(200).json({ ok: 1 });

    } catch (error) {
        if (error.code === 48) {
            return res.status(200).json({ ok: 1 });
        }

        res.status(500).json({ message: error.message });
    }
};

const createAuthorsCollection = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("authors").insertOne(req.body);

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createLogsCollection = async (req, res) => {
    try {
        const db = getDB();

        await db.createCollection("logs", {
            capped: true,
            size: 1048576
        });

        res.status(200).json({ ok: 1 });

    } catch (error) {
        if (error.code === 48) {
            return res.status(200).json({ ok: 1 });
        }

        res.status(500).json({ message: error.message });
    }
};

const createBooksIndex = async (req, res) => {
    try {
        const db = getDB();

        const result = await db.collection("books").createIndex({
            title: 1
        });

        res.status(200).send(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooksCollection,
    createAuthorsCollection,
    createLogsCollection,
    createBooksIndex
};
