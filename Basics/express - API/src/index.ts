import express from 'express';
import dotenv from 'dotenv';
import { getPool } from './db/config';

const app = express()

dotenv.config();

app.use(express.json())

app.get('/', (_, res) => {
    res.send("Hello, your API is running, this is the root path")
});

app.get('/api', (_, res) => {
    res.send("your API route")
});

app.get('/users', (req, res) => {
    getPool().then(pool => {
        return pool.request().query('SELECT * FROM Users');
    }).then(result => {
        res.json(result.recordset)
    }).catch(err => {
        console.log("SQL Error", err)
        res.status(500).send("Server error")
    });
})

app.get('/todos', (req, res) => {
    getPool().then(pool => {
        return pool.request().query('SELECT * FROM Todos');
    }).then(result => {
        res.json(result.recordset)
    }).catch(err => {
        console.log("SQL Error", err)
        res.status(500).send("Server error")
    });
})

app.get('/comments', (req, res) => {
    getPool().then(pool => {
        return pool.request().query('SELECT * FROM Comments');
    }).then(result => {
        res.json(result.recordset)
    }).catch(err => {
        console.log("SQL Error", err)
        res.status(500).send("Server error")
    });
})


const port = 8000;
app.listen(port, () => {
    console.log(`Your Server is running on port ${port}`)
})

getPool()
    .then(() => console.log("Db connected"))
    .catch((err: any) => console.log("DB failed to connect"));