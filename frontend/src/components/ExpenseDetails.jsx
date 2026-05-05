function ExpenseDetails({ filteredExpenses }) {
  return (
    <section className="expense-details">
      <h3>Expense Details</h3>

      <div className="expense-table">
        <div className="details-header">
          <span>Date</span>
          <span>Category</span>
          <span>Title</span>
          <span>Amount</span>
          <span>Description</span>
        </div>

        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div className="details-row" key={expense.id}>
              <span>{expense.date}</span>
              <span>{expense.category}</span>
              <span>{expense.title}</span>
              <span>${Number(expense.amount).toFixed(2)}</span>
              <span>{expense.description || "None"}</span>
            </div>
          ))
        ) : (
          <div className="details-row">
            <span>-</span>
            <span>-</span>
            <span>No data</span>
            <span>$0.00</span>
            <span>-</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExpenseDetails;