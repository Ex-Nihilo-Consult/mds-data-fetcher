import Papa from "papaparse";

const KEY_COLUMNS = ["MDS record link", "Collection name"];

const appendValue = (outputRecord, value, outputKey) => {
  if (outputRecord[outputKey]) {
    outputRecord[outputKey] = outputRecord[outputKey] + ";" + value;
  } else {
    outputRecord[outputKey] = value;
  }
};

const recursiveAppend = (outputRecord, attribute, parentLabel) => {
  // Always append value, regardless of if item is a parent or leaf
  appendValue(outputRecord, attribute.value, parentLabel);

  // Base case: no nested units array
  if (!Array.isArray(attribute.units)) {
    return;
  }

  attribute.units.forEach((nestedAttribute) => {
    // Show full hierarchy with column label
    const label = `${parentLabel}>${nestedAttribute.label}`;
    recursiveAppend(outputRecord, nestedAttribute, label);
  });
};

const jsonToCsvValues = (jsonData, simplify) => {
  const data = jsonData.map((entry) => ({
    uid: entry["@admin"].uid,
    organization: entry["@admin"].data_source.organisation,
    attributes: entry["@document"].units,
  }));

  const values = [];
  data.forEach((entry) => {
    const dataObj = {};
    dataObj["MDS record link"] = `https://museumdata.uk/objects/${entry.uid}`;
    dataObj["Collection name"] = entry.organization;

    entry.attributes.forEach((column) => {
      if (!simplify) {
        // Add all units, including nested
        recursiveAppend(dataObj, column, column.label);
      } else {
        // Consistent with clicking "Download as CSV" in the MDS Object Search
        if (column.label === "Object Number") {
          appendValue(dataObj, column.value, "Object number");
        } else if (column.label === "Object Name") {
          appendValue(dataObj, column.value, "Object name");
        } else if (column.label === "Title") {
          appendValue(dataObj, column.value, "Title");
        } else if (column.label === "Brief Description") {
          appendValue(dataObj, column.value, "Description");
        }
      }
    });
    values.push(dataObj);
  });

  if (!values.length) {
    return { values: [], columns: [] };
  }

  // Get full list of columns
  if (!simplify) {
    const columnNameSet = new Set();
    values.forEach((value) => {
      Object.keys(value).forEach((columnName) => {
        if (!KEY_COLUMNS.includes(columnName)) columnNameSet.add(columnName);
      });
    });

    // Key columns first then rest alphabetically
    const orderedColumns = [
      ...KEY_COLUMNS,
      ...Array.from(columnNameSet).sort(),
    ];

    return { values: values, columns: orderedColumns };
  }

  // Use keys from first object since all the same and already ordered
  return { values: values, columns: Object.keys(values[0]) };
};

// JSON to column counts together with default checkbox selection state for convenience
export const jsonToCsvCounts = (jsonData) => {
  const unparsedData = jsonToCsvValues(jsonData, false);

  const unparsedDataCounts = {};
  unparsedData.columns.forEach((columnName) => {
    unparsedDataCounts[columnName] = 0;
  });
  unparsedData.values.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        unparsedDataCounts[key] = unparsedDataCounts[key] + 1;
      }
    });
  });

  return Object.entries(unparsedDataCounts).map(([key, value]) => ({
    key: key,
    count: value,
    include: true, // default to checked
  }));
};

// JSON to CSV string
export const jsonToCsv = (jsonData, simplify, columns = null) => {
  const csvValues = jsonToCsvValues(jsonData, simplify);

  const csvColumns =
    // If no columns checked then include them all, rather than an empty file
    columns && Array.isArray(columns) && columns.length > 0
      ? columns
      : csvValues.columns;

  return Papa.unparse(csvValues.values, {
    // Override the included columns if provided, else use them all
    columns: csvColumns,
  });
};
