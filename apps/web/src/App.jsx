import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  async function handleClick() {
    const response = await fetch("/api");
    const data = await response.json();

    setMessage(data.message);
  }

  return (
    <div>
      <h1>Quick Bite</h1>
      <button onClick={handleClick}>Click me</button>

      <p>{message}</p>
    </div>
  );
}

export default App;
