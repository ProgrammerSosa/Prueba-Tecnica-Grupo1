import PDFDocument from 'pdfkit';

const drawTable = (doc, { headers, rows, columnWidths, startX = 40 }) => {
    const rowHeight = 22;
    let y = doc.y;

    doc.font('Helvetica-Bold').fontSize(10);
    let x = startX;
    headers.forEach((header, i) => {
        doc.text(header, x, y, { width: columnWidths[i], continued: false });
        x += columnWidths[i];
    });
    y += rowHeight;
    doc
        .moveTo(startX, y - 4)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b, 0), y - 4)
        .strokeColor('#A78A50')
        .stroke();

    doc.font('Helvetica').fontSize(9);
    rows.forEach((row) => {
        if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
            doc.addPage();
            y = doc.page.margins.top;
        }
        x = startX;
        row.forEach((cell, i) => {
            doc.text(String(cell ?? ''), x, y, { width: columnWidths[i] });
            x += columnWidths[i];
        });
        y += rowHeight;
    });

    doc.y = y + 10;
};

export const streamSummaryPdf = (res, summaryData) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        'attachment; filename="resumen-beehive.pdf"'
    );

    doc.pipe(res);

    doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor('#33241D')
        .text('BeeHive - Resumen general', { align: 'left' });
    doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#4A3428')
        .text(`Generado: ${new Date(summaryData.generatedAt || Date.now()).toLocaleString('es-GT')}`);
    doc.moveDown(1.5);

    doc.font('Helvetica-Bold').fontSize(13).fillColor('#33241D').text('Totales');
    doc.moveDown(0.5);
    drawTable(doc, {
        headers: ['Métrica', 'Valor'],
        columnWidths: [280, 200],
        rows: [
            ['Total de productos', summaryData.totals.totalProducts],
            ['Unidades en stock', summaryData.totals.totalStockUnits],
            ['Valor total del inventario', summaryData.totals.totalInventoryValue],
            ['Umbral de stock bajo', summaryData.alerts.threshold],
            ['Productos con stock bajo', summaryData.alerts.lowStockCount],
            ['Productos agotados', summaryData.alerts.outOfStockCount],
        ],
    });

    doc.font('Helvetica-Bold').fontSize(13).fillColor('#33241D').text('Categorías');
    doc.moveDown(0.5);
    drawTable(doc, {
        headers: ['Categoría', 'Productos', 'Stock total', 'Valor total'],
        columnWidths: [160, 110, 110, 110],
        rows: (summaryData.categories || []).map((c) => [
            c.category,
            c.productCount,
            c.totalStock,
            c.totalValue,
        ]),
    });

    doc.font('Helvetica-Bold').fontSize(13).fillColor('#33241D').text('Top productos');
    doc.moveDown(0.5);
    drawTable(doc, {
        headers: ['Producto', 'Categoría', 'Stock', 'Vendidos'],
        columnWidths: [180, 140, 80, 90],
        rows: (summaryData.topProducts || []).map((p) => [
            p.name,
            p.category,
            p.currentStock,
            p.totalSold,
        ]),
    });

    doc.end();
};
