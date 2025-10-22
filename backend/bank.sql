DROP DATABASE IF EXISTS bank_db;
CREATE DATABASE bank_db;
USE bank_db;

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  date_of_birth DATE
);

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  balance DECIMAL(15, 2),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_account_id INT,
  to_account_id INT,
  amount DECIMAL(15, 2),
  description VARCHAR(255),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

INSERT INTO clients (first_name, last_name, date_of_birth) VALUES
('Mario', 'Rossi', '1990-01-01'),
('Luigi', 'Verdi', '1991-02-02'),
('Sandro', 'Bianchi', '1992-03-03');

INSERT INTO accounts (client_id, balance) VALUES
(1, 5000),
(1, 10000),
(2, 3500);
