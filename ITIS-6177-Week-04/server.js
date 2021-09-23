const express = require('express');
const mariadb = require('mariadb');
const path = require('path');

const app = express();
const port = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 5
});


async function queryDB(queryString) {
    console.log("Attempting to query: " + queryString);
    let conn;
    let ret;
    try {
        //connect to database
        conn = await pool.getConnection();
        //perform the request that you need (SQL)
        const rows = await conn.query(queryString);
        // rows: [ {val: 1}, meta: ...
        ret = rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
    return ret;
}
app.get('/api/v1/agents', async (req, res) => {
    const rows = await queryDB("SELECT * FROM agents")
    res.json(rows);
});

app.get('/api/v1/agents/:agentCode', async (req, res) => {
    const agentCode = req.params.agentCode
    const rows = await queryDB(`SELECT * FROM agents WHERE AGENT_CODE = '${agentCode}  '`)
    res.json(rows);
});

app.get('/api/v1/foods', async (req, res) => {
    const rows = await queryDB("SELECT * FROM foods")
    res.json(rows);
});

app.get('/api/v1/foods/:id', async (req, res) => {
    const itemID = req.params.id
    const rows = await queryDB(`SELECT * FROM foods WHERE ITEM_ID = '${itemID}'`)
    res.json(rows);
});

app.get('/api/v1/orders', async (req, res) => {
    const rows = await queryDB("SELECT * FROM orders")
    res.json(rows);
});

app.get('/api/v1/orders/:id', async (req, res) => {
    const orderNum = req.params.id
    const rows = await queryDB(`SELECT * FROM orders WHERE ORD_NUM = '${orderNum}'`)
    res.json(rows);
});


app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});