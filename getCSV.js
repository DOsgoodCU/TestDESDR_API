//To run: node getCSV.js <username> | change table name if needed
// Generate CSV files from Convex state and data
import fs from "fs";
import { ConvexHttpClient } from "convex/browser";

try {
  const convex = new ConvexHttpClient("https://rightful-anteater-150.convex.cloud");
  
  const usernameArg = process.argv[2];
  if (!usernameArg) {
    console.log("Usage: node getClean.js <username> (default: a)");
  }
  const username = usernameArg || "Emnet";
  
  // Get UI state data
  const stateResult = await convex.query("getFromConvex", { 
    table: "Ethiopia_State", 
    user: username 
  });

  if (stateResult) {
    let stateData = stateResult.data;
    if (typeof stateData === "string") {
      stateData = JSON.parse(stateData);
    }

    const uiRows = [];
    Object.keys(stateData).forEach(stateKey => {
      const stateEntry = stateData[stateKey];
      if (typeof stateEntry === 'object' && stateEntry !== null) {
        Object.keys(stateEntry).forEach(eventName => {
          const eventState = stateEntry[eventName];
          uiRows.push({
            user: username,
            timestamp: new Date(stateResult._creationTime).toISOString(),
            state_key: stateKey,
            event_name: eventName,
            interaction_state: JSON.stringify(eventState)
          });
        });
      }
    });

    // Write UI state CSV
    const uiCSV = convertToCSV(uiRows);
    fs.writeFileSync(`${username}_ui_state.csv`, uiCSV);
    console.log(`UI CSV: ${username}_ui_state.csv`);
  }

  // Get chart data
  const dataResult = await convex.query("getFromConvex", { 
    table: "Ethiopia_Data", 
    user: username 
  });

  if (dataResult) {
    let data = dataResult.data;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    // Group datasets by type (mtb, severity_combined, badyear)
    const datasetGroups = {
      mtb: [],
      severity_combined: [],
      badyear: []
    };

    // Collect all data by dataset type
    Object.keys(data).forEach(datasetKey => {
      const dataset = data[datasetKey];
      if (Array.isArray(dataset)) {
        // Parse the dataset key components (e.g., "severity_combined,17,4" -> block="severity_combined", user_id=17, gid=4)
        const keyParts = datasetKey.split(',');
        const block = keyParts[0];
        const user_id = keyParts[1] || null;
        const gid = keyParts[2] || null;
        
        if (datasetGroups[block]) {
          dataset.forEach((row, index) => {
            const csvRow = {
              user: username,
              table: block,
              user_id: user_id,
              gid: gid,
              row_index: index,
              timestamp: new Date(dataResult._creationTime).toISOString(),
              ...row
            };
            datasetGroups[block].push(csvRow);
          });
        }
      }
    });

    // Generate consolidated CSV files for each dataset type
    Object.keys(datasetGroups).forEach(datasetType => {
      const rows = datasetGroups[datasetType];
      if (rows.length > 0) {
        // Sort rows by gid (convert to number for proper numeric sorting)
        rows.sort((a, b) => {
          const gidA = parseInt(a.gid) || 0;
          const gidB = parseInt(b.gid) || 0;
          return gidA - gidB;
        });
        
        const csv = convertToCSV(rows);
        const filename = `${username}_${datasetType}_data.csv`;
        fs.writeFileSync(filename, csv);
        console.log(`Chart CSV: ${filename} (${rows.length} rows)`);
      }
    });
  }

} catch (error) {
  console.error("Error:", error.message);
}

function convertToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) {
          return '';
        }
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

