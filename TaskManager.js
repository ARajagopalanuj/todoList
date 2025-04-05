const express = require("express");
const app = express();
const con = require("./database");
const cors = require("cors");

const port = 3000;

app.use(express.json());
app.use(cors());


app.get("/getAll", async (req, res) => {
    try {
        const result = await con.query("SELECT * FROM todoList");
        res.json(result.rows);
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});

app.get("/searchTask", async (req, res) => {
    try {
        const { task } = req.query;
        const result = await con.query("SELECT * FROM todoList WHERE task ILIKE $1", [`%${task}%`]);
        res.json(result.rows);
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.get("/getComp", async (req, res) => {
    try {
        const result = await con.query("SELECT * FROM todoList WHERE status='Completed'");
        res.json(result.rows);
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.get("/getPend", async (req, res) => {
    try {
        const result = await con.query("SELECT * FROM todoList WHERE status='Pending'");
        res.json(result.rows);
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.get("/getSkip", async (req, res) => {
    try {
        const result = await con.query("SELECT * FROM todoList WHERE status='Skipped'");
        res.json(result.rows);
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.post("/addData", async (req, res) => {
    try {
        const { task } = req.body;
        const result = await con.query(
            "INSERT INTO todoList (task, status, entry_date, entry_time) VALUES ($1, 'Pending', CURRENT_DATE, CURRENT_TIME) RETURNING *",
            [task]
        );
        res.json({ status: "Task Added", task: result.rows[0] });
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.put("/startTask", async (req, res) => {
    try {
        const { id } = req.body;
        await con.query("UPDATE todoList SET start_time = CURRENT_TIME WHERE id = $1", [id]);
        res.json({ status: "Task Started" });
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.put("/updateData", async (req, res) => {
    try {
        const { id } = req.body;
        await con.query(
            "UPDATE todoList SET status='Completed', complete_time=CURRENT_TIME WHERE id=$1",
            [id]
        );
        res.json({ status: "Task Updated", complete_time: new Date().toLocaleTimeString() });
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.put("/skipData", async (req, res) => {
    try {
        const { id } = req.body;
        await con.query("UPDATE todoList SET status='Skipped' WHERE id=$1", [id]);
        res.json({ status: "Task Skipped" });
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});


app.delete("/deleteData", async (req, res) => {
    try {
        const { id } = req.body;
        await con.query("DELETE FROM todoList WHERE id=$1", [id]);
        res.json({ status: "Task Deleted" });
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
