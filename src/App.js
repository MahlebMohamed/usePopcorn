// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useState, useEffect } from "react";

export default function App() {
  const [left, setleft] = useState("EUR");
  const [right, setRight] = useState("USD");
  const [argent, setArgent] = useState(100);
  const [result, setResult] = useState(0);

  useEffect(function () {
    fetch(`https://api.frankfurter.app/latest?amount=${argent}&from=${left} `)
      .then(resp => resp.json())
      .then((data) => {

        switch (right) {
          case 'USD':
            setResult(data.rates.USD);
            break;
          case 'EUR':
            setResult(data.rates.EUR);
            break;
          case 'CAD':
            setResult(data.rates.CAD);
            break;
          case 'INR':
            setResult(data.rates.INR);
            break;

          default:
            setResult(0);
            break;
        }

      });
  }, [left, right, argent]);

  return (
    <div>
      <input
        type="text"
        value={argent}
        onChange={(e) => setArgent(e.target.value)}
      />
      <select value={left} onChange={(e) => setleft(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select value={right} onChange={(e) => setRight(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{result}</p>
    </div>
  );
}
