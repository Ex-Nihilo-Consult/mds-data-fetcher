# MDS Data Fetcher

Deployed: https://ex-nihilo-consult.github.io/mds-data-fetcher/

Museum Data Service (MDS) Object Search: https://museumdata.uk/object-search/

MDS Swagger Docs: https://mds-data-1.ciim.k-int.com/api/swagger-ui/index.html

The MDS Data Fetcher is a utility for downloading data from the MDS objects database.

You must first obtain an API token for a query by clicking the "Get and API token" button below an MDS Object Search.

The MDS API limits JSON responses to 100 objects. To streamline larger queries, the MDS Data Fetcher appends responses from "next_url" until "has_next" is false. Very large responses may be limited by the memory allocated to your browser.

There are three options to download the response:

1. JSON → CSV (simplified): Same as clicking "Download as CSV" in the MDS Object Search, except not limited to 1000 objects and concatenates (semicolon-delineated) duplicate attributes rather than including only value.
2. JSON → CSV: Same MDS Record Link and Collection Name as in #1 then all other attributes in the JSON response (alphabetically sorted). For top-level "@document.units" arrays, the CSV column name is the "label" from that item. The CSV cell value is the item's "value". For items that have "units" arrays, nested items are recursively added. Column names derived from nested labels are concatenated to show their hierarchical relationship and systematize sort order (e.g., "Condition>Condition Date>Date - Latest"). All other metadata ("type", "path", etc.) is excluded. Items with the matching column names are concatenated (semicolon-delineated).
3. JSON Response: The "data" content from all responses appended into a single list. Response metadata ("stats", "has_next", etc.) is excluded.

The CSV values are UTF-8 encoded. With some spreadsheet software, including versions of Microsoft Excel, special characters will only appear correctly if explicitly importing the CSV as UTF-8: https://support.microsoft.com/en-gb/office/opening-csv-utf-8-files-correctly-in-excel-8a935af5-3416-4edd-ba7e-3dfd2bc4a032
