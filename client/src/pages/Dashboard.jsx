import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import OverviewCards from "../components/OverviewCards";
import CategorySection from "../components/CategorySection";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";

const API_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  category: "",
  amount: "",
  type: "expense",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

function Dashboard() {
  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const formRef = useRef(null);
  const categoryFormRef = useRef(null);
  const navigate = useNavigate();

  // ---------------------------------------------------------------------
  // Data loading
  // ---------------------------------------------------------------------
  const loadData = () => {
    Promise.all([
      fetch(`${API_URL}/categories`, {
        credentials: "include",
      }).then((res) => res.json()),

      fetch(`${API_URL}/transactions`, {
        credentials: "include",
      }).then((res) => res.json()),

      fetch(`${API_URL}/dashboard/stats`, {
        credentials: "include",
      }).then((res) => res.json()),
    ])
      .then(([categoriesData, expensesData, statsData]) => {
        setCategories(categoriesData);
        setExpenses(expensesData);
        setStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------------------------------------------------------------
  // Transaction handlers
  // ---------------------------------------------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      category: exp.category._id,
      amount: exp.amount,
      type: exp.type,
      description: exp.description,
      date: exp.date.split("T")[0],
    });
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = editingId
      ? `${API_URL}/transactions/${editingId}`
      : `${API_URL}/transactions`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to save transaction");
        return;
      }

      setForm(initialForm);
      setEditingId(null);
      toast.success(editingId ? "Transaction updated!" : "Transaction added!");
      loadData(); // refresh the list
    } catch (err) {
      toast.error("Server unreachable");
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteType("transaction");
    setConfirmOpen(true);
  };

  // ---------------------------------------------------------------------
  // Category handlers
  // ---------------------------------------------------------------------
  const handleAddCategory = async (e) => {
    e.preventDefault();

    const url = editingCategoryId
      ? `${API_URL}/categories/${editingCategoryId}`
      : `${API_URL}/categories`;

    const method = editingCategoryId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: categoryName,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save category");
      }

      setCategoryName("");
      setEditingCategoryId(null);
      toast.success(editingCategoryId ? "Category updated!" : "Category added!");
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryName(category.name);
    categoryFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDeleteCategory = (id) => {
    setDeleteId(id);
    setDeleteType("category");
    setConfirmOpen(true);
  };

  // ---------------------------------------------------------------------
  // Shared delete confirmation (transactions + categories)
  // ---------------------------------------------------------------------
  const confirmDelete = async () => {
    try {
      const endpoint =
        deleteType === "transaction"
          ? `${API_URL}/transactions/${deleteId}`
          : `${API_URL}/categories/${deleteId}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete ${deleteType}`);
      }

      toast.success(
        deleteType === "transaction" ? "Transaction deleted!" : "Category deleted!"
      );

      setConfirmOpen(false);
      setDeleteId(null);
      setDeleteType("");

      if (deleteType === "category" && editingCategoryId === deleteId) {
        setEditingCategoryId(null);
        setCategoryName("");
      }

      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------
  const filteredExpenses = expenses
  .filter((exp) => {
    const query = search.toLowerCase();

    const matchesSearch =
      exp.category?.name.toLowerCase().includes(query) ||
      exp.description?.toLowerCase().includes(query);

    const matchesType =
      filterType === "all" || exp.type === filterType;

    return matchesSearch && matchesType;
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.date) - new Date(a.date);

      case "oldest":
        return new Date(a.date) - new Date(b.date);

      case "highest":
        return b.amount - a.amount;

      case "lowest":
        return a.amount - b.amount;

      default:
        return 0;
    }
  });

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
            <p className="text-gray-500">Manage your finances</p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <OverviewCards stats={stats} />

        <CategorySection
          categories={categories}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          editingCategoryId={editingCategoryId}
          setEditingCategoryId={setEditingCategoryId}
          categoryFormRef={categoryFormRef}
          handleAddCategory={handleAddCategory}
          handleEditCategory={handleEditCategory}
          handleDeleteCategory={handleDeleteCategory}
        />

        <TransactionForm
          formRef={formRef}
          form={form}
          categories={categories}
          error={error}
          editingId={editingId}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancelEdit}
        />

        <TransactionTable
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterType={filterType}
          setFilterType={setFilterType}
          filteredExpenses={filteredExpenses}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={deleteType === "transaction" ? "Delete Transaction?" : "Delete Category?"}
        message={
          deleteType === "transaction"
            ? "This transaction will be permanently deleted."
            : "This category will be permanently deleted."
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
          setDeleteType("");
        }}
      />
    </div>
  );
}

export default Dashboard;
