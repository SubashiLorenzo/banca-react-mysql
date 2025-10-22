import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const port = 8080;
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank_db",
});

db.connect((err) => {
  if (err) console.error("Errore connessione DB:", err);
  else console.log("Connesso al database");
});

app.get("/api/clients", (req, res) => {
  const sql = "SELECT * FROM clients";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/api/clients", (req, res) => {
  const { first_name, last_name, date_of_birth } = req.body;
  const sql =
    "INSERT INTO clients (first_name, last_name, date_of_birth) VALUES (?, ?, ?)";
  db.query(sql, [first_name, last_name, date_of_birth], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, first_name, last_name, date_of_birth });
  });
});

app.put("/api/clients/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth } = req.body;
  const sql =
    "UPDATE clients SET first_name = ?, last_name = ?, date_of_birth = ? WHERE id = ?";
  db.query(sql, [first_name, last_name, date_of_birth, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cliente aggiornato" });
  });
});

app.delete("/api/clients/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM clients WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cliente eliminato" });
  });
});

app.get("/api/accounts", (req, res) => {
  const sql =
    "SELECT a.id, a.client_id, a.balance, c.first_name, c.last_name FROM accounts a JOIN clients c ON a.client_id = c.id";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    const accounts = data.map((acc) => ({
      ...acc,
      account_number: "1000" + acc.id,
    }));
    res.json(accounts);
  });
});

app.get("/api/accounts/:id", (req, res) => {
  const sql =
    "SELECT a.id, a.client_id, a.balance, c.first_name, c.last_name FROM accounts a JOIN clients c ON a.client_id = c.id WHERE a.id = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data[0]) {
      data[0].account_number = "1000" + data[0].id;
    }
    res.json(data[0]);
  });
});

app.post("/api/accounts", (req, res) => {
  const { client_id, balance } = req.body;
  const sql = "INSERT INTO accounts (client_id, balance) VALUES (?, ?)";
  db.query(sql, [client_id, balance || 0], (err, result) => {
    if (err) return res.status(500).json(err);
    const account_number = "1000" + result.insertId;
    res.json({
      id: result.insertId,
      account_number,
      client_id,
      balance: balance || 0,
    });
  });
});

app.put("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;
  const sql = "UPDATE accounts SET balance = ? WHERE id = ?";
  db.query(sql, [balance, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Conto aggiornato" });
  });
});

app.delete("/api/accounts/:id", (req, res) => {
  const { id } = req.params;
  const deleteTrans =
    "DELETE FROM transactions WHERE from_account_id = ? OR to_account_id = ?";
  db.query(deleteTrans, [id, id], (err1) => {
    if (err1) return res.status(500).json(err1);
    const deleteAcc = "DELETE FROM accounts WHERE id = ?";
    db.query(deleteAcc, [id], (err2) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: "Conto eliminato" });
    });
  });
});

app.get("/api/transactions", (req, res) => {
  const sql = "SELECT * FROM transactions ORDER BY transaction_date DESC";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.get("/api/transactions/:accountId", (req, res) => {
  const { accountId } = req.params;
  const sql =
    "SELECT * FROM transactions WHERE from_account_id = ? OR to_account_id = ? ORDER BY transaction_date DESC";
  db.query(sql, [accountId, accountId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/api/transactions", (req, res) => {
  const { from_account_id, to_account_id, amount, description } = req.body;
  const sql =
    "INSERT INTO transactions (from_account_id, to_account_id, amount, description) VALUES (?, ?, ?, ?)";
  db.query(
    sql,
    [from_account_id, to_account_id, amount, description],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM transactions WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Transazione eliminata" });
  });
});

app.listen(port, () => console.log(`Server avviato sulla porta ${port}`));
