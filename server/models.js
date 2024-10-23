const mssql = require('mssql');

/**
 *
 * @param {String} clientName
 * @param {Number} amount
 * @param {String} status
 * @returns {Promise<boolean | null>}
 */
exports.createInvoice = async (clientName, amount, status) => {
  try {
    const pool = await mssql.connect(process.env.MSSQL_CONNECTION_STRING);
    await pool
      .request()
      .input('ClientName', mssql.VarChar(255), clientName)
      .input('Amount', mssql.Decimal(10, 2), amount)
      .input('Status', mssql.VarChar(50), status)
      .query('INSERT INTO invoices (ClientName, Amount, Status) VALUES (@ClientName, @Amount, @Status)');
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 *
 * @param {Number} invoiceID
 * @returns {Promise<boolean | null>}
 */
exports.invoiceProcessed = async (invoiceID) => {
  try {
    const pool = await mssql.connect(process.env.MSSQL_CONNECTION_STRING);
    await pool
      .request()
      .input('InvoiceID', mssql.Int, invoiceID)
      .query(
        `UPDATE invoices SET IsProcessing = 0, Status = 'Completed', ProcessedAt = getdate() WHERE InvoiceID = @InvoiceID`
      );
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

exports.getLastInvoice = async () => {
  try {
    const pool = await mssql.connect(process.env.MSSQL_CONNECTION_STRING);
    const result = await pool.request().query(
      `
      SELECT TOP 1
        InvoiceID AS invoiceID,
        ClientName AS clientName,
        Amount AS amount,
        Status AS status,
        CreatedAt AS createdAt
      FROM invoices ORDER BY InvoiceID DESC;
      `
    );
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
