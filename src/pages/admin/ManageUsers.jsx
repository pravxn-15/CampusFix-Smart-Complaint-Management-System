import { useMemo, useState } from "react";
import { FiUser, FiTrash2 } from "react-icons/fi";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { formatDate } from "../../utils/formatDate";
import "../shared/DataTable.css";

export default function ManageUsers() {
  const { users, complaints, removeUser } = useData();
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p className="text-secondary">{users.length} registered students.</p>
        </div>
      </div>

      <Card padding="lg">
        <div className="data-table__toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FiUser} title="No users found" description="Try a different search." />
        ) : (
          <div className="data-table__wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Location</th>
                  <th>Complaints raised</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="data-table__person">
                        <Avatar name={u.name} color={u.avatarColor} size={34} />
                        <div>
                          <strong style={{ display: "block", fontSize: "var(--fs-sm)" }}>{u.name}</strong>
                          <span className="text-xs text-secondary">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-secondary">{u.location}</td>
                    <td className="text-sm">{complaints.filter((c) => c.raisedBy === u.id).length}</td>
                    <td className="text-sm text-secondary">{formatDate(u.joinedAt)}</td>
                    <td>
                      <div className="data-table__actions">
                        <button className="data-table__icon-btn data-table__icon-btn--danger" onClick={() => setToDelete(u)} aria-label={`Remove ${u.name}`}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Remove user"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                removeUser(toDelete.id);
                setToDelete(null);
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p>
          Remove <strong>{toDelete?.name}</strong>'s account? Their complaint history will be preserved for records.
        </p>
      </Modal>
    </div>
  );
}
