function OverviewCards({ stats }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">
        Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Balance
          </p>
          <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${stats.balance}
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Income
          </p>
          <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${stats.income}
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Expense
          </p>
          <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">
            ${stats.expense}
          </h3>
        </div>

      </div>
    </>
  );
}

export default OverviewCards;