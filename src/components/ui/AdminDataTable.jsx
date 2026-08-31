import React, { useState, useMemo } from 'react';
import { Spinner } from './index';

export function AdminDataTable({
  columns = [], // [{ key, label, sortable, render, className, headerClassName, align }]
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptySubtitle = 'Try changing your search keywords or active filters.',
  emptyIcon = 'ri-inbox-line',
  searchable = false,
  searchPlaceholder = 'Filter records...',
  searchKeys = [],
  pageSize = 10,
  showPagination = true,
  selectable = false,
  selectedIds = [],
  onSelectChange,
  bulkActions,
  keyField = '_id',
  onRowClick,
  rowClassName,
  className = '',
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  // Search filter
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((k) => String(row[k] || '').toLowerCase().includes(q));
      }
      return Object.values(row).some((val) =>
        String(val || '').toLowerCase().includes(q)
      );
    });
  }, [data, search, searchKeys]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = paginatedData.map((row) => row[keyField]);
      onSelectChange && onSelectChange(allIds);
    } else {
      onSelectChange && onSelectChange([]);
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    if (!onSelectChange) return;
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.includes(row[keyField]));

  return (
    <div className={`space-y-3 font-['Inter',sans-serif] ${className}`}>
      {/* Top Search & Bulk Actions Bar */}
      {(searchable || (selectable && selectedIds.length > 0)) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-2xs font-normal"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className="ri-close-line" />
                </button>
              )}
            </div>
          )}

          {selectable && selectedIds.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-xl text-xs font-semibold text-orange-700">
              <span>{selectedIds.length} selected</span>
              {bulkActions}
            </div>
          )}
        </div>
      )}

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200/80 select-none">
                {selectable && (
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, col.sortable)}
                    className={`p-3.5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${
                      col.sortable ? 'cursor-pointer hover:text-slate-900 transition-colors' : ''
                    } ${col.headerClassName || ''}`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end w-full' : ''
                      }`}
                    >
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-slate-400 text-xs">
                          {sortKey === col.key ? (
                            sortDirection === 'asc' ? (
                              <i className="ri-arrow-up-s-fill text-orange-600" />
                            ) : (
                              <i className="ri-arrow-down-s-fill text-orange-600" />
                            )
                          ) : (
                            <i className="ri-expand-up-down-line opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="p-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Spinner size={32} />
                      <span className="text-xs font-semibold text-slate-400">Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="p-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <i className={`${emptyIcon} text-3xl text-slate-300`} />
                      <p className="text-xs font-bold text-slate-700">{emptyTitle}</p>
                      {emptySubtitle && (
                        <p className="text-[11px] text-slate-400 max-w-xs">{emptySubtitle}</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rIdx) => {
                  const isSelected = selectedIds.includes(row[keyField]);
                  const customRowClass = typeof rowClassName === 'function' ? rowClassName(row) : (rowClassName || '');
                  return (
                    <tr
                      key={row[keyField] || rIdx}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={`transition-colors group ${
                        customRowClass
                          ? customRowClass
                          : `hover:bg-slate-50/80 ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? 'bg-orange-50/40' : ''}`
                      }`}
                    >
                      {selectable && (
                        <td className="p-3.5 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(row[keyField], e)}
                            className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`p-3.5 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          } ${col.className || ''}`}
                        >
                          {col.render
                            ? col.render(row[col.key], row, rIdx)
                            : row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination Bar */}
        {showPagination && sortedData.length > pageSize && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <span className="text-[11px] text-slate-400">
              Showing{' '}
              <strong className="text-slate-700 font-semibold">
                {(currentPage - 1) * pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-700 font-semibold">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </strong>{' '}
              of <strong className="text-slate-700 font-semibold">{sortedData.length}</strong>{' '}
              entries
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= currentPage - 1 && p <= currentPage + 1)
                )
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                        currentPage === p
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDataTable;
