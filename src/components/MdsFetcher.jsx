import { useState, useRef } from "react";

import OutputSection from "./section/OutputSection";
import TokenSection from "./section/TokenSection";
import Papa from "papaparse";
import { jsonToCsvCounts, jsonToCsv } from "./convert/jsonToCsv";
import MdsButton from "./button/MdsButton";
import ColumnSelector from "./section/ColumnSelector";

export default function MdsFetcher() {
  // Input in uncontrolled to prevent re-renders
  const tokenInputRef = useRef(null);

  const [fetchedJson, setFetchedJson] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ remaining: 0, total: 0 });
  const [includedFields, setIncludedFields] = useState([]);

  const toggleField = (key) => {
    setIncludedFields((prev) =>
      prev.map((row) => {
        if (row.key === key) {
          return { ...row, include: !row.include };
        } else {
          return row;
        }
      })
    );
  };

  const selectAllFields = () => {
    setIncludedFields((prev) => prev.map((row) => ({ ...row, include: true })));
  };

  const deselectAllFields = () => {
    setIncludedFields((prev) =>
      prev.map((row) => ({ ...row, include: false }))
    );
  };

  const fetchData = async (resumeToken) => {
    const apiUrl = `https://mds-data-1.ciim.k-int.com/api/v1/extract?resume=${resumeToken}`;
    const joinedData = [];
    let currentData = await fetch(apiUrl).then((res) => res.json());
    joinedData.push(...currentData.data);

    setProgress({
      remaining: currentData.stats.remaining,
      total: currentData.stats.total,
    });

    let hasNext = currentData.has_next;
    while (hasNext) {
      const nextUrl = currentData.next_url;
      currentData = await fetch(nextUrl).then((res) => res.json());
      hasNext = currentData.has_next;

      setProgress({
        remaining: currentData.stats.remaining,
        total: currentData.stats.total,
      });

      joinedData.push(...currentData.data);
    }

    return joinedData;
  };

  const fetchNewData = () => {
    setFetchedJson("");
    const resumeToken = tokenInputRef.current.value;
    if (resumeToken) {
      setError("");
      fetchData(resumeToken)
        .then((data) => {
          setFetchedJson(data);
          setIncludedFields(jsonToCsvCounts(data));
        })
        .catch(() => {
          setError("Failed to fetch. Please check that the token is valid");
          setFetchedJson(null);
          setIncludedFields([]);
        });
      setError("");
    } else {
      setFetchedJson(null);
      setIncludedFields([]);
      setError("");
    }
  };

  // Convert json to csv at time of download, iff not already done for display
  const csvData = (simplify) => {
    if (simplify) {
      return jsonToCsv(fetchedJson, true);
    }

    const columns = includedFields
      .filter((row) => row.include)
      .map((field) => field.key);
    return jsonToCsv(fetchedJson, false, columns);
  };

  const downloadCsv = (simplify) => {
    const blob = new Blob([csvData(simplify)], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.download = `mds_data_${simplify ? "simple" : "full"}.csv`;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(fetchedJson)], { type: "text/json" });
    const link = document.createElement("a");
    link.download = "mds_data.json";
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadDisabled = !fetchedJson;

  return (
    <div className="flex flex-col p-10 gap-10 box-border">
      <div className="text-4xl font-bold">
        <span className="text-mdslime">MDS</span> Data Fetcher
      </div>

      <div>
        Source:{" "}
        <a
          href="https://github.com/Ex-Nihilo-Consult/mds-data-fetcher"
          target="_blank"
          className="hover:text-mdslime"
        >
          https://github.com/Ex-Nihilo-Consult/mds-data-fetcher
        </a>
      </div>

      <div className="flex flex-col gap-18">
        <TokenSection
          fetchNewData={fetchNewData}
          tokenInputRef={tokenInputRef}
        />
        <div className="flex flex-col gap-5">
          {error && `Error: ${error}`}
          {!error &&
            progress.total > 0 &&
            `Loaded: ${progress.total - progress.remaining}/${
              progress.total
            } records`}
        </div>

        <OutputSection
          label={"JSON → CSV (simplified)"}
          onDownload={() => downloadCsv(true)}
          disabled={downloadDisabled}
        />

        <div className="flex flex-col gap-4">
          <OutputSection
            label={"JSON → CSV"}
            onDownload={() => downloadCsv(false)}
            disabled={downloadDisabled}
          />

          <ColumnSelector
            includedFields={downloadDisabled ? [] : includedFields}
            toggleField={toggleField}
            disabled={downloadDisabled}
            selectAllFields={selectAllFields}
            deselectAllFields={deselectAllFields}
          />
        </div>

        <OutputSection
          label={"JSON Response"}
          onDownload={downloadJson}
          disabled={downloadDisabled}
        />
      </div>
    </div>
  );
}
