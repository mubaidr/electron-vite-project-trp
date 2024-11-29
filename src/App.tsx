
import { useEffect, useState } from "react";
import UpdateElectron from "@/components/update";
import logoVite from "./assets/logo-vite.svg";
import logoElectron from "./assets/logo-electron.svg";
import "./App.css";

function App() {
  const [domain, setDomain] = useState("shahidmaqbool.com");
  const [keywords, setKeywords] = useState(["seo expert in dubai", "seo"]);

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

export default App;