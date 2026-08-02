import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiPlusCircle, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import SearchBar from "../../components/common/SearchBar";
import { Select } from "../../components/common/FormField";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import CategoryIcon from "../../components/common/CategoryIcon";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { STATUS_ORDER } from "../../utils/statusConfig";
import { formatDate } from "../../utils/formatDate";
import "../shared/DataTable.css";

const PAGE_SIZE = 6;

export default function MyComplaints() {
  const { user } = useAuth();
  const { complaints, categories } = useData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const mine = complaints.filter((c) => c.raisedBy === user.id);

  const filtered = useMemo(() => {
    return mine
      .filter((c) => !status || c.status === status)
      .filter((c) => !category || c.category === category)
      .filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [mine, status, category, search]);

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
          <h1>My Complaints</h1>
          <p className="text-secondary">{mine.length} complaint{mine.length !== 1 ? "s" : ""} raised so far.</p>
        </div>
        <Button as={Link} to="/user/raise-complaint" icon={FiPlusCircle}>
          Raise a complaint
        </Button>
      </div>

      <Card padding="lg">
        <div className="my-complaints__toolbar">
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
          <EmptyState
            icon={FiClipboard}
            title="No complaints match those filters"
            description="Try clearing a filter, or raise a new complaint."
          />
        ) : (
          <div className="my-complaints__table-wrap">
            <table className="my-complaints__table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Category</th>
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
                        <Link to={`/user/complaints/${c.id}`} className="my-complaints__title">
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
                      <td className="text-sm text-secondary">{formatDate(c.updatedAt)}</td>
                      <td>
                        <Link to={`/user/complaints/${c.id}`} aria-label="View details" className="my-complaints__chevron">
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
          <div className="my-complaints__pagination">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
}
