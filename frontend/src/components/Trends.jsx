function Trends({ trendsPeriod, setTrendsPeriod, trendsData }) {
  return (
    <section className="trends">
      <h2>Trends</h2>

      <div className="trends-controls">
        <button
          className={
            trendsPeriod === "daily" ? "trends-btn active" : "trends-btn"
          }
          onClick={() => setTrendsPeriod("daily")}
        >
          Daily
        </button>

        <button
          className={
            trendsPeriod === "monthly" ? "trends-btn active" : "trends-btn"
          }
          onClick={() => setTrendsPeriod("monthly")}
        >
          Monthly
        </button>

        <button
          className={
            trendsPeriod === "yearly" ? "trends-btn active" : "trends-btn"
          }
          onClick={() => setTrendsPeriod("yearly")}
        >
          Yearly
        </button>
      </div>

      <div className="trends-graph">
        <div className="trends-table">
          <div className="trends-header">
            <span>Period</span>
            <span>Total Amount</span>
          </div>

          {trendsData.map((item) => (
            <div className="trends-row" key={item.label}>
              <span>{item.label}</span>
              <span>${item.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Trends;