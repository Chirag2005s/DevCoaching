/**
 * Export Utility for Dashboard ERP v4.0.0
 */

// Export array of objects to CSV file download
export function exportToCSV(filename, data) {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Trigger printable report view for PDF export
export function printReport(title, contentElementId) {
  const elem = document.getElementById(contentElementId);
  if (!elem) {
    window.print();
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Dev Coaching ERP Report</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 20px; color: #111; }
          h1 { color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
          th { background: #f1f5f9; font-weight: 600; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">Generated on ${new Date().toLocaleString()} | Dev Coaching Admin ERP v4.0.0</div>
        ${elem.innerHTML}
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
