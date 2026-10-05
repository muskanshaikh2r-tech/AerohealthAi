cd "C:\Users\AVANTI KULAT\Aerohealth AI\frontend\aerohealth-ai"

@'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'@ | Set-Content -Encoding UTF8 ".\src\main.jsx"

npm run dev