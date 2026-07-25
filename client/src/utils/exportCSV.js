import { saveAs } from "file-saver";

export function exportTransactionsCSV(transactions) {
  if (!transactions.length) return;

  const headers = ["Category", "Amount", "Type", "Description", "Date"];

  const rows = transactions.map((item) => [
    item.category?.name || "Uncategorized",
    item.amount,
    item.type,
    item.description,
    new Date(item.date).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "transactions.csv");
}
