import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  const [activities, setActivities] = useState([]);
  const [activitySearch, setActivitySearch] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedActivityUserId, setSelectedActivityUserId] = useState(null);
  const [userExpenses, setUserExpenses] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", username: "" });  

  //logout
  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

//admin protection
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

//fetch users
  const fetchUsers = (search = "") => {
    fetch(`http://127.0.0.1:8000/admin/users?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers(""); // initial load
  }, [token]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(userSearch);
    }, );
    return () => clearTimeout(delay);
  }, [userSearch, token]);

  //fetch activities
  const fetchActivities = (search = "", userID = null) => {
    const params = new URLSearchParams({ search });
    if (userID) params.append("user_id", userID);
    fetch(`http://127.0.0.1:8000/admin/activities?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setActivities)
      .catch(console.error);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchActivities(activitySearch, selectedActivityUserId);
    }, );
    return () => clearTimeout(delay);
  }, [activitySearch, selectedActivityUserId, token]);

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

//view user expenses
  const fetchUserExpenses = (userId) => {
    setSelectedUserId(userId);

    fetch(`http://127.0.0.1:8000/admin/users/${userId}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then(setUserExpenses)
      .catch(console.error);
  };

  //edit user details
  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditForm({ email: user.email, username: user.username });
  };
  
  const saveUser = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
  
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...editForm } : u))
      );
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
    }
  };

  //delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
  
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        const data = await res.json();
        console.error(data.detail);
        return;
      }
  
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">

      <header className="header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {/* Users Section */}
      <section className="admin-card">
        <h2>Users</h2>

      <div className="search">
        <h3>Search Users:</h3>  
        <input
          type="text"
          placeholder="Search by email, username, role..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="admin-search"
        />
        </div>

        <div className="admin-table">
          <div className="admin-table-header">
            <span>ID</span>
            <span>Username</span>
            <span>Email</span>
            <span>Role</span>
            <span>Actions</span>
          </div>

          {users.map((u) => (
            <div key={u.id} className="admin-table-row">
              <span>{u.id}</span>

              {editingUserId === u.id ? (
                <div>
                  <input
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="admin-search"
                  />
                </div>
              ) : (
                <span>{u.username}</span>
              )}

              {editingUserId === u.id ? (
                <input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="admin-search"
                />
              ) : (
                <span>{u.email}</span>
              )}

              <span>{u.role}</span>

              <div className="admin-actions">
                {editingUserId === u.id ? (
                  <>
                    <button className="action-btn" onClick={() => saveUser(u.id)}>Save</button>
                    <button className="action-btn" onClick={() => setEditingUserId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="action-btn" onClick={() => startEditing(u)}>Edit Info</button>
                    <button className="action-btn" onClick={() => updateUserRole(u.id, "admin")}>Make Admin</button>
                    <button className="action-btn" onClick={() => updateUserRole(u.id, "user")}>Make User</button>
                    {/*<button className="action-btn" onClick={() => fetchUserExpenses(u.id)}>View Expenses</button>*/}
                    <button className="action-btn" onClick={() => setSelectedActivityUserId(u.id)}>View Activity</button>
                    <button className="action-btn delete" onClick={() => deleteUser(u.id)}>Delete User</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* user expenses */}
      {selectedUserId && (
        <section className="admin-card">
          <h2>User {selectedUserId} Expenses</h2>

          {userExpenses.length === 0 ? (
            <p>No expenses found.</p>
          ) : (
            <div className="expense-list">
              {userExpenses.map((exp) => (
                <div key={exp.id} className="expense-item">
                  <div>
                    <strong>{exp.title}</strong>
                    <p>{exp.category}</p>
                  </div>
                  <div>${exp.amount}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* activity logs */}
      <section className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>
            {selectedActivityUserId
              ? `Activity — ${users.find(u => u.id === selectedActivityUserId)?.email ?? `User ${selectedActivityUserId}`}`
              : "Activity Logs"}
          </h2>

          {selectedActivityUserId && (
            <button className="action-btn" onClick={() => setSelectedActivityUserId(null)}>
              Show All
            </button>
          )}
        </div>

        <div className="activity-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <strong>{activity.action}</strong>
              <p>{activity.detail}</p>
              <small>User ID: {activity.user_id}</small>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default AdminDashboard;