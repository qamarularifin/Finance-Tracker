import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Plot from "react-plotly.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "ascending",
  });
  const [selectedDate, setSelectedDate] = useState(null); // Update initial state to null

  useEffect(() => {
    axios
      .get("http://localhost:3001/expenses")
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDateFilterChange = (date) => {
    setSelectedDate(date);
  };

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((expense) => {
      return (
        !selectedDate || expense.date === selectedDate.toISOString() // Update comparison to ISO string
      );
    });
  }, [expenses, selectedDate]);

  const sortedExpenses = React.useMemo(() => {
    let sortableExpenses = [...filteredExpenses];
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
  }, [filteredExpenses, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const chartData = [
    {
      x: sortedExpenses.map((expense) => expense.date),
      y: sortedExpenses.map((expense) => expense.cost),
      type: "bar",
    },
  ];

  return (
    <div className="App">
      <h1>Expense Tracker</h1>

      <div>
        <label>
          Filter by Date:
          <DatePicker
            selected={selectedDate}
            onChange={handleDateFilterChange}
            dateFormat="yyyy-MM-dd"
          />
        </label>
      </div>

      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>
              <button type="button" onClick={() => requestSort("date")}>
                Date
              </button>
            </th>
            <th>
              <button type="button" onClick={() => requestSort("description1")}>
                Description 1
              </button>
            </th>
            <th>
              <button type="button" onClick={() => requestSort("description2")}>
                Description 2
              </button>
            </th>
            <th>
              <button type="button" onClick={() => requestSort("cost")}>
                Cost
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((expense) => (
            <tr key={expense.ID}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.description1}</td>
              <td>{expense.description2}</td>
              <td>${expense.cost}</td>
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
