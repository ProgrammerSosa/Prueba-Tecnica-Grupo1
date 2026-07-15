import ExcelJS from 'exceljs';

export const streamSummaryWorkbook = async (res, summaryData) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BeeHive';
    workbook.created = new Date();

    const totalsSheet = workbook.addWorksheet('Totales');
    totalsSheet.columns = [
        { header: 'Métrica', key: 'metric', width: 30 },
        { header: 'Valor', key: 'value', width: 20 },
    ];
    totalsSheet.addRows([
        { metric: 'Total de productos', value: summaryData.totals.totalProducts },
        { metric: 'Unidades en stock', value: summaryData.totals.totalStockUnits },
        { metric: 'Valor total del inventario', value: summaryData.totals.totalInventoryValue },
        { metric: 'Umbral de stock bajo', value: summaryData.alerts.threshold },
        { metric: 'Productos con stock bajo', value: summaryData.alerts.lowStockCount },
        { metric: 'Productos agotados', value: summaryData.alerts.outOfStockCount },
    ]);
    totalsSheet.getRow(1).font = { bold: true };

    const categoriesSheet = workbook.addWorksheet('Categorías');
    categoriesSheet.columns = [
        { header: 'Categoría', key: 'category', width: 24 },
        { header: 'Productos', key: 'productCount', width: 16 },
        { header: 'Stock total', key: 'totalStock', width: 16 },
        { header: 'Valor total', key: 'totalValue', width: 18 },
    ];
    categoriesSheet.addRows(summaryData.categories || []);
    categoriesSheet.getRow(1).font = { bold: true };

    const topProductsSheet = workbook.addWorksheet('Top productos');
    topProductsSheet.columns = [
        { header: 'Producto', key: 'name', width: 28 },
        { header: 'Categoría', key: 'category', width: 20 },
        { header: 'Stock actual', key: 'currentStock', width: 14 },
        { header: 'Vendidos', key: 'totalSold', width: 14 },
        { header: 'Ventas registradas', key: 'salesCount', width: 18 },
    ];
    topProductsSheet.addRows(summaryData.topProducts || []);
    topProductsSheet.getRow(1).font = { bold: true };

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename="resumen-beehive.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
};
