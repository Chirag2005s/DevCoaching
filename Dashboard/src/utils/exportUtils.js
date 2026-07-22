import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export data to a PDF file.
 * @param {Array} headers - Array of string headers for the table.
 * @param {Array<Array>} data - 2D array of data rows.
 * @param {string} title - Title of the PDF document.
 * @param {string} filename - Filename to save as (e.g., 'report.pdf').
 */
export const exportToPDF = (headers, data, title = 'Dashboard Report', filename = 'report.pdf') => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);
    
    // Add table
    doc.autoTable({
      startY: 40,
      head: [headers],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // matches --accent-primary
      styles: { fontSize: 10, cellPadding: 4 },
    });
    
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Export data to an Excel (XLSX) file.
 * @param {Array<Object>} data - Array of objects representing rows.
 * @param {string} filename - Filename to save as (e.g., 'report.xlsx').
 */
export const exportToExcel = (data, filename = 'report.xlsx') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return false;
  }
};
