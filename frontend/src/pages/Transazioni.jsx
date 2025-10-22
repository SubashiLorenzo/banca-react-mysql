import { useState, useEffect } from "react";

export default function Transazioni() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    from_account_id: "",
    to_account_id: "",
    amount: "",
    description: "",
  });

  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:8080/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const fetchAccounts = async () => {
    const res = await fetch("http://localhost:8080/api/accounts");
    const data = await res.json();
    setAccounts(data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8080/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      from_account_id: "",
      to_account_id: "",
      amount: "",
      description: "",
    });
    fetchTransactions();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  return (
    <div>
      <h2>Transazioni</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={form.from_account_id}
          onChange={(e) =>
            setForm({ ...form, from_account_id: e.target.value })
          }
          required
        >
          <option value="">Da conto...</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.account_number} - {acc.first_name} {acc.last_name}
            </option>
          ))}
        </select>
        <select
          value={form.to_account_id}
          onChange={(e) => setForm({ ...form, to_account_id: e.target.value })}
          required
        >
          <option value="">A conto...</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.account_number} - {acc.first_name} {acc.last_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Importo"
          min={0}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Causale"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Aggiungi Transazione</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Da</th>
            <th>A</th>
            <th>Importo</th>
            <th>Causale</th>
            <th>Data</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tr) => (
            <tr key={tr.id}>
              <td>{tr.id}</td>
              <td>{tr.from_account_id}</td>
              <td>{tr.to_account_id}</td>
              <td>{tr.amount} €</td>
              <td>{tr.description}</td>
              <td>{tr.transaction_date}</td>
              <td>
                <button onClick={() => handleDelete(tr.id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
