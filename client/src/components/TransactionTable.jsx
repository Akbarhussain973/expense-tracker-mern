import { Pencil, Trash2 } from "lucide-react";

function TransactionTable({
  search,
  setSearch,
  sortBy,
  setSortBy,
  filterType,
  setFilterType,
  filteredExpenses,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Transactions</h2>

    <div className="flex flex-col md:flex-row gap-4 mb-6">

    {/* Search */}
    <input
      type="text"
      placeholder="Search by category or description..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Filter */}
    <select
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
      className="border rounded-lg px-4 py-2"
    >
      <option value="all">All</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>

    {/* Sort */}
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="border rounded-lg px-4 py-2"
    >
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
      <option value="highest">Highest Amount</option>
      <option value="lowest">Lowest Amount</option>
    </select>

  </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-10">Category</th>
              <th className="text-left p-10">Amount</th>
              <th className="text-left p-10">Type</th>
              <th className="text-left p-10">Description</th>
              <th className="text-left p-10">Date</th>
              <th className="text-left p-10">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{exp.category?.name || "Uncategorized"}</td>

                  <td className="p-3 font-semibold">${exp.amount}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white ${
                        exp.type === "income" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {exp.type}
                    </span>
                  </td>

                  <td className="p-3">{exp.description}</td>

                  <td className="p-3">{new Date(exp.date).toLocaleDateString()}</td>

                  <td className="p-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
