function CategorySummary({ categorySummaryData }) {
  return (
    <section className="category-summary">
      <h3>Category Summary</h3>

      <div className="category-content">
        <div className="category-summary-table">
          <div className="category-summary-header">
            <span>Category</span>
            <span>Total Amount</span>
            <span>Percentage</span>
          </div>

          {categorySummaryData.length > 0 ? (
            categorySummaryData.map((item) => (
              <div className="category-summary-row" key={item.category}>
                <span>{item.category}</span>
                <span>${item.total.toFixed(2)}</span>
                <span>{item.percentage.toFixed(1)}%</span>
              </div>
            ))
          ) : (
            <div className="category-summary-row">
              <span>-</span>
              <span>$0.00</span>
              <span>0.0%</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategorySummary;