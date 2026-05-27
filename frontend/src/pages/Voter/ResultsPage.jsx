import ElectionList from "../../components/voter/ElectionList";
import ResultAnalysis from "../../components/voter/ResultAnalysis";
import TopBar from "../../components/voter/TopBar";
import { elections } from "../../mock/data";

function ResultsPage() {
  return (
    <div className="min-h-screen">
      <TopBar page="Election Results" />
      <div className="mx-10">
        <ResultAnalysis />
        <ElectionList elections={elections} />
      </div>
    </div>
  );
}

export default ResultsPage;
