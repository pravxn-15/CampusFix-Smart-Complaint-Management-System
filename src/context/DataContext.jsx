import { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  COMPLAINTS,
  CATEGORIES,
  NOTIFICATIONS,
  CHATS,
  ACTIVITY_LOG,
  STAFF,
  USERS,
} from "../data/mockData";
import { nextComplaintId, uid } from "../utils/id";
import { toast } from "react-toastify";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [complaints, setComplaints] = useState(COMPLAINTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [chats, setChats] = useState(CHATS);
  const [activityLog, setActivityLog] = useState(ACTIVITY_LOG);
  const [staff, setStaff] = useState(STAFF);
  const [users, setUsers] = useState(USERS);

  const logActivity = useCallback((actor, action) => {
    setActivityLog((prev) => [{ id: uid("log"), actor, action, timestamp: new Date().toISOString() }, ...prev]);
  }, []);

  const notify = useCallback((userId, title, body, complaintId) => {
    setNotifications((prev) => [
      { id: uid("n"), userId, title, body, complaintId, read: false, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const addComplaint = useCallback(
    ({ title, description, category, priority, location, images }, raisedBy) => {
      const id = nextComplaintId();
      const now = new Date().toISOString();
      const newComplaint = {
        id,
        title,
        description,
        category,
        priority,
        status: "Pending",
        location,
        raisedBy: raisedBy.id,
        assignedTo: null,
        images: images?.map((f) => f.name) || [],
        createdAt: now,
        updatedAt: now,
        estimatedResolutionHrs: categories.find((c) => c.id === category)?.avgResolutionHrs || 24,
        timeline: [{ status: "Pending", note: "Complaint submitted.", actor: raisedBy.id, timestamp: now }],
        comments: [],
        internalNotes: [],
        feedback: null,
      };
      setComplaints((prev) => [newComplaint, ...prev]);
      logActivity(raisedBy.name, `raised ${id}`);
      toast.success(`Complaint ${id} submitted.`);
      return newComplaint;
    },
    [categories, logActivity]
  );

  const updateComplaint = useCallback((id, updates) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const changeStatus = useCallback(
    (id, status, note, actor) => {
      const now = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status,
                updatedAt: now,
                timeline: [...c.timeline, { status, note, actor: actor.id, timestamp: now }],
              }
            : c
        )
      );
      logActivity(actor.name, `moved ${id} to ${status}`);
      const complaint = complaints.find((c) => c.id === id);
      if (complaint) {
        notify(complaint.raisedBy, "Status updated", `${id} is now ${status}.`, id);
      }
      toast.success(`${id} moved to ${status}.`);
    },
    [complaints, logActivity, notify]
  );

  const assignStaff = useCallback(
    (id, staffId, actor) => {
      const now = new Date().toISOString();
      const staffMember = staff.find((s) => s.id === staffId);
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                assignedTo: staffId,
                status: "Assigned",
                updatedAt: now,
                timeline: [
                  ...c.timeline,
                  {
                    status: "Assigned",
                    note: `Assigned to ${staffMember?.name || "staff"}.`,
                    actor: actor.id,
                    timestamp: now,
                  },
                ],
              }
            : c
        )
      );
      logActivity(actor.name, `assigned ${id} to ${staffMember?.name}`);
      const complaint = complaints.find((c) => c.id === id);
      if (complaint) notify(complaint.raisedBy, "Staff assigned", `${staffMember?.name} was assigned to ${id}.`, id);
      if (staffMember) notify(staffMember.id, "New assignment", `You were assigned ${id}.`, id);
      toast.success(`${staffMember?.name} assigned to ${id}.`);
    },
    [complaints, staff, logActivity, notify]
  );

  const addComment = useCallback((id, text, author) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, comments: [...c.comments, { author: author.id, text, timestamp: now }] } : c
      )
    );
  }, []);

  const addInternalNote = useCallback((id, text, author) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, internalNotes: [...c.internalNotes, { author: author.id, text, timestamp: now }] } : c
      )
    );
  }, []);

  const submitFeedback = useCallback(
    (id, rating, comment) => {
      const now = new Date().toISOString();
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, feedback: { rating, comment, timestamp: now } } : c))
      );
      toast.success("Thanks for the feedback!");
    },
    []
  );

  const sendChatMessage = useCallback((complaintId, sender, text) => {
    setChats((prev) => ({
      ...prev,
      [complaintId]: [...(prev[complaintId] || []), { id: uid("c"), sender: sender.id, text, timestamp: new Date().toISOString() }],
    }));
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback((userId) => {
    setNotifications((prev) => prev.map((n) => (n.userId === userId ? { ...n, read: true } : n)));
  }, []);

  const addCategory = useCallback((name) => {
    setCategories((prev) => [...prev, { id: uid("cat"), name, icon: "more-horizontal", avgResolutionHrs: 24 }]);
  }, []);

  const updateCategory = useCallback((id, updates) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addStaffMember = useCallback((member) => {
    setStaff((prev) => [
      ...prev,
      {
        id: uid("s"),
        role: "staff",
        activeCount: 0,
        resolvedCount: 0,
        rating: 0,
        avatarColor: "#F59E0B",
        joinedAt: new Date().toISOString().slice(0, 10),
        ...member,
      },
    ]);
  }, []);

  const removeStaffMember = useCallback((id) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const removeUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const findPerson = useCallback(
    (id) => users.find((u) => u.id === id) || staff.find((s) => s.id === id) || (id?.startsWith("a-") ? { name: "Admin" } : null),
    [users, staff]
  );

  const value = useMemo(
    () => ({
      complaints,
      categories,
      notifications,
      chats,
      activityLog,
      staff,
      users,
      addComplaint,
      updateComplaint,
      changeStatus,
      assignStaff,
      addComment,
      addInternalNote,
      submitFeedback,
      sendChatMessage,
      markNotificationRead,
      markAllNotificationsRead,
      addCategory,
      updateCategory,
      deleteCategory,
      addStaffMember,
      removeStaffMember,
      removeUser,
      findPerson,
    }),
    [
      complaints,
      categories,
      notifications,
      chats,
      activityLog,
      staff,
      users,
      addComplaint,
      updateComplaint,
      changeStatus,
      assignStaff,
      addComment,
      addInternalNote,
      submitFeedback,
      sendChatMessage,
      markNotificationRead,
      markAllNotificationsRead,
      addCategory,
      updateCategory,
      deleteCategory,
      addStaffMember,
      removeStaffMember,
      removeUser,
      findPerson,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
