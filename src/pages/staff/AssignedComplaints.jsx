import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import SearchBar from "../../components/common/SearchBar";
import { Select } from "../../components/common/FormField";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import CategoryIcon from "../../components/common/CategoryIcon";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { STATUS_ORDER } from "../../utils/statusConfig";
import { formatDate } from "../../utils/formatDate";
import "../shared/DataTable.css";

const PAGE_SIZE = 8;

export default function AssignedComplaints() {
  const { user } = useAuth();
  const { complaints, categories } = useData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  const mine = complaints.filter((c) => c.assignedTo === user.id);

  const filtered = useMemo(() => {
    return mine
      .filter((c) => !status || c.status === status)
      .filter((c) => !priority || c.priority === priority)
      .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [mine, status, priority, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Assigned Complaints</h1>
          <p className="text-secondary">{mine.length} complaint{mine.length !== 1 ? "s" : ""} assigned to you.</p>
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
            placeholder="All priorities"
            value={priority}
            onChange={(e) => updateFilter(setPriority, e.target.value)}
            options={["Low", "Medium", "High", "Critical"].map((p) => ({ value: p, label: p }))}
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
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => {
                  const cat = categories.find((cc) => cc.id === c.category);
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link to={`/staff/complaints/${c.id}`} className="my-complaints__title">
                          <strong>{c.title}</strong>
                          <span className="text-xs text-secondary">{c.id}</span>
                        </Link>
                      </td>
                      <td>
                        <span className="my-complaints__category">
                          <CategoryIcon icon={cat?.icon} /> {cat?.name}
                        </span>
                      </td>
                      <td className="text-sm text-secondary">{c.location}</td>
                      <td><PriorityBadge priority={c.priority} /></td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="text-sm text-secondary">{formatDate(c.updatedAt)}</td>
                      <td>
                        <Link to={`/staff/complaints/${c.id}`} aria-label="View details" className="my-complaints__chevron">
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
    </div>
  );
}
