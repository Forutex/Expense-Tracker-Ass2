import ReelPicker from "./ReelPicker";

function TopBar({
  totalAmount,
  viewMode,
  setViewMode,
  selectedPeriod,
  setSelectedPeriod,
  yearOptions,
  monthOptions,
  getDayOptions,
}) {
  return (
    <section className="top-bar">
      <div className="top-left">
        <div className="total-summary">Total: ${totalAmount.toFixed(2)}</div>

        <div className="view-mode-controls">
          <button
            className={
              viewMode === "day" ? "view-mode-btn active" : "view-mode-btn"
            }
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
          <button
            className={
              viewMode === "month" ? "view-mode-btn active" : "view-mode-btn"
            }
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            className={
              viewMode === "year" ? "view-mode-btn active" : "view-mode-btn"
            }
            onClick={() => setViewMode("year")}
          >
            Year
          </button>
        </div>
      </div>

      <div className="top-right">
        <div className="periods-controls">
          {viewMode === "day" && (
            <>
              <ReelPicker
                label="Year"
                value={selectedPeriod.year}
                options={yearOptions}
                onChange={(value) =>
                  setSelectedPeriod((prev) => ({ ...prev, year: value }))
                }
              />

              <ReelPicker
                label="Month"
                value={selectedPeriod.month}
                options={monthOptions}
                onChange={(value) =>
                  setSelectedPeriod((prev) => ({ ...prev, month: value }))
                }
              />

              <ReelPicker
                label="Day"
                value={selectedPeriod.day}
                options={getDayOptions(
                  selectedPeriod.year,
                  selectedPeriod.month
                )}
                onChange={(value) =>
                  setSelectedPeriod((prev) => ({ ...prev, day: value }))
                }
              />
            </>
          )}

          {viewMode === "month" && (
            <>
              <ReelPicker
                label="Year"
                value={selectedPeriod.year}
                options={yearOptions}
                onChange={(value) =>
                  setSelectedPeriod((prev) => ({ ...prev, year: value }))
                }
              />

              <ReelPicker
                label="Month"
                value={selectedPeriod.month}
                options={monthOptions}
                onChange={(value) =>
                  setSelectedPeriod((prev) => ({ ...prev, month: value }))
                }
              />
            </>
          )}

          {viewMode === "year" && (
            <ReelPicker
              label="Year"
              value={selectedPeriod.year}
              options={yearOptions}
              onChange={(value) =>
                setSelectedPeriod((prev) => ({ ...prev, year: value }))
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default TopBar;