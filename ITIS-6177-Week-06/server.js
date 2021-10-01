const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition: {
        info: {
            title: "Zeke's Example API",
            version: "1.0.0",
            description: "An example API written in Express with Swagger documentation"
        },
        host: '147.182.214.176:3000',
        basePath: '/',
    },
    apis: ['./server.js']
};

const specs = swaggerJsdoc(options);

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

async function GetMaxID(table, column) {
    const query = `SELECT ${column} as id FROM ${table}`;
    const ids = await queryDB(query);
    var maxID = 0
    for (i = 0; i < ids.length; i++) {
        if (Number(ids[i].id) > maxID) {
            maxID = Number(ids[i].id);
        }
    }
    console.log(ids, "max:", maxID);
    return maxID
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({ origin: ['147.182.214.176:3000'] }));


app.get('/say', (req, res) => {
    console.log(req.params)
    if (req.params.keyword) {
        axios.get('https://zekesays.azurewebsites.net/api/SayZeke?code=kjsPXszk5bCXAk90w2a0F7MHpFr8B9enYWssUhIoTEpg3T7DtTxwgQ==',
            {
                data: {
                    keyword: req.params.keyword,
                },
            }
        )
            .then(received => res.send(received.body))
            .catch(err => {
                res.statusCode = err.status
                res.send(err);
            })
    } else {
        res.statusCode = 400;
        res.send("'keyword' is not defined in query parameters")
    }

});

/**
 * @swagger
 * /api/v1/agents:
 *     get:
 *       tags:
 *       - "agents"
 *       summary: Return all agents
 *       description: Return all agents
 *       produces:
 *       - application/json
 *       responses:
 *         200:
 *           description: OK
 */
app.get('/api/v1/agents', async (req, res) => {
    const rows = await queryDB("SELECT * FROM agents")
    res.json(rows);
});

/**
 * @swagger
 * /api/v1/agents/{agentCode}:
 *   get:
 *     tags:
 *     - "agents"
 *     summary: Return the agent with the specific agent code.
 *     description: Return the agent with the specific agent code with all of its properties populated.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json
 *       400:
 *         description: Bad Request
 *     parameters:
 *       - in: path
 *         name: agentCode
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Agent Code
 */
app.get('/api/v1/agents/:agentCode', async (req, res) => {
    const agentCode = req.params.agentCode
    if (!agentCode) {
        res.status = 400;
        res.json({ "error": "id cannot be empty" })
    }
    const rows = await queryDB(`SELECT * FROM agents WHERE AGENT_CODE = '${agentCode}  '`)
    res.json(rows);
});

/**
 * @swagger
 * /api/v1/foods:
 *     get:
 *       tags:
 *       - "foods"
 *       description: Return all foods
 *       summary: Return all foods with all of their properties populated
 *       produces:
 *       - application/json
 *       responses:
 *         200:
 *           description: OK
 */
app.get('/api/v1/foods', async (req, res) => {
    const rows = await queryDB("SELECT * FROM foods")
    res.json(rows);
});

/**
 * @swagger
 * /api/v1/foods/{id}:
 *   get:
 *     tags:
 *     - "foods"
 *     description: Return the food with the specified food item id.
 *     summary: Return the food with the specified food item id. Error occurs if id is not a valid integer.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: A food object with the specified item id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The food ITEM_ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             name:
 *               type: string
 *             unit:
 *               type: string
 *             company:
 *               type: string
 */
app.get('/api/v1/foods/:id', async (req, res) => {
    const itemID = req.params.id
    if (!itemID) {
        res.status = 400;
        res.json({ "error": "id cannot be empty" })
    }
    try {
        id = Number(id);
    } catch (e) {
        result = { "error": "id should be a number" };
        res.status = 400;
        res.json(result);
    }
    const rows = await queryDB(`SELECT * FROM foods WHERE ITEM_ID = '${itemID}'`)
    res.json(rows);
});

/**
 * @swagger
 * /api/v1/foods:
 *   post:
 *     tags:
 *     - "foods"
 *     summary: Create a new food item
 *     description: Create a new food item with the specified "name", "unit", and "company" (company ID). The ITEM ID will be automatically set to the next highest ID.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A response object with the 'created' field populated with the food object that was created.
 *       400:
 *         description: An error message indicating why the requst failed. ID cannot be empty and must be an integer.
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Pet object that needs to be added to the store"
 *       required: true
 *       schema:
 *         properties:
 *           name:
 *             type: string
 *             example: Crackers
 *           unit:
 *             type: string
 *             example: Pcs
 *           company:
 *             type: string
 *             example: 15
 */
app.post('/api/v1/foods', async (req, res) => {
    var food = req.body
    var result = { "error": "not all of the required parameters ('name','unit', & 'company') are provided" };
    //validate that request has all required parameters
    let id = await GetMaxID('foods', 'ITEM_ID')
    try {
        id = Number(id);
    } catch (e) {
        result = { "error": "id should be a number" };
        res.status = 400;
        res.json(result);
    }
    food.id = Number(id) + 1
    if (food.name && food.unit && food.company) {
        result = await queryDB(`INSERT INTO foods (ITEM_ID, ITEM_NAME, ITEM_UNIT, COMPANY_ID) VALUES ('${food.id}', '${food.name}', '${food.unit}', '${food.company}')`)
    }
    if (result["affectedRows"] > 0) {
        result = {
            "created": food, "links": { "self": `http://147.182.214.176:3000/api/v1/foods/${food.id}` }
        };
    }
    res.json(result);
});

/**
 * @swagger
 * /api/v1/foods/{id}:
 *   put:
 *     tags:
 *     - "foods"
 *     summary: Update or Create an entire food item
 *     description: Update a food item with the specified "name", "unit", and "company" (company ID). All fields are expected in the body, otherwise the request will fail. If the id does not exist, a new food item will be created.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A response object with the 'replaced' field populated with the food object that was created.
 *       400:
 *         description: An error describing why the request was bad or failed. id must be a number and all parameters must be populated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The food ITEM_ID    
 *       - in: "body"
 *         name: "body"
 *         description: "Pet object that needs to be added to the store"
 *         required: true
 *         schema:
 *           properties:
 *             name:
 *               type: string
 *               example: Crackers
 *             unit:
 *               type: string
 *               example: Pcs
 *             company:
 *               type: string
 *               example: 15
 */
app.put('/api/v1/foods/:id', async (req, res) => {
    var food = req.body
    food.id = req.params.id;
    if (!food.id) {
        res.status = 400;
        res.json({ "error": "id cannot be empty" })
    }
    try {
        food.id = Number(food.id);
    } catch (e) {
        result = { "error": "id should be a number" };
        res.status = 400;
        res.json(result);
    }
    var result = { "error": "not all of the required parameters ('name','unit', & 'company') are provided" };
    //validate that request has all required parameters
    if (food.name && food.unit && food.company) {
        const rows = await queryDB(`SELECT * FROM foods WHERE ITEM_ID = '${req.params.id}'`)
        if (rows.length > 0) {
            result = await queryDB(`REPLACE INTO foods (ITEM_ID, ITEM_NAME, ITEM_UNIT, COMPANY_ID) VALUES ('${food.id}', '${food.name}', '${food.unit}', '${food.company}')`)
        } else {
            let id = await GetMaxID('foods', 'ITEM_ID')
            try {
                id = Number(id);
            } catch (e) {
                result = { "error": "id should be a number" };
                res.status = 400;
                res.json(result);
            }
            food.id = Number(id) + 1
            if (food.name && food.unit && food.company) {
                result = await queryDB(`INSERT INTO foods (ITEM_ID, ITEM_NAME, ITEM_UNIT, COMPANY_ID) VALUES ('${food.id}', '${food.name}', '${food.unit}', '${food.company}')`)
            }
            if (result["affectedRows"] > 0) {
                result = {
                    "created": food, "links": { "self": `http://147.182.214.176:3000/api/v1/foods/${food.id}` }
                };
            }
            res.json(result);
        }

    }
    if (result["affectedRows"] > 0) {
        result = {
            "replaced": food, "links": { "self": `http://147.182.214.176:3000/api/v1/foods/${food.id}` }
        };
    }
    res.json(result);
});

/**
 * @swagger
 * /api/v1/foods/{id}:
 *   patch:
 *     tags:
 *     - "foods"
 *     summary: Update a food item
 *     description: Update a food item with the specified "name", "unit", and/or "company" (company ID). At least one of the fields is expected in the body, but only fields the fields that should be updated need to be included.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A response object with the 'updated' field populated with the food object that was updated.
 *       400:
 *         description: An error with a message indicating why the request failed. The id should be a number & at least one parameter should be populated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The food ITEM_ID    
 *       - in: "body"
 *         name: "body"
 *         description: "Pet object that needs to be added to the store"
 *         required: true
 *         schema:
 *           properties:
 *             name:
 *               type: string
 *               example: Crackers
 *             unit:
 *               type: string
 *               example: Pcs
 *             company:
 *               type: string
 *               example: 15
 */
app.patch('/api/v1/foods/:id', async (req, res) => {
    var food = req.body
    food.id = req.params.id;
    if (!food.id) {
        res.status = 400;
        res.json({ "error": "id cannot be empty" })
    }
    try {
        food.id = Number(food.id);
    } catch (e) {
        result = { "error": "id should be a number" };
        res.status = 400;
        res.json(result);
    }
    var result = { "error": "at least one of the parameters ('name','unit', & 'company') are required" };
    //validate that request has all required parameters
    if (food.name || food.unit || food.company) {
        const rows = await queryDB(`SELECT * FROM foods WHERE ITEM_ID = '${food.id}'`)
        if (rows.length > 0) {
            food.name = food.name ? food.name : rows[0]["ITEM_NAME"]
            food.unit = food.unit ? food.unit : rows[0]["ITEM_UNIT"]
            food.company = food.company ? food.company : rows[0]["COMPANY_ID"]
            result = await queryDB(`UPDATE foods SET ITEM_NAME='${food.name}', ITEM_UNIT='${food.unit}', COMPANY_ID='${food.company}' WHERE ITEM_ID=${food.id}`)
        } else {
            result = { "error": "the provided id does not exist" }
            res.status = 400;
        }

    }
    if (result["affectedRows"] > 0) {
        result = {
            "replaced": food, "links": { "self": `http://147.182.214.176:3000/api/v1/foods/${food.id}` }
        };
    }
    res.json(result);
});

/**
 * @swagger
 * /api/v1/foods/{id}:
 *   delete:
 *     tags:
 *     - "foods"
 *     summary: Delete a food item
 *     description: Delete a specified food item with the given food item id.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A response object with the 'deleted' field populated with the id of the food object that was deleted.
 *       400:
 *         description: An error with a message indicating why the request failed. The id should be a number.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The food ITEM_ID
 */
app.delete('/api/v1/foods/:id', async (req, res) => {
    var food = req.body
    food.id = req.params.id;
    if (!food.id) {
        res.status = 400;
        res.json({ "error": "id cannot be empty" })
    }
    try {
        food.id = Number(food.id);
    } catch (e) {
        result = { "error": "id should be a number" };
        res.status = 400;
        res.json(result);
    }
    var result = await queryDB(`DELETE FROM foods WHERE ITEM_ID = '${food.id}'`)
    if (result["affectedRows"] > 0) {
        result = {
            "deleted": food, "links": { "self": `http://147.182.214.176:3000/api/v1/foods` }
        };
    }
    res.json(result);
});

/**
 * @swagger
 * /api/v1/orders:
 *     get:
 *       tags:
 *       - "orders"
 *       summary: Return all orders
 *       description: Return all orderd
 *       produces:
 *        - application/json
 *       responses:
 *         200:
 *           description: List of orders with all of their properties
 */
app.get('/api/v1/orders', async (req, res) => {
    const rows = await queryDB("SELECT * FROM orders")
    res.json(rows);
});


/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     tags:
 *     - "orders"
 *     summary: Return the specified order with the specific order number.
 *     description: Return the order with the specific with the specific order number with all of its properties populated.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order Num
 */
app.get('/api/v1/orders/:id', async (req, res) => {
    const orderNum = req.params.id
    if (!orderNum) {
        res.status = 400;
        res.json({ "error": "id cannot be empty" })
    }
    const rows = await queryDB(`SELECT * FROM orders WHERE ORD_NUM = '${orderNum}'`)
    res.json(rows);
});


app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});