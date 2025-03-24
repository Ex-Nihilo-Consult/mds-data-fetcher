# MDS Data Fetcher

Museum Data Service (MDS): https://museumdata.uk/

This is a utility for fetching object data from the MDS database using API tokens.

Since the MDS API limits JSON responses to 100 objects, the tool appends responses from next_url until has_next is false. Large responses my be limited by the memory allocated to your browser.

There is are three options to download the response. "Units" with duplicate labels are added to the same column with values delineated by semicolons.

1. JSON → CSV (simplified): Only the columns shown with the MDS website "Download as CSV" functionality.
2. JSON → CSV: The same MDS Record Link and Collection Name as #1 then (alphabetically sorted) all other attributes present in the JSON response. Nested attributes are shown in new columns reverenced by both parent and child labels (e.g., "Condition>Condition Date>Date - Latest").
3. JSON Response: The "data" content from all responses appended into a single list. Response metadata ("stats", "has_next", etc.) is excluded.
