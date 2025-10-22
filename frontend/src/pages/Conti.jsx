import { useState, useEffect } from "react";

export default function Conti() {
  const [accounts, setAccounts] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({ client_id: "", balance: "" });
  const [editing, setEditing] = useState(null);

  const fetchAccounts = async () => {
    const res = await fetch("http://localhost:8080/api/accounts");
    const data = await res.json();
    setAccounts(data);
  };

  const fetchClients = async () => {
    const res = await fetch("http://localhost:8080/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    fetchAccounts();
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await fetch(`http://localhost:8080/api/accounts/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditing(null);
    } else {
      await fetch("http://localhost:8080/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ client_id: "", balance: "" });
    fetchAccounts();
  };

  const handleEdit = (account) => {
    setEditing(account.id);
    setForm({ client_id: account.client_id, balance: account.balance });
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/accounts/${id}`, {
      method: "DELETE",
    });
    fetchAccounts();
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ client_id: "", balance: "" });
  };

  return (
    <div>
      <h2>Conti Correnti</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={form.client_id}
          onChange={(e) => setForm({ ...form, client_id: e.target.value })}
          required
        >
          <option value="">Scegli cliente...</option>
          {clients.map((cl) => (
            <option key={cl.id} value={cl.id}>
              {cl.first_name} {cl.last_name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Saldo"
          min={0}
          value={form.balance}
          onChange={(e) => setForm({ ...form, balance: e.target.value })}
          required
        />
        <button type="submit">{editing ? "Modifica" : "Aggiungi"}</button>
        {editing && (
          <button type="button" onClick={handleCancel}>
            Annulla
          </button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>ID Conto</th>
            <th>Numero Conto</th>
            <th>Cliente</th>
            <th>Saldo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id}>
              <td>{acc.id}</td>
              <td>{acc.account_number}</td>
              <td>
                {acc.first_name} {acc.last_name}
              </td>
              <td>{acc.balance} €</td>
              <td>
                <button onClick={() => handleEdit(acc)}>Modifica</button>
                <button onClick={() => handleDelete(acc.id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
