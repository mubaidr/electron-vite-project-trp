<<<<<<< Updated upstream
import { useState } from "react"
import UpdateElectron from "@/components/update"
import logoVite from "./assets/logo-vite.svg"
import logoElectron from "./assets/logo-electron.svg"
import "./App.css"

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      <div className="logo-box">
        <a
          href="https://github.com/electron-vite/electron-vite-react"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            src={logoVite}
            className="logo vite"
            alt="Electron + Vite logo"
          />
          <img
            src={logoElectron}
            className="logo electron"
            alt="Electron + Vite logo"
          />
        </a>
      </div>
      <h1>Electron + Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Electron + Vite logo to learn more
      </p>
      <div className="flex-center">
        Place static files into the<code>/public</code> folder{" "}
        <img style={{ width: "5em" }} src="./node.svg" alt="Node logo" />
      </div>
=======
import { useEffect, useState } from "react";
import UpdateElectron from "@/components/update";
import logoVite from "./assets/logo-vite.svg";
import logoElectron from "./assets/logo-electron.svg";
import "./App.css";

function App() {
  const [domain, setDomain] = useState("shahidmaqbool.com");
  const [keywords, setKeywords] = useState(["seo expert in dubai", "seo"]);
>>>>>>> Stashed changes

  const [checking, setChecking] = useState(false);

  const [rankings, setRanking] = useState([]);

  async function getRankings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChecking(true);
    window.ipcRenderer.send("get-rankings", domain, keywords);
  }

  async function getRedirectChain() {
    window.ipcRenderer
      .invoke("get-redirectChain", [
        "https://shahidmaqbool.com/",
        "https://www.arabian-adventures.com/",
      ])
      .then((res) => {
        console.log({ res });
      });
  }

  useEffect(() => {
    window.ipcRenderer.on("get-rankings", (e, ...args) => {
      console.log(args);
      setRanking(args[0]);
      setChecking(false);
    });
  }, []);

  return (
    <div className="App w-full p-8 font-sans">
      <h1>Rank Checker</h1>

      {rankings?.length > 0 && (
        <div className="flex flex-col">
          {rankings.map((r, i) => (
            <h2 key={i}>
              Ranking of "{keywords[i]}" : {r}
            </h2>
          ))}
        </div>
      )}

      <form
        onSubmit={getRankings}
        className="flex flex-col gap-2 w-full max-w-lg"
      >
        <div className="flex gap-2">
          <label htmlFor="domain">Domain</label>
          <input
            onChange={(e) => setDomain(e.target.value)}
            value={domain}
            required
            type="text"
            placeholder="domain.com"
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="keywords">Keywords</label>
          <input
            required
            value={keywords.join(",")}
            onChange={(e) => setKeywords(e.target.value.split(","))}
            type="text"
            placeholder="Keyword"
          />
        </div>
        <button disabled={checking} className="p-1" type="submit">
          {checking ? "Checking ..." : "Get Ranking"}
        </button>
      </form>
      <button onClick={getRedirectChain}>Get Redirect Chain</button>
    </div>
  );
}

<<<<<<< Updated upstream
export default App
=======
export default App;
>>>>>>> Stashed changes
