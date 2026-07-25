function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md transition-colors duration-300">

        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-3">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;