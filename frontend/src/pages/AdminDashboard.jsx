import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userExpenses, setUserExpenses] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

//admin protection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

//fetch users and activties
  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch(console.error);

    fetch("http://127.0.0.1:8000/admin/activities", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch activities");
        return res.json();
      })
      .then(setActivities)
      .catch(console.error);
  }, [token]);

//update user role
  const updateUserRole = async (id, role) => {
    try {
      await fetch(`http://127.0.0.1:8000/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };


//view expenses
  const fetchUserExpenses = (userId) => {
    setSelectedUserId(userId);

    fetch(`http://127.0.0.1:8000/admin/users/${userId}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then(setUserExpenses)
      .catch(console.error);
  };


  return (
    <div>
        <div className="admin-header">
        <h1>Admin Dashboard</h1>

        <button onClick={handleLogout} className="logout-btn">
            Logout
        </button>
        </div>
      <h2>Users</h2>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td>
                <button onClick={() => updateUserRole(u.id, "admin")}>
                  Make Admin
                </button>

                <button onClick={() => updateUserRole(u.id, "user")}>
                  Make User
                </button>

                <button onClick={() => fetchUserExpenses(u.id)}>
                  View Expenses
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserId && (
        <div style={{ marginTop: "20px" }}>
          <h2>User {selectedUserId} Expenses</h2>

          {userExpenses.length === 0 ? (
            <p>No expenses found.</p>
          ) : (
            <ul>
              {userExpenses.map((exp) => (
                <li key={exp.id}>
                  {exp.title} — ${exp.amount} ({exp.category})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <h2 style={{ marginTop: "30px" }}>Activity Logs</h2>

      <ul>
        {activities.map((a) => (
          <li key={a.id}>
            User {a.user_id}: {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;