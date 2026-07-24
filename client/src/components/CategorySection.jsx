import { Save, Pencil, Trash2, X, Plus } from "lucide-react";

function CategorySection({
  categories,
  categoryName,
  setCategoryName,
  editingCategoryId,
  setEditingCategoryId,
  categoryFormRef,
  handleAddCategory,
  handleEditCategory,
  handleDeleteCategory,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Categories</h2>

      <ul className="space-y-3 mb-6">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex items-center justify-between border rounded-lg p-3"
          >
            <span className="font-medium">{cat.name}</span>

            <div className="space-x-2">
              <button
                onClick={() => handleEditCategory(cat)}
                className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={() => handleDeleteCategory(cat._id)}
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form ref={categoryFormRef} onSubmit={handleAddCategory} className="flex gap-3">
        <input
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
        >
          {editingCategoryId ? <Save size={18} /> : <Plus size={18} />}
          {editingCategoryId ? "Update" : "Add"}
        </button>

        {editingCategoryId && (
          <button
            type="button"
            onClick={() => {
              setEditingCategoryId(null);
              setCategoryName("");
            }}
            className="inline-flex items-center justify-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-5 rounded-lg"
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default CategorySection;
