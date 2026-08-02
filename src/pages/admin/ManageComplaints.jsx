import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiChevronRight, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import SearchBar from "../../components/common/SearchBar";
import { Select } from "../../components/common/FormField";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import CategoryIcon from "../../components/common/CategoryIcon";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { STATUS_ORDER } from "../../utils/statusConfig";
import { formatDate } from "../../utils/formatDate";
import "../shared/DataTable.css";

const PAGE_SIZE = 8;

export default function ManageComplaints() {
  const { user } = useAuth();
  const { complaints, categories, staff, assignStaff } = useData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [assignTarget, setAssignTarget] = useState(null);
  const [chosenStaff, setChosenStaff] = useState("");

  const filtered = useMemo(() => {
    return complaints
      .filter((c) => !status || c.status === status)
      .filter((c) => !category || c.category === category)
      .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [complaints, status, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function openAssign(complaint) {
    setAssignTarget(complaint);
    setChosenStaff("");
  }

  function confirmAssign() {
    if (!chosenStaff) return;
    assignStaff(assignTarget.id, chosenStaff, user);
    setAssignTarget(null);
  }

  const eligibleStaff = assignTarget ? staff.filter((s) => s.specialty.includes(assignTarget.category)) : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Complaints</h1>
          <p className="text-secondary">{complaints.length} complaints across every category.</p>
        </div>
      </div>

      <Card padding="lg">
        <div className="data-table__toolbar">
          <SearchBar value={search} onChange={(v) => updateFilter(setSearch, v)} placeholder="Search by title or ID…" />
          <Select
            placeholder="All statuses"
            value={status}
            onChange={(e) => updateFilter(setStatus, e.target.value)}
            options={STATUS_ORDER.map((s) => ({ value: s, label: s }))}
          />
          <Select
            placeholder="All categories"
            value={category}
            onChange={(e) => updateFilter(setCategory, e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
        </div>

        {pageItems.length === 0 ? (
          <EmptyState icon={FiClipboard} title="No complaints match those filters" description="Try clearing a filter." />
        ) : (
          <div className="data-table__wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned to</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => {
                  const cat = categories.find((cc) => cc.id === c.category);
                  const assignedStaff = staff.find((s) => s.id === c.assignedTo);
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link to={`/admin/complaints/${c.id}`} className="my-complaints__title">
                          <strong>{c.title}</strong>
                          <span className="text-xs text-secondary">{c.id}</span>
                        </Link>
                      </td>
                      <td>
                        <span className="my-complaints__category">
                          <CategoryIcon icon={cat?.icon} /> {cat?.name}
                        </span>
                      </td>
                      <td><PriorityBadge priority={c.priority} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="text-sm">
                        {assignedStaff ? (
                          assignedStaff.name
                        ) : (
                          <button className="manage-complaints__assign-btn" onClick={() => openAssign(c)}>
                            <FiUserPlus /> Assign
                          </button>
                        )}
                      </td>
                      <td className="text-sm text-secondary">{formatDate(c.updatedAt)}</td>
                      <td>
                        <Link to={`/admin/complaints/${c.id}`} aria-label="View details" className="my-complaints__chevron">
                          <FiChevronRight />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="data-table__pagination">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </Card>

      <Modal
        open={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={assignTarget ? `Assign — ${assignTarget.id}` : ""}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignTarget(null)}>Cancel</Button>
            <Button disabled={!chosenStaff} onClick={confirmAssign}>Assign</Button>
          </>
        }
      >
        {assignTarget && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p className="text-sm text-secondary">{assignTarget.title}</p>
            <Select
              label="Staff member"
              placeholder="Choose a staff member"
              value={chosenStaff}
              onChange={(e) => setChosenStaff(e.target.value)}
              options={(eligibleStaff.length ? eligibleStaff : staff).map((s) => ({
                value: s.id,
                label: `${s.name} — ${s.department}`,
              }))}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
