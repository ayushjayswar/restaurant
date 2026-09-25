import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Hotel,
  CalendarDays,
  BedDouble,
  ShoppingBag,
  Activity,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  Bell,
  Pencil,
  Trash2,
  RefreshCw,
  Home as HomeIcon,
  Info,
  PanelBottom,
  Mail,
  Save,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  sendReservationStatusEmail,
  sendRoomStatusEmail,
} from "../services/EmailService";

import ImageUploadField from "../components/Imageuploadfield";
import DynamicListEditor from "../components/Dynamiclisteditor";

const AdminPanel = () => {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();

  // ==============================
  // STATES
  // ==============================

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);
  const [food, setFood] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [orders, setOrders] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activity, setActivity] = useState([]);

  // Home / About / Footer / Contact — site content admin controls
  const [siteContent, setSiteContent] = useState(null);
  const [contentSaving, setContentSaving] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // NOTIFICATION DROPDOWN
  const [showNotifications, setShowNotifications] = useState(false);

  // ==============================
  // SORT HELPER
  // ==============================

  const sortNewestFirst = (data) => {
    return [...data].sort((a, b) => {
      const aTime =
        a.created_at
          ? new Date(a.created_at).getTime()
          : Number(a.id) || 0;

      const bTime =
        b.created_at
          ? new Date(b.created_at).getTime()
          : Number(b.id) || 0;

      return bTime - aTime;
    });
  };

  // ==============================
  // LOAD ALL DATA
  // ==============================

  const loadAllData = async () => {
    if (!user || user.role !== "admin") return;

    setLoading(true);

    try {
      const results = await Promise.allSettled([
        authFetch("/admin/users"),
        authFetch("/admin/food"),
        authFetch("/admin/rooms"),
        authFetch("/admin/orders"),
        authFetch("/admin/room-bookings"),
        authFetch("/admin/reservations"),
        authFetch("/admin/activity"),
        authFetch("/admin/content"),
      ]);

      // USERS
      if (results[0].status === "fulfilled" && results[0].value.ok) {
        const data = await results[0].value.json();
        setUsers(data.users || []);
      }

      // FOOD
      if (results[1].status === "fulfilled" && results[1].value.ok) {
        const data = await results[1].value.json();
        setFood(data.food || []);
      }

      // ROOMS
      if (results[2].status === "fulfilled" && results[2].value.ok) {
        const data = await results[2].value.json();
        setRooms(data.rooms || []);
      }

      // ORDERS
      if (results[3].status === "fulfilled" && results[3].value.ok) {
        const data = await results[3].value.json();
        setOrders(sortNewestFirst(data.orders || []));
      }

      // ROOM BOOKINGS
      if (results[4].status === "fulfilled" && results[4].value.ok) {
        const data = await results[4].value.json();
        setRoomBookings(sortNewestFirst(data.room_bookings || []));
      }

      // RESERVATIONS
      if (results[5].status === "fulfilled" && results[5].value.ok) {
        const data = await results[5].value.json();
        setReservations(sortNewestFirst(data.reservations || []));
      }

      // ACTIVITY
      if (results[6].status === "fulfilled" && results[6].value.ok) {
        const data = await results[6].value.json();
        setActivity(data.activity || []);
      }

      // SITE CONTENT (Home / About / Footer / Contact)
      if (results[7].status === "fulfilled" && results[7].value.ok) {
        const data = await results[7].value.json();
        setSiteContent(data);
      }
    } catch (error) {
      console.error("Admin data error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // SAVE ONE SITE-CONTENT SECTION
  // ==============================

  const saveSiteSection = async (section, data) => {
    setContentSaving(true);

    try {
      const response = await authFetch("/admin/content", {
        method: "PUT",
        body: JSON.stringify({ section, data }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to save");
        return;
      }

      setSiteContent(result.content);
      alert("Saved!");
    } catch (error) {
      console.error("Site content save error:", error);
      alert("Something went wrong");
    } finally {
      setContentSaving(false);
    }
  };

  // ==============================
  // IMPORTANT
  // HOOK ALWAYS RUNS
  // ==============================

  useEffect(() => {
    if (user && user.role === "admin") {
      loadAllData();
    }
  }, [user]);

  // ==============================
  // ADMIN PROTECTION
  // AFTER ALL HOOKS
  // ==============================

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-5">
        <div className="text-center">

          <div className="text-6xl mb-5">
            🔒
          </div>

          <h1 className="text-2xl font-bold text-white">
            Admin Access Required
          </h1>

          <p className="text-gray-400 mt-2 mb-6">
            You don't have permission to access this page.
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition"
          >
            Back to Website
          </button>

        </div>
      </div>
    );
  }

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ==============================
  // DELETE USER
  // ==============================

  const deleteUser = async (email) => {
    const confirmDelete = window.confirm(`Delete user ${email}?`);
    if (!confirmDelete) return;

    try {
      const response = await authFetch(
        `/admin/users/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to delete user");
        return;
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ==============================
  // DELETE FOOD
  // ==============================

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food item?")) return;

    try {
      const response = await authFetch(`/admin/food/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to delete food");
        return;
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
    }
  };

  // ==============================
  // DELETE ROOM
  // ==============================

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      const response = await authFetch(`/admin/rooms/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to delete room");
        return;
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
    }
  };

  // ==============================
  // DELETE ORDER
  // ==============================

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      const response = await authFetch(`/admin/orders/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to delete order");
        return;
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
    }
  };

  // ==============================
  // DELETE ROOM BOOKING
  // ==============================

  const deleteRoomBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      const response = await authFetch(`/admin/room-bookings/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to delete booking");
        return;
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
    }
  };

  // ==============================
  // DELETE RESERVATION
  // ==============================

  const deleteReservation = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;

    try {
      const response = await authFetch(`/admin/reservations/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to delete reservation");
        return;
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ==============================
  // UPDATE ORDER STATUS
  // ==============================

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await authFetch(`/admin/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to update order");
        return;
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
    }
  };

  // ==============================
  // UPDATE ROOM BOOKING STATUS
  // ==============================

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await authFetch(`/admin/room-bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to update booking");
        return;
      }

      const existingBooking =
        roomBookings.find((b) => String(b.id) === String(id)) || {};

      const updatedBooking = {
        ...existingBooking,
        ...(result.booking || result.room_booking || {}),
      };

      const customerEmail = updatedBooking.user_email || updatedBooking.email || "";
      const customer = users.find((u) => u.email === customerEmail);
      const bookedRoom = rooms.find(
        (r) => String(r.id) === String(updatedBooking.room_id)
      );

      try {
        await sendRoomStatusEmail({
          id: updatedBooking.id ?? id,
          user_email: customerEmail,
          email: customerEmail,
          name: updatedBooking.name || customer?.name || undefined,
          roomName: bookedRoom?.name || `Room #${updatedBooking.room_id}`,
          check_in: updatedBooking.check_in,
          check_out: updatedBooking.check_out,
          guests: updatedBooking.guests,
          total_amount: updatedBooking.total_amount,
          status: status,
        });
      } catch (emailError) {
        console.error("Room booking status email failed:", emailError);
        alert(
          "Status updated, but the email to the " +
          "customer could not be sent. " +
          (emailError?.text || emailError?.message || "")
        );
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
    }
  };

  // ==============================
  // UPDATE RESERVATION STATUS
  // ==============================

  const updateReservationStatus = async (id, status) => {
    try {
      const response = await authFetch(`/admin/reservations/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Failed to update reservation");
        return;
      }

      const updatedReservation = result.reservation || {};

      try {
        await sendReservationStatusEmail({
          id: updatedReservation.id,
          user_email: updatedReservation.user_email,
          email: updatedReservation.user_email,
          name: updatedReservation.name,
          fullName: updatedReservation.name,
          phone: updatedReservation.phone,
          date: updatedReservation.date,
          time: updatedReservation.time,
          guests: updatedReservation.guests,
          partySize: updatedReservation.guests,
          message: updatedReservation.message,
          feedback: updatedReservation.message,
          status: updatedReservation.status,
          tableNumber: updatedReservation.table_number,
          table_number: updatedReservation.table_number,
          tableRef: updatedReservation.table_number
            ? `Table ${updatedReservation.table_number}`
            : "",
          waitingPosition: updatedReservation.waiting_position,
          waiting_position: updatedReservation.waiting_position,
        });
      } catch (emailError) {
        console.error("Reservation status email failed:", emailError);
        alert(
          "Status updated, but the email to the " +
          "customer could not be sent."
        );
      }

      if (result.promoted_reservations?.length) {
        for (const promoted of result.promoted_reservations) {
          try {
            await sendReservationStatusEmail({
              id: promoted.id,
              user_email: promoted.user_email,
              email: promoted.user_email,
              name: promoted.name,
              fullName: promoted.name,
              phone: promoted.phone,
              date: promoted.date,
              time: promoted.time,
              guests: promoted.guests,
              partySize: promoted.guests,
              message: promoted.message,
              feedback: promoted.message,
              status: promoted.status,
              tableNumber: promoted.table_number,
              table_number: promoted.table_number,
              tableRef: promoted.table_number
                ? `Table ${promoted.table_number}`
                : "",
              waitingPosition: promoted.waiting_position,
              waiting_position: promoted.waiting_position,
            });
          } catch (emailError) {
            console.error("Promoted reservation email failed:", emailError);
          }
        }
      }

      await loadAllData();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ==============================
  // MENU
  // ==============================

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "users", name: "Users", icon: Users },
    { id: "food", name: "Food Menu", icon: UtensilsCrossed },
    { id: "rooms", name: "Rooms", icon: Hotel },
    { id: "reservations", name: "Reservations", icon: CalendarDays },
    { id: "room-bookings", name: "Room Bookings", icon: BedDouble },
    { id: "orders", name: "Orders", icon: ShoppingBag },
    { id: "activity", name: "Activity", icon: Activity },
  ];

  // Site content — Home / About / Footer / Contact — separate group
  const contentMenuItems = [
    { id: "home-content", name: "Home", icon: HomeIcon },
    { id: "about-content", name: "About Page", icon: Info },
    { id: "footer-content", name: "Footer", icon: PanelBottom },
    { id: "contact-content", name: "Contact", icon: Mail },
  ];

  // ==============================
  // TAB CHANGE
  // ==============================

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setSearch("");
  };

  // ==============================
  // SEARCH
  // ==============================

  const filterData = (data) => {
    if (!search.trim()) {
      return data;
    }

    const searchValue = search.toLowerCase();

    return data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchValue)
    );
  };

  // ==============================
  // NOTIFICATIONS (derived from live data)
  // ==============================

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const pendingReservations = reservations.filter(
    (r) => r.status === "pending" || r.status === "waiting"
  );
  const pendingBookings = roomBookings.filter((b) => b.status === "pending");

  const notificationCount =
    pendingOrders.length + pendingReservations.length + pendingBookings.length;

  const hasNotifications = notificationCount > 0;

  const goToTabFromNotification = (tab) => {
    setActiveTab(tab);
    setShowNotifications(false);
    setSidebarOpen(false);
    setSearch("");
  };

  const activeTabLabel = () => {
    const fromMain = menuItems.find((m) => m.id === activeTab);
    if (fromMain) return fromMain.name;
    const fromContent = contentMenuItems.find((m) => m.id === activeTab);
    if (fromContent) return fromContent.name;
    return activeTab;
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          z-50
          h-screen
          w-72
          bg-gray-900
          border-r border-gray-800
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* LOGO */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-800">

          <div>
            <h1 className="text-2xl font-bold">
              Fork<span className="text-red-500">&</span>Flame
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X size={22} />
          </button>

        </div>

        {/* ADMIN CARD */}

        <div className="p-5">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800">

            <div className="w-11 h-11 shrink-0 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="min-w-0">

              <p className="font-semibold truncate">
                {user.name}
              </p>

              <p className="text-xs text-gray-400 truncate">
                {user.email}
              </p>

              <p className="text-[10px] uppercase text-red-400 font-bold mt-1">
                Administrator
              </p>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 px-4 overflow-y-auto">

          <p className="text-[11px] uppercase tracking-wider text-gray-500 px-3 mb-3">
            Management
          </p>

          <div className="space-y-1 mb-6">

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => changeTab(item.id)}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition
                    ${
                      active
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </button>
              );
            })}

          </div>

          <p className="text-[11px] uppercase tracking-wider text-gray-500 px-3 mb-3">
            Site Content
          </p>

          <div className="space-y-1">

            {contentMenuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => changeTab(item.id)}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition
                    ${
                      active
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                  `}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </button>
              );
            })}

          </div>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="p-4 border-t border-gray-800 space-y-2">

          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition"
          >
            <span className="text-lg">→</span>
            View Website
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="flex-1 min-w-0">

        {/* HEADER */}

        <header className="h-20 bg-gray-950 border-b border-gray-800 sticky top-0 z-30">

          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-300"
              >
                <Menu size={24} />
              </button>

              <div>

                <h2 className="text-xl sm:text-2xl font-bold">
                  {activeTabLabel()}
                </h2>

                <p className="hidden sm:block text-sm text-gray-500">
                  Manage your restaurant from here
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 sm:gap-3">

              {/* SEARCH */}

              {![
                "dashboard",
                "home-content",
                "about-content",
                "footer-content",
                "contact-content",
              ].includes(activeTab) && (
                <div className="hidden md:flex items-center bg-gray-900 border border-gray-800 rounded-xl px-3">

                  <Search size={17} className="text-gray-500" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-40 lg:w-56 bg-transparent outline-none px-3 py-2 text-sm text-white"
                  />

                </div>
              )}

              {/* REFRESH */}

              <button
                onClick={loadAllData}
                className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition"
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              {/* NOTIFICATION */}

              <div className="relative">

                <button
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative p-2.5 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition"
                  title="Notifications"
                >

                  <Bell size={19} />

                  {hasNotifications && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}

                </button>

                {showNotifications && (
                  <>
                    <div
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />

                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-50">

                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                        <span className="font-semibold text-sm">Notifications</span>

                        {hasNotifications && (
                          <span className="text-xs text-gray-500">
                            {notificationCount} new
                          </span>
                        )}
                      </div>

                      <div className="divide-y divide-gray-800">

                        {!hasNotifications && (
                          <div className="px-4 py-8 text-center text-gray-500 text-sm">
                            No new notifications
                          </div>
                        )}

                        {pendingOrders.map((o) => (
                          <button
                            key={`order-${o.id}`}
                            onClick={() => goToTabFromNotification("orders")}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800/50 transition"
                          >
                            <p className="text-white font-medium">New order #{o.id}</p>
                            <p className="text-gray-500 text-xs mt-0.5">
                              {o.user_email || "-"} · ₹{o.total_amount || 0}
                            </p>
                          </button>
                        ))}

                        {pendingReservations.map((r) => (
                          <button
                            key={`res-${r.id}`}
                            onClick={() => goToTabFromNotification("reservations")}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800/50 transition"
                          >
                            <p className="text-white font-medium">
                              Reservation #{r.id} — {r.status}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5">
                              {r.name || r.user_email || "-"}
                              {r.date ? ` · ${r.date}` : ""}
                            </p>
                          </button>
                        ))}

                        {pendingBookings.map((b) => (
                          <button
                            key={`booking-${b.id}`}
                            onClick={() => goToTabFromNotification("room-bookings")}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-800/50 transition"
                          >
                            <p className="text-white font-medium">Room booking #{b.id}</p>
                            <p className="text-gray-500 text-xs mt-0.5">
                              {b.user_email || "-"}
                            </p>
                          </button>
                        ))}

                      </div>

                    </div>
                  </>
                )}

              </div>

            </div>

          </div>

        </header>

        {/* =========================
            CONTENT
        ========================= */}

        <div className="p-4 sm:p-6 lg:p-8">

          {/* DASHBOARD */}

          {activeTab === "dashboard" && (
            <Dashboard
              users={users}
              food={food}
              rooms={rooms}
              orders={orders}
              roomBookings={roomBookings}
              reservations={reservations}
              activity={activity}
              setActiveTab={setActiveTab}
            />
          )}

          {/* USERS */}

          {activeTab === "users" && (
            <UsersPage
              data={filterData(users)}
              onDelete={deleteUser}
              onEdit={(item) => {
                setEditingItem(item);
                setModal("user");
              }}
              onAdd={() => {
                setEditingItem(null);
                setModal("user");
              }}
            />
          )}

          {/* FOOD */}

          {activeTab === "food" && (
            <FoodPage
              data={filterData(food)}
              onDelete={deleteFood}
              onEdit={(item) => {
                setEditingItem(item);
                setModal("food");
              }}
              onAdd={() => {
                setEditingItem(null);
                setModal("food");
              }}
            />
          )}

          {/* ROOMS */}

          {activeTab === "rooms" && (
            <RoomsPage
              data={filterData(rooms)}
              onDelete={deleteRoom}
              onEdit={(item) => {
                setEditingItem(item);
                setModal("room");
              }}
              onAdd={() => {
                setEditingItem(null);
                setModal("room");
              }}
            />
          )}

          {/* ORDERS */}

          {activeTab === "orders" && (
            <OrdersPage
              data={filterData(orders)}
              onDelete={deleteOrder}
              onStatusChange={updateOrderStatus}
            />
          )}

          {/* ROOM BOOKINGS */}

          {activeTab === "room-bookings" && (
            <RoomBookingsPage
              data={filterData(roomBookings)}
              onDelete={deleteRoomBooking}
              onStatusChange={updateBookingStatus}
            />
          )}

          {/* ACTIVITY */}

          {activeTab === "activity" && (
            <ActivityPage data={filterData(activity)} />
          )}

          {/* RESERVATIONS */}

          {activeTab === "reservations" && (
            <ReservationsPage
              data={filterData(reservations)}
              onDelete={deleteReservation}
              onStatusChange={updateReservationStatus}
            />
          )}

          {/* SITE CONTENT — loading guard for all four */}

          {["home-content", "about-content", "footer-content", "contact-content"].includes(activeTab) &&
            !siteContent && (
              <div className="text-center py-16 text-gray-500">
                Loading content...
              </div>
            )}

          {activeTab === "home-content" && siteContent && (
            <HomeContentPage
              content={siteContent.hero}
              onSave={(data) => saveSiteSection("hero", data)}
              saving={contentSaving}
              authFetch={authFetch}
            />
          )}

          {activeTab === "about-content" && siteContent && (
            <AboutContentPage
              content={siteContent.about}
              onSave={(data) => saveSiteSection("about", data)}
              saving={contentSaving}
              authFetch={authFetch}
            />
          )}

          {activeTab === "footer-content" && siteContent && (
            <FooterContentPage
              content={siteContent.footer}
              onSave={(data) => saveSiteSection("footer", data)}
              saving={contentSaving}
            />
          )}

          {activeTab === "contact-content" && siteContent && (
            <ContactContentPage
              content={siteContent.contact}
              onSave={(data) => saveSiteSection("contact", data)}
              saving={contentSaving}
            />
          )}

        </div>

      </main>

      {/* =========================
          MODALS
      ========================= */}

      {modal === "user" && (
        <UserModal
          item={editingItem}
          close={() => setModal(null)}
          reload={loadAllData}
          authFetch={authFetch}
        />
      )}

      {modal === "food" && (
        <FoodModal
          item={editingItem}
          close={() => setModal(null)}
          reload={loadAllData}
          authFetch={authFetch}
        />
      )}

      {modal === "room" && (
        <RoomModal
          item={editingItem}
          close={() => setModal(null)}
          reload={loadAllData}
          authFetch={authFetch}
        />
      )}

    </div>
  );
};


/* =====================================================
   DASHBOARD
===================================================== */

const Dashboard = ({
  users,
  food,
  rooms,
  orders,
  roomBookings,
  reservations,
  activity,
  setActiveTab,
}) => {

  const stats = [
    { title: "Total Users", value: users.length, icon: Users },
    { title: "Food Items", value: food.length, icon: UtensilsCrossed },
    { title: "Total Rooms", value: rooms.length, icon: Hotel },
    { title: "Orders", value: orders.length, icon: ShoppingBag },
    { title: "Room Bookings", value: roomBookings.length, icon: BedDouble },
    { title: "Reservations", value: reservations.length, icon: CalendarDays },
    { title: "Activities", value: activity.length, icon: Activity },
  ];

  return (
    <div className="space-y-7">

      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-red-600/20 via-gray-900 to-gray-900 border border-red-500/20">

        <p className="text-red-400 text-sm font-medium">
          Welcome back, Admin 👋
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold mt-2">
          Restaurant Overview
        </h1>

        <p className="text-gray-400 mt-2">
          Live data from your FastAPI backend.
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-red-500/30 transition"
            >

              <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <Icon size={21} />
              </div>

              <p className="text-gray-500 text-sm mt-5">{stat.title}</p>

              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>

            </div>
          );
        })}

      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

        <h3 className="text-lg font-semibold">Quick Actions</h3>

        <p className="text-sm text-gray-500 mt-1">
          Quickly open management sections.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

          <QuickButton icon={Users} title="Users" onClick={() => setActiveTab("users")} />
          <QuickButton icon={UtensilsCrossed} title="Food" onClick={() => setActiveTab("food")} />
          <QuickButton icon={Hotel} title="Rooms" onClick={() => setActiveTab("rooms")} />
          <QuickButton
            icon={CalendarDays}
            title="Reservations"
            onClick={() => setActiveTab("reservations")}
          />

        </div>

      </div>

    </div>
  );
};


/* =====================================================
   USERS PAGE
===================================================== */

const UsersPage = ({ data, onDelete, onEdit, onAdd }) => {
  return (
    <ManagementLayout
      title="Users"
      description="Manage all registered users."
      button="Add User"
      onAdd={onAdd}
    >
      <Table headers={["Name", "Email", "Username", "Role", "Actions"]}>
        {data.length === 0 ? (
          <EmptyRow colSpan={5} />
        ) : (
          data.map((item) => (
            <tr key={item.email} className="border-t border-gray-800 hover:bg-gray-800/40">
              <td className="px-5 py-4 font-medium">{item.name}</td>
              <td className="px-5 py-4 text-gray-400">{item.email}</td>
              <td className="px-5 py-4 text-gray-400">{item.username}</td>
              <td className="px-5 py-4">
                <StatusBadge status={item.role || "user"} />
              </td>
              <td className="px-5 py-4">
                <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item.email)} />
              </td>
            </tr>
          ))
        )}
      </Table>
    </ManagementLayout>
  );
};


/* =====================================================
   FOOD PAGE
===================================================== */

const FoodPage = ({ data, onDelete, onEdit, onAdd }) => {
  return (
    <ManagementLayout
      title="Food Menu"
      description="Manage your restaurant food menu."
      button="Add Food"
      onAdd={onAdd}
    >
      <Table headers={["Food", "Category", "Price", "Available", "Actions"]}>
        {data.length === 0 ? (
          <EmptyRow colSpan={5} />
        ) : (
          data.map((item) => (
            <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/40">
              <td className="px-5 py-4 font-medium">{item.name}</td>
              <td className="px-5 py-4 text-gray-400">{item.category || "-"}</td>
              <td className="px-5 py-4">₹{item.price}</td>
              <td className="px-5 py-4">
                <StatusBadge status={item.available ? "Available" : "Unavailable"} />
              </td>
              <td className="px-5 py-4">
                <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
              </td>
            </tr>
          ))
        )}
      </Table>
    </ManagementLayout>
  );
};


/* =====================================================
   ROOMS PAGE
===================================================== */

const RoomsPage = ({ data, onDelete, onEdit, onAdd }) => {
  return (
    <ManagementLayout
      title="Rooms"
      description="Manage hotel rooms and availability."
      button="Add Room"
      onAdd={onAdd}
    >
      <Table headers={["Room", "Price", "Facilities", "Available", "Actions"]}>
        {data.length === 0 ? (
          <EmptyRow colSpan={5} />
        ) : (
          data.map((item) => (
            <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/40">
              <td className="px-5 py-4 font-medium">{item.name}</td>
              <td className="px-5 py-4">₹{item.price}</td>
              <td className="px-5 py-4 text-gray-400 max-w-xs">
                {Array.isArray(item.facilities) ? item.facilities.join(", ") : "-"}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={item.available ? "Available" : "Unavailable"} />
              </td>
              <td className="px-5 py-4">
                <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
              </td>
            </tr>
          ))
        )}
      </Table>
    </ManagementLayout>
  );
};


/* =====================================================
   ORDERS PAGE
===================================================== */

const OrdersPage = ({ data, onDelete, onStatusChange }) => {
  return (
    <ManagementLayout title="Orders" description="Manage customer orders and status.">
      <Table headers={["Order ID", "Customer", "Amount", "Status", "Actions"]}>
        {data.length === 0 ? (
          <EmptyRow colSpan={5} />
        ) : (
          data.map((item) => (
            <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/40">
              <td className="px-5 py-4 font-medium">#{item.id}</td>
              <td className="px-5 py-4 text-gray-400">{item.user_email || "-"}</td>
              <td className="px-5 py-4">₹{item.total_amount || 0}</td>
              <td className="px-5 py-4">
                <select
                  value={item.status || "pending"}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 outline-none text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={17} />
                </button>
              </td>
            </tr>
          ))
        )}
      </Table>
    </ManagementLayout>
  );
};


/* =====================================================
   ROOM BOOKINGS
===================================================== */

const RoomBookingsPage = ({ data, onDelete, onStatusChange }) => {
  return (
    <ManagementLayout title="Room Bookings" description="Manage customer room bookings.">
      <Table headers={["Booking", "Customer", "Room", "Check In", "Check Out", "Status", "Actions"]}>
        {data.length === 0 ? (
          <EmptyRow colSpan={7} />
        ) : (
          data.map((item) => (
            <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/40">
              <td className="px-5 py-4 font-medium">#{item.id}</td>
              <td className="px-5 py-4 text-gray-400">{item.user_email || "-"}</td>
              <td className="px-5 py-4">{item.room_id ? `Room #${item.room_id}` : "-"}</td>
              <td className="px-5 py-4 text-gray-400">{item.check_in || "-"}</td>
              <td className="px-5 py-4 text-gray-400">{item.check_out || "-"}</td>
              <td className="px-5 py-4">
                <select
                  value={item.status || "pending"}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 outline-none text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="waiting">Waiting</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 size={17} />
                </button>
              </td>
            </tr>
          ))
        )}
      </Table>
    </ManagementLayout>
  );
};


/* =====================================================
   ACTIVITY
===================================================== */

const ActivityPage = ({ data }) => {
  return (
    <ManagementLayout title="Activity" description="View recent user and admin activity.">
      <Table headers={["Action", "User", "Details", "Time"]}>
        {data.length === 0 ? (
          <EmptyRow colSpan={4} />
        ) : (
          data.map((item, index) => (
            <tr key={item.id || index} className="border-t border-gray-800">
              <td className="px-5 py-4">
                <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs">
                  {item.action || "-"}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-400">{item.user_email || "-"}</td>
              <td className="px-5 py-4 text-gray-400">{item.details || "-"}</td>
              <td className="px-5 py-4 text-gray-500">{item.timestamp || item.time || "-"}</td>
            </tr>
          ))
        )}
      </Table>
    </ManagementLayout>
  );
};


/* =====================================================
   RESERVATIONS
===================================================== */

const ReservationsPage = ({ data, onDelete, onStatusChange }) => {
  return (
    <ManagementLayout title="Reservations" description="Manage table reservations and waiting list.">
      <Table headers={["ID", "Customer", "Contact", "Date & Time", "Guests", "Table", "Status", "Actions"]}>
        {data.length === 0 ? (
          <EmptyRow colSpan={8} />
        ) : (
          data.map((item) => (
            <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/40">
              <td className="px-5 py-4 font-medium">#{item.id}</td>
              <td className="px-5 py-4">
                <p className="font-medium">{item.name || "-"}</p>
                <p className="text-xs text-gray-500">{item.user_email || "-"}</p>
              </td>
              <td className="px-5 py-4 text-gray-400">{item.phone || "-"}</td>
              <td className="px-5 py-4 text-gray-400">
                <p>{item.date || "-"}</p>
                <p className="text-xs text-gray-500">{item.time || "-"}</p>
              </td>
              <td className="px-5 py-4">{item.guests ?? "-"}</td>
              <td className="px-5 py-4">
                {item.status === "waiting" ? (
                  <span className="text-yellow-400 text-xs font-medium">
                    Waiting #{item.waiting_position ?? "-"}
                  </span>
                ) : item.status === "pending" ? (
                  <span className="text-gray-500 text-xs">Not assigned yet</span>
                ) : item.table_number ? (
                  `Table ${item.table_number}`
                ) : (
                  "-"
                )}
              </td>
              <td className="px-5 py-4">
                <select
                  value={item.status || "pending"}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 outline-none text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="waiting">Waiting</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-5 py-4">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={17} />
                </button>
              </td>
            </tr>
          ))
        )}
      </Table>
    </ManagementLayout>
  );
};


/* =====================================================
   SITE CONTENT — shared layout with a Save button
===================================================== */

const ContentLayout = ({ title, description, onSave, saving, children }) => {
  return (
    <div className="space-y-6 max-w-3xl">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl font-medium transition"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        {children}
      </div>

    </div>
  );
};


/* =====================================================
   HOME (HERO) CONTENT
===================================================== */

const HomeContentPage = ({ content, onSave, saving, authFetch }) => {
  const [form, setForm] = useState(content);

  return (
    <ContentLayout
      title="Home"
      description="Controls the hero section on your homepage."
      onSave={() => onSave(form)}
      saving={saving}
    >

      <Input
        label="Heading"
        value={form.heading}
        onChange={(value) => setForm({ ...form, heading: value })}
      />

      <div>
        <label className="block text-sm text-gray-400 mb-2">Subtext</label>
        <textarea
          value={form.subtext}
          onChange={(e) => setForm({ ...form, subtext: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:border-red-500 text-white resize-none"
        />
      </div>

      <ImageUploadField
        label="Background Image"
        value={form.background_image}
        onChange={(url) => setForm({ ...form, background_image: url })}
        authFetch={authFetch}
      />

      <DynamicListEditor
        label="Buttons"
        addLabel="Add Button"
        items={form.buttons}
        onChange={(buttons) => setForm({ ...form, buttons })}
        emptyItem={{ text: "New Button", link: "/" }}
        fields={[
          { key: "text", label: "Button Text", type: "text" },
          { key: "link", label: "Link (e.g. /reservation)", type: "text" },
        ]}
      />

    </ContentLayout>
  );
};


/* =====================================================
   ABOUT PAGE CONTENT
===================================================== */

const ABOUT_BADGE_ICONS = ["utensils", "wine"];

const AboutContentPage = ({ content, onSave, saving, authFetch }) => {
  const [form, setForm] = useState(content);

  // paragraphs are plain strings — wrap as {text} rows just for the editor
  const paragraphItems = (form.paragraphs || []).map((text) => ({ text }));

  return (
    <ContentLayout
      title="About Page"
      description="Controls the 'Our Story' section."
      onSave={() => onSave(form)}
      saving={saving}
    >

      <Input
        label="Eyebrow (small label above heading)"
        value={form.eyebrow}
        onChange={(value) => setForm({ ...form, eyebrow: value })}
      />

      <Input
        label="Heading"
        value={form.heading}
        onChange={(value) => setForm({ ...form, heading: value })}
      />

      <Input
        label="Sub-heading"
        value={form.subheading}
        onChange={(value) => setForm({ ...form, subheading: value })}
      />

      <ImageUploadField
        label="Story Image"
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
        authFetch={authFetch}
      />

      <DynamicListEditor
        label="Paragraphs"
        addLabel="Add Paragraph"
        items={paragraphItems}
        onChange={(items) => setForm({ ...form, paragraphs: items.map((i) => i.text) })}
        emptyItem={{ text: "" }}
        fields={[{ key: "text", label: "Paragraph", type: "textarea", fullWidth: true }]}
      />

      <DynamicListEditor
        label="Badges"
        addLabel="Add Badge"
        items={form.badges}
        onChange={(badges) => setForm({ ...form, badges })}
        emptyItem={{ icon: "utensils", label: "New Badge" }}
        fields={[
          { key: "icon", label: "Icon", type: "select", options: ABOUT_BADGE_ICONS },
          { key: "label", label: "Label", type: "text" },
        ]}
      />

    </ContentLayout>
  );
};


/* =====================================================
   FOOTER CONTENT
===================================================== */

const FOOTER_SOCIAL_PLATFORMS = ["facebook", "twitter", "instagram", "whatsapp"];

const FooterContentPage = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content);

  return (
    <ContentLayout
      title="Footer"
      description="Controls the footer shown on every page."
      onSave={() => onSave(form)}
      saving={saving}
    >

      <div>
        <label className="block text-sm text-gray-400 mb-2">Tagline</label>
        <textarea
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:border-red-500 text-white resize-none"
        />
      </div>

      <Input
        label="Address"
        value={form.address}
        onChange={(value) => setForm({ ...form, address: value })}
      />

      <Input
        label="Email"
        value={form.email}
        onChange={(value) => setForm({ ...form, email: value })}
      />

      <DynamicListEditor
        label="Social Links"
        addLabel="Add Social"
        items={form.socials}
        onChange={(socials) => setForm({ ...form, socials })}
        emptyItem={{ platform: "facebook", url: "#" }}
        fields={[
          { key: "platform", label: "Platform", type: "select", options: FOOTER_SOCIAL_PLATFORMS },
          { key: "url", label: "URL", type: "text" },
        ]}
      />

      <DynamicListEditor
        label="Quick Links"
        addLabel="Add Link"
        items={form.links}
        onChange={(links) => setForm({ ...form, links })}
        emptyItem={{ label: "New Link", url: "/" }}
        fields={[
          { key: "label", label: "Label", type: "text" },
          { key: "url", label: "URL", type: "text" },
        ]}
      />

    </ContentLayout>
  );
};


/* =====================================================
   CONTACT CONTENT
===================================================== */

const CONTACT_ICONS = ["location", "phone", "email", "time"];

const ContactContentPage = ({ content, onSave, saving }) => {
  const [form, setForm] = useState(content);

  return (
    <ContentLayout
      title="Contact"
      description="Controls the contact page hero and info card."
      onSave={() => onSave(form)}
      saving={saving}
    >

      <Input
        label="Heading"
        value={form.heading}
        onChange={(value) => setForm({ ...form, heading: value })}
      />

      <div>
        <label className="block text-sm text-gray-400 mb-2">Subtext</label>
        <textarea
          value={form.subtext}
          onChange={(e) => setForm({ ...form, subtext: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:border-red-500 text-white resize-none"
        />
      </div>

      <DynamicListEditor
        label="Info Rows"
        addLabel="Add Row"
        items={form.info_rows}
        onChange={(info_rows) => setForm({ ...form, info_rows })}
        emptyItem={{ icon: "location", title: "New Row", lines: [""] }}
        fields={[
          { key: "icon", label: "Icon", type: "select", options: CONTACT_ICONS },
          { key: "title", label: "Title", type: "text" },
          { key: "lines", label: "Lines (one per row)", type: "lines", fullWidth: true },
        ]}
      />

    </ContentLayout>
  );
};


/* =====================================================
   USER MODAL
===================================================== */

const UserModal = ({ item, close, reload, authFetch }) => {

  const [form, setForm] = useState({
    name: item?.name || "",
    username: item?.username || "",
    email: item?.email || "",
    password: "",
    role: item?.role || "user",
  });

  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let response;

      if (item) {
        const body = {
          name: form.name,
          username: form.username,
          role: form.role,
        };

        if (form.password.trim()) {
          body.password = form.password;
        }

        response = await authFetch(`/admin/users/${encodeURIComponent(item.email)}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        response = await authFetch("/admin/users", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Something went wrong");
        return;
      }

      close();
      await reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={item ? "Edit User" : "Add User"} close={close}>
      <form onSubmit={submit} className="space-y-4">

        <Input label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Input label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} />

        {!item && (
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm({ ...form, email: value })}
          />
        )}

        <Input
          label={item ? "New Password" : "Password"}
          type="password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
          required={!item}
        />

        <Select
          label="Role"
          value={form.role}
          options={["user", "admin"]}
          onChange={(value) => setForm({ ...form, role: value })}
        />

        <SubmitButton text={saving ? "Saving..." : item ? "Update User" : "Add User"} disabled={saving} />

      </form>
    </Modal>
  );
};


/* =====================================================
   FOOD MODAL
===================================================== */

const FOOD_CATEGORIES = [
  "Junk Food",
  "Starters",
  "Main Course",
  "Desserts",
  "Drinks",
  "Beverages",
  "Combos",
];

const FoodModal = ({ item, close, reload, authFetch }) => {

  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    category: item?.category || FOOD_CATEGORIES[0],
    image: item?.image || "",
    available: item?.available ?? true,
  });

  const categoryOptions =
    form.category && !FOOD_CATEGORIES.includes(form.category)
      ? [form.category, ...FOOD_CATEGORIES]
      : FOOD_CATEGORIES;

  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = item ? `/admin/food/${item.id}` : "/admin/food";

      const response = await authFetch(url, {
        method: item ? "PUT" : "POST",
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          image: form.image,
          available: form.available,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Food operation failed");
        return;
      }

      close();
      await reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={item ? "Edit Food" : "Add Food"} close={close}>
      <form onSubmit={submit} className="space-y-4">

        <Input label="Food Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Input
          label="Description"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
        />
        <Input
          label="Price"
          type="number"
          value={form.price}
          onChange={(value) => setForm({ ...form, price: value })}
        />

        <Select
          label="Category"
          value={form.category}
          options={categoryOptions}
          onChange={(value) => setForm({ ...form, category: value })}
        />

        <ImageUploadField
          label="Food Image"
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
          authFetch={authFetch}
        />

        <label className="flex items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="w-4 h-4 accent-red-600"
          />
          Available
        </label>

        <SubmitButton text={saving ? "Saving..." : item ? "Update Food" : "Add Food"} disabled={saving} />

      </form>
    </Modal>
  );
};


/* =====================================================
   ROOM MODAL
===================================================== */

const RoomModal = ({ item, close, reload, authFetch }) => {

  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    image: item?.image || "",
    facilities: Array.isArray(item?.facilities) ? item.facilities.join(", ") : "",
    available: item?.available ?? true,
  });

  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: form.image,
        facilities: form.facilities.split(",").map((item) => item.trim()).filter(Boolean),
        available: form.available,
      };

      const url = item ? `/admin/rooms/${item.id}` : "/admin/rooms";

      const response = await authFetch(url, {
        method: item ? "PUT" : "POST",
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.detail || "Room operation failed");
        return;
      }

      close();
      await reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={item ? "Edit Room" : "Add Room"} close={close}>
      <form onSubmit={submit} className="space-y-4">

        <Input label="Room Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
        <Input
          label="Description"
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
        />
        <Input
          label="Price"
          type="number"
          value={form.price}
          onChange={(value) => setForm({ ...form, price: value })}
        />

        <ImageUploadField
          label="Room Image"
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
          authFetch={authFetch}
        />

        <Input
          label="Facilities"
          placeholder="AC, WiFi, TV, Parking"
          value={form.facilities}
          onChange={(value) => setForm({ ...form, facilities: value })}
        />

        <label className="flex items-center gap-3 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="w-4 h-4 accent-red-600"
          />
          Available
        </label>

        <SubmitButton text={saving ? "Saving..." : item ? "Update Room" : "Add Room"} disabled={saving} />

      </form>
    </Modal>
  );
};


/* =====================================================
   COMMON COMPONENTS
===================================================== */

const ManagementLayout = ({ title, description, button, onAdd, children }) => {
  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        {button && (
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition"
          >
            <Plus size={18} />
            {button}
          </button>
        )}

      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">{children}</div>
      </div>

    </div>
  );
};


const Table = ({ headers, children }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-800/60">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-5 py-4 text-left text-gray-400 font-medium whitespace-nowrap">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};


const EmptyRow = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-gray-500">
        No data found.
      </td>
    </tr>
  );
};


const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
        title="Edit"
      >
        <Pencil size={16} />
      </button>

      <button
        onClick={onDelete}
        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};


const StatusBadge = ({ status }) => {
  const positiveStatuses = ["admin", "Available", "available", "completed", "confirmed"];
  const positive = positiveStatuses.includes(status);

  return (
    <span
      className={`
        inline-flex px-2.5 py-1 rounded-lg text-xs font-medium
        ${positive ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}
      `}
    >
      {status}
    </span>
  );
};


const QuickButton = ({ icon: Icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-gray-800/60 hover:bg-gray-800 rounded-xl border border-gray-800 hover:border-red-500/30 text-left transition"
    >
      <Icon size={20} className="text-red-400" />
      <span>{title}</span>
    </button>
  );
};


const Input = ({ label, type = "text", value, onChange, placeholder, required = true }) => {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:border-red-500 text-white placeholder:text-gray-600"
      />
    </div>
  );
};


const Select = ({ label, value, options, onChange }) => {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none text-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};


const SubmitButton = ({ text, disabled = false }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition"
    >
      {text}
    </button>
  );
};


const Modal = ({ title, close, children }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">{children}</div>

      </div>
    </div>
  );
};


export default AdminPanel;