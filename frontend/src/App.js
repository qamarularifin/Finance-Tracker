import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Plot from "react-plotly.js";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/expenses")
      .then((response) => {
        console.log(response.data);
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const sortedExpenses = React.useMemo(() => {
    let sortableExpenses = [...expenses];
    if (sortConfig !== null) {
      sortableExpenses.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableExpenses;
  }, [expenses, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const chartData = [
    {
      x: sortedExpenses.map((expense) => expense.Date),
      y: sortedExpenses.map((expense) => expense.Cost),
      type: "bar",
    },
  ];

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>
              <button type="button" onClick={() => requestSort("Date")}>
                Date
              </button>
            </th>
            <th>
              <button type="button" onClick={() => requestSort("Description1")}>
                Description 1
              </button>
            </th>
            <th>
              <button type="button" onClick={() => requestSort("Description2")}>
                Description 2
              </button>
            </th>
            <th>
              <button type="button" onClick={() => requestSort("Cost")}>
                Cost
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((expense) => (
            <tr key={expense.ID}>
              <td>{expense.Date}</td>
              <td>{expense.Description1}</td>
              <td>{expense.Description2}</td>
              <td>${expense.Cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Plot
        data={chartData}
        layout={{ width: 800, height: 400, title: "Expense Chart" }}
      />
    </div>
  );
}

export default App;
