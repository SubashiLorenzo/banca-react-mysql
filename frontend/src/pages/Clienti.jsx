import { useState, useEffect } from "react";

export default function Clienti() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
  });
  const [editing, setEditing] = useState(null);

  const fetchClients = async () => {
    const res = await fetch("http://localhost:8080/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await fetch(`http://localhost:8080/api/clients/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditing(null);
    } else {
      await fetch("http://localhost:8080/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ first_name: "", last_name: "", date_of_birth: "" });
    fetchClients();
  };

  const handleEdit = (client) => {
    setEditing(client.id);
    setForm({
      first_name: client.first_name,
      last_name: client.last_name,
      date_of_birth: client.date_of_birth,
    });
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/clients/${id}`, {
      method: "DELETE",
    });
    fetchClients();
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ first_name: "", last_name: "", date_of_birth: "" });
  };

  return (
    <div>
      <h2>Clienti</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Cognome"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.date_of_birth}
          onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
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
            <th>ID</th>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Data Nascita</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.first_name}</td>
              <td>{c.last_name}</td>
              <td>{c.date_of_birth}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Modifica</button>
                <button onClick={() => handleDelete(c.id)}>Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
