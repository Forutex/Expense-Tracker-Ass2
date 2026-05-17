import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import ExpenseActions from "../components/ExpenseActions";
import ExpenseDetails from "../components/ExpenseDetails";
import CategorySummary from "../components/CategorySummary";
import Trends from "../components/Trends";
import { useNavigate } from "react-router-dom";

function ExpenseTracker() {
  const today = new Date();
  const navigate = useNavigate();

  const API_BASE_URL = "http://127.0.0.1:8000";

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDayOptions = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const formatDateString = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatMonthLabel = (year, month) => {
    return `${year}-${String(month).padStart(2, "0")}`;
  };

  const categoryOptions = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Other",
  ];

  const yearOptions = Array.from(
    { length: 10 },
    (_, i) => today.getFullYear() - 5 + i
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const [formData, setFormData] = useState({
    date: getTodayString(),
    category: "",
    title: "",
    amount: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [editFormData, setEditFormData] = useState({
    date: "",
    title: "",
    category: "",
    amount: "",
    description: "",
  });
  const [editErrors, setEditErrors] = useState({});

  const [deleteExpenseId, setDeleteExpenseId] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [viewMode, setViewMode] = useState("day");
  const [selectedPeriod, setSelectedPeriod] = useState({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });

  const [expenseAction, setExpenseAction] = useState("add");
  const [trendsPeriod, setTrendsPeriod] = useState("daily");

  const [expenses, setExpenses] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const isSearching = searchQuery.trim().length > 0;

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!formData.category) {
      errors.category = "Category is required.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0.";
    }

    return errors;
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editFormData.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!editFormData.category) {
      errors.category = "Category is required.";
    }

    if (!editFormData.amount || Number(editFormData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0.";
    }

    return errors;
  };

  const fetchExpenses = async () => {
    try {
<<<<<<< Updated upstream
      const res = await fetch(`${API_BASE_URL}/expenses`);

=======
      const token = localStorage.getItem("token");
  
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 401) {
        handleAuthError();
        return;
      }
  
>>>>>>> Stashed changes
      if (!res.ok) {
        throw new Error("Failed to fetch expenses");
      }
  
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSave = async () => {
    const errors = validateForm();
  
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    const newExpense = {
      date: formData.date,
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description,
    };
  
    try {
<<<<<<< Updated upstream
=======
      const token = localStorage.getItem("token");
  
>>>>>>> Stashed changes
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });
  
      if (res.status === 401) {
        handleAuthError();
        return;
      }
  
      if (!res.ok) {
        throw new Error("Failed to create expense");
      }
  
      const createdExpense = await res.json();
  
      setExpenses((prev) => [...prev, createdExpense]);
      setFormErrors({});
      setFormData({
        date: getTodayString(),
        category: "",
        title: "",
        amount: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to save expense:", error);
    }
  };

  const handleSelectExpenseForEdit = (id) => {
    setSelectedExpenseId(id);

    const selectedExpense = expenses.find(
      (expense) => expense.id === Number(id)
    );

    if (selectedExpense) {
      setEditFormData({
        date: selectedExpense.date,
        title: selectedExpense.title,
        category: selectedExpense.category,
        amount: selectedExpense.amount,
        description: selectedExpense.description || "",
      });
    }
  };

  const handleEditSave = async () => {
    const errors = validateEditForm();
  
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
  
    const updatedExpense = {
      date: editFormData.date,
      title: editFormData.title,
      category: editFormData.category,
      amount: Number(editFormData.amount),
      description: editFormData.description,
    };
  
    try {
<<<<<<< Updated upstream
=======
      const token = localStorage.getItem("token");
  
>>>>>>> Stashed changes
      const res = await fetch(
        `${API_BASE_URL}/expenses/${selectedExpenseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedExpense),
        }
      );
  
      if (res.status === 401) {
        handleAuthError();
        return;
      }
  
      if (!res.ok) {
        throw new Error("Failed to update expense");
      }
  
      const savedExpense = await res.json();
  
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === Number(selectedExpenseId)
            ? savedExpense
            : expense
        )
      );
  
      setEditErrors({});
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteExpenseId) return;
  
    try {
<<<<<<< Updated upstream
      const res = await fetch(`${API_BASE_URL}/expenses/${deleteExpenseId}`, {
        method: "DELETE",
      });

=======
      const token = localStorage.getItem("token");
  
      const res = await fetch(
        `${API_BASE_URL}/expenses/${deleteExpenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 401) {
        handleAuthError();
        return;
      }
  
>>>>>>> Stashed changes
      if (!res.ok) {
        throw new Error("Failed to delete expense");
      }
  
      setExpenses((prev) =>
        prev.filter(
          (expense) => expense.id !== Number(deleteExpenseId)
        )
      );
  
      setDeleteExpenseId("");
      setIsConfirmingDelete(false);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const selectedExpenseForDelete = expenses.find(
    (expense) => expense.id === Number(deleteExpenseId)
  );

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseYear = expenseDate.getFullYear();
    const expenseMonth = expenseDate.getMonth() + 1;
    const expenseDay = expenseDate.getDate();
  
    let matchesPeriod = false;
  
    if (viewMode === "day") {
      matchesPeriod =
        expenseYear === selectedPeriod.year &&
        expenseMonth === selectedPeriod.month &&
        expenseDay === selectedPeriod.day;
    }
  
    if (viewMode === "month") {
      matchesPeriod =
        expenseYear === selectedPeriod.year &&
        expenseMonth === selectedPeriod.month;
    }
  
    if (viewMode === "year") {
      matchesPeriod = expenseYear === selectedPeriod.year;
    }
  
    return matchesPeriod;
  });

  const searchResults = filteredExpenses.filter((expense) => {
    if (!isSearching) return false;

    const q = searchQuery.toLowerCase();

    return (
      expense.title.toLowerCase().includes(q) ||
      expense.category.toLowerCase().includes(q) ||
      (expense.description?.toLowerCase().includes(q) ?? false)
    );
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += Number(expense.amount);
    return acc;
  }, {});

  const categorySummaryData = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      percentage: totalAmount > 0 ? (total / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const getDailyTrendsData = () => {
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);

      const targetDateString = formatDateString(targetDate);

      const total = expenses.reduce((sum, expense) => {
        return expense.date === targetDateString
          ? sum + Number(expense.amount)
          : sum;
      }, 0);

      data.push({
        label: targetDateString,
        total,
      });
    }

    return data;
  };

  const getMonthlyTrendsData = () => {
    const data = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );

      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;

      const total = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        const expenseYear = expenseDate.getFullYear();
        const expenseMonth = expenseDate.getMonth() + 1;

        return expenseYear === targetYear && expenseMonth === targetMonth
          ? sum + Number(expense.amount)
          : sum;
      }, 0);

      data.push({
        label: formatMonthLabel(targetYear, targetMonth),
        total,
      });
    }

    return data;
  };

  const getYearlyTrendsData = () => {
    const data = [];
    const currentYear = new Date().getFullYear();

    for (let i = 4; i >= 0; i--) {
      const targetYear = currentYear - i;

      const total = expenses.reduce((sum, expense) => {
        const expenseYear = new Date(expense.date).getFullYear();

        return expenseYear === targetYear ? sum + Number(expense.amount) : sum;
      }, 0);

      data.push({
        label: String(targetYear),
        total,
      });
    }

    return data;
  };

  const trendsData =
    trendsPeriod === "daily"
      ? getDailyTrendsData()
      : trendsPeriod === "monthly"
      ? getMonthlyTrendsData()
      : getYearlyTrendsData();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const now = new Date();

    if (viewMode === "day") {
      setSelectedPeriod({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      });
    } else if (viewMode === "month") {
      setSelectedPeriod({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: 1,
      });
    } else if (viewMode === "year") {
      setSelectedPeriod({
        year: now.getFullYear(),
        month: 1,
        day: 1,
      });
    }
  }, [viewMode]);

  return (
    <div className="app">
      <header className="header">
        <h1>Expense Tracker</h1>
      </header>

      <TopBar
        totalAmount={totalAmount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        yearOptions={yearOptions}
        monthOptions={monthOptions}
        getDayOptions={getDayOptions}
        handleLogout={handleLogout}
      />

      <ExpenseActions
        expenseAction={expenseAction}
        setExpenseAction={setExpenseAction}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        categoryOptions={categoryOptions}
        handleSave={handleSave}
        expenses={expenses}
        selectedExpenseId={selectedExpenseId}
        handleSelectExpenseForEdit={handleSelectExpenseForEdit}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        editErrors={editErrors}
        handleEditSave={handleEditSave}
        deleteExpenseId={deleteExpenseId}
        setDeleteExpenseId={setDeleteExpenseId}
        selectedExpenseForDelete={selectedExpenseForDelete}
        isConfirmingDelete={isConfirmingDelete}
        setIsConfirmingDelete={setIsConfirmingDelete}
        handleDelete={handleDelete}
      />

      <section className="search">
        <h2>Search Expenses</h2>

        <input
        type = "text"
        placeholder = "Search by title"
        value = {searchQuery}
        onChange = {(e) => setSearchQuery(e.target.value)}
        />
      </section>

      <section className="overviews">
        <h2>Overviews</h2>

        <ExpenseDetails 
          filteredExpenses={isSearching ? searchResults : filteredExpenses}
        />

        <CategorySummary categorySummaryData={categorySummaryData} />
      </section>

      <Trends
        trendsPeriod={trendsPeriod}
        setTrendsPeriod={setTrendsPeriod}
        trendsData={trendsData}
      />
    </div>
  );
}

export default ExpenseTracker;