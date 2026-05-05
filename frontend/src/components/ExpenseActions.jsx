function ExpenseActions({
  expenseAction,
  setExpenseAction,
  formData,
  setFormData,
  formErrors,
  categoryOptions,
  handleSave,
  expenses,
  selectedExpenseId,
  handleSelectExpenseForEdit,
  editFormData,
  setEditFormData,
  editErrors,
  handleEditSave,
  deleteExpenseId,
  setDeleteExpenseId,
  selectedExpenseForDelete,
  isConfirmingDelete,
  setIsConfirmingDelete,
  handleDelete,
}) {
  return (
    <section className="middle-bar">
      <div className="expense-action">
        <button
          className={
            expenseAction === "add" ? "action-btn active" : "action-btn"
          }
          onClick={() => setExpenseAction("add")}
        >
          Add
        </button>

        <button
          className={
            expenseAction === "edit" ? "action-btn active" : "action-btn"
          }
          onClick={() => setExpenseAction("edit")}
        >
          Edit
        </button>

        <button
          className={
            expenseAction === "delete" ? "action-btn active" : "action-btn"
          }
          onClick={() => setExpenseAction("delete")}
        >
          Delete
        </button>
      </div>

      {expenseAction === "add" && (
        <div className="add-form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
            />
            {formErrors.date && (
              <p className="error-text">{formErrors.date}</p>
            )}
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter title"
            />
            {formErrors.title && (
              <p className="error-text">{formErrors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            >
              <option value="">Select category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="error-text">{formErrors.category}</p>
            )}
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="Enter amount"
            />
            {formErrors.amount && (
              <p className="error-text">{formErrors.amount}</p>
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Optional"
            />
          </div>

          <button className="action-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      )}

      {expenseAction === "edit" && (
        <div className="edit-form-wrapper">
          <div className="form-group">
            <label>Select Expense</label>
            <select
              value={selectedExpenseId}
              onChange={(e) => handleSelectExpenseForEdit(e.target.value)}
            >
              <option value="">Select expense</option>
              {expenses.map((expense) => (
                <option key={expense.id} value={expense.id}>
                  {expense.date} - {expense.title} - ${expense.amount}
                </option>
              ))}
            </select>
          </div>

          {selectedExpenseId && (
            <div className="add-form">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
                {editErrors.date && (
                  <p className="error-text">{editErrors.date}</p>
                )}
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                {editErrors.title && (
                  <p className="error-text">{editErrors.title}</p>
                )}
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {editErrors.category && (
                  <p className="error-text">{editErrors.category}</p>
                )}
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={editFormData.amount}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
                {editErrors.amount && (
                  <p className="error-text">{editErrors.amount}</p>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <button className="action-btn" onClick={handleEditSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      )}

      {expenseAction === "delete" && (
        <div className="delete-form-wrapper">
          <div className="form-group">
            <label>Select Expense</label>
            <select
              value={deleteExpenseId}
              onChange={(e) => {
                setDeleteExpenseId(e.target.value);
                setIsConfirmingDelete(false);
              }}
            >
              <option value="">Select expense</option>
              {expenses.map((expense) => (
                <option key={expense.id} value={expense.id}>
                  {expense.date} - {expense.title} - ${expense.amount}
                </option>
              ))}
            </select>
          </div>

          {selectedExpenseForDelete && (
            <div className="delete-preview">
              <p>
                <strong>Date:</strong> {selectedExpenseForDelete.date}
              </p>
              <p>
                <strong>Title:</strong> {selectedExpenseForDelete.title}
              </p>
              <p>
                <strong>Category:</strong> {selectedExpenseForDelete.category}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedExpenseForDelete.amount}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedExpenseForDelete.description || "None"}
              </p>

              {!isConfirmingDelete ? (
                <button
                  className="action-btn"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  Delete
                </button>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="action-btn" onClick={handleDelete}>
                    Confirm Delete
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ExpenseActions;