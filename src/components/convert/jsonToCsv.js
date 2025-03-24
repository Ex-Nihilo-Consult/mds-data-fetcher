import Papa from "papaparse";

const appendValue = (outputRecord, value, outputKey) => {
  if (outputRecord[outputKey]) {
    outputRecord[outputKey] = outputRecord[outputKey] + ";" + value;
  } else {
    outputRecord[outputKey] = value;
  }
};

const recursiveAppend = (outputRecord, attribute, parentLabel) => {
  appendValue(outputRecord, attribute.value, parentLabel);

  // base case - no units
  if (!Array.isArray(attribute.units)) {
    return;
  }

  attribute.units.forEach((nestedAttribute) => {
    const label = `${parentLabel}>${nestedAttribute.label}`;
    recursiveAppend(outputRecord, nestedAttribute, label);
  });
};

const jsonToCsv = (jsonData, simplify) => {
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
        recursiveAppend(dataObj, column, column.label);
      } else {
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

  // Get full list of columns
  if (!simplify) {
    const KEY_COLUMNS = ["MDS record link", "Collection name"];

    const columnNameSet = new Set();
    values.forEach((value) => {
      Object.keys(value).forEach((columnName) => {
        if (!KEY_COLUMNS.includes(columnName)) columnNameSet.add(columnName);
      });
    });

    // Key cols at first then rest alphabetically
    const orderedColumns = [
      ...KEY_COLUMNS,
      ...Array.from(columnNameSet).sort(),
    ];

    return Papa.unparse(values, {
      columns: orderedColumns,
    });
  }

  // Use keys from first object since all the same and already ordered
  return Papa.unparse(values);
};

export default jsonToCsv;
