import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSend, FiMessageCircle, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Avatar from "../../components/common/Avatar";
import EmptyState from "../../components/common/EmptyState";
import { StatusBadge } from "../../components/common/Badge";
import { timeAgo, formatDateTime } from "../../utils/formatDate";
import "./Messages.css";

export default function Messages({ role }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { complaints, chats, sendChatMessage, findPerson } = useData();
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  const conversations = complaints.filter((c) =>
    role === "user" ? c.raisedBy === user.id && c.assignedTo : c.assignedTo === user.id
  );

  const active = conversations.find((c) => c.id === id);
  const thread = active ? chats[active.id] || [] : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.length, id]);

  const otherParty = active
    ? findPerson(role === "user" ? active.assignedTo : active.raisedBy)
    : null;

  return (
    <div className="messages">
      <div className={`messages__list ${id ? "messages__list--hidden-mobile" : ""}`}>
        <div className="messages__list-header">
          <h1>Messages</h1>
        </div>
        {conversations.length === 0 ? (
          <EmptyState
            icon={FiMessageCircle}
            title="No conversations yet"
            description={role === "user" ? "Once a staff member is assigned to your complaint, you can chat here." : "Once you're assigned a complaint, you can chat with the reporter here."}
          />
        ) : (
          <ul className="messages__conversations">
            {conversations.map((c) => {
              const party = findPerson(role === "user" ? c.assignedTo : c.raisedBy);
              const lastMsg = (chats[c.id] || [])[chats[c.id]?.length - 1];
              return (
                <li key={c.id}>
                  <button
                    className={`messages__conversation ${c.id === id ? "messages__conversation--active" : ""}`}
                    onClick={() => navigate(`/${role}/messages/${c.id}`)}
                  >
                    <Avatar name={party?.name || "?"} color={party?.avatarColor} size={40} />
                    <div className="messages__conversation-body">
                      <div className="messages__conversation-top">
                        <strong>{party?.name}</strong>
                        {lastMsg && <time>{timeAgo(lastMsg.timestamp)}</time>}
                      </div>
                      <span className="text-xs text-secondary">{c.id} · {c.title}</span>
                      {lastMsg && <p>{lastMsg.text}</p>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className={`messages__thread ${!id ? "messages__thread--hidden-mobile" : ""}`}>
        {!active ? (
          <div className="messages__empty">
            <EmptyState icon={FiMessageCircle} title="Select a conversation" description="Choose a complaint thread from the list to start chatting." />
          </div>
        ) : (
          <>
            <div className="messages__thread-header">
              <button className="messages__back" onClick={() => navigate(`/${role}/messages`)} aria-label="Back to conversations">
                <FiArrowLeft />
              </button>
              <Avatar name={otherParty?.name || "?"} color={otherParty?.avatarColor} size={36} />
              <div className="messages__thread-title">
                <strong>{otherParty?.name}</strong>
                <span className="text-xs text-secondary">{active.id} · {active.title}</span>
              </div>
              <StatusBadge status={active.status} />
            </div>

            <div className="messages__scroll" ref={scrollRef}>
              {thread.length === 0 && (
                <p className="text-sm text-secondary" style={{ textAlign: "center", marginTop: 24 }}>
                  No messages yet — say hello.
                </p>
              )}
              {thread.map((m) => {
                const mine = m.sender === user.id;
                return (
                  <div key={m.id} className={`messages__bubble-row ${mine ? "messages__bubble-row--mine" : ""}`}>
                    <div className="messages__bubble">
                      <p>{m.text}</p>
                      <time>{formatDateTime(m.timestamp)}</time>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              className="messages__composer"
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim()) return;
                sendChatMessage(active.id, user, text.trim());
                setText("");
              }}
            >
              <input
                className="field__input"
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button type="submit" className="messages__send" aria-label="Send message">
                <FiSend />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
