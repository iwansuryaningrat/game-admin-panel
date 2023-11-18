import { HTMLProps, useEffect, useMemo, useRef, useState } from 'react';
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import scoreData from '../../data/SCORE_DATA.json';
import { ScoreProps } from '../../interfaces/api';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  SearchIcon,
} from 'lucide-react';

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className="cursor-pointer forms-checkbox"
      {...rest}
    />
  );
}

function MyTable() {
  const [filter, setFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const data = useMemo(() => scoreData, []);
  const headerClass: Record<string, string> = {
    checkboxs: 'w-14 text-center',
    row_number: 'w-12',
    name: '',
    score: '',
  };

  const columnHelper = createColumnHelper<ScoreProps>();
  const defaultColumns = useMemo(
    () => [
      columnHelper.display({
        id: 'checkboxs',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      }),
      columnHelper.display({
        id: 'row_number',
        header: '#',
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor('name', {
        header: 'Nama Lengkap',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('score', {
        header: 'Skor',
        cell: (info) => info.getValue(),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns: defaultColumns,
    state: {
      globalFilter: filter,
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel<ScoreProps>(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
  });

  return (
    <div className="">
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex space-x-3 my-4 px-5 items-center justify-between">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau skor..."
              className="w-3/4 pl-10 focus:outline-none focus:ring-0"
              value={filter ?? ''}
              onChange={(e) => setFilter(String(e.target.value))}
            />
            <div className="absolute left-0 top-0">
              <SearchIcon
                size={20}
                className="text-gray-500"
              />
            </div>
          </div>
          <div className="">
            <p className="bg-indigo-400 rounded-md px-1.5 py-1 text-gray-50 text-3.25xs">
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </p>
          </div>
        </div>
        <div className="pb-3 overflow-x-auto">
          <table className="w-full pb-4">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-y border-gray-200 bg-indigo-50/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`font-bold text-xs text-gray-500 tracking-wide px-3 py-3 text-left ${
                        headerClass[header.id] ?? ''
                      }`}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : header.id === 'checkboxs'
                              ? 'flex justify-center'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap text-sm px-3 py-3 text-gray-500 ${
                        cell.column.id === 'score' ? 'font-semibold' : ''
                      }`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mb-3 px-5">
          <div className="flex items-center">
            <p className="text-gray-500 mr-3">Menampilkan</p>
            <div className="relative">
              <select
                id="tableScore_paginate"
                name="tableScore_paginate"
                className="bg-gray-50 border border-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-0 text-gray-600 cursor-pointer pr-7 appearance-none"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}>
                {[10, 20, 50, 100].map((pageSize) => (
                  <option
                    key={pageSize}
                    value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <div className="absolute right-1.5 top-1.5">
                <label
                  htmlFor="tableScore_paginate"
                  className="block">
                  <ChevronDownIcon
                    size={20}
                    className="text-gray-500"
                  />
                </label>
              </div>
            </div>
            {/* total data */}
            <p className="text-gray-500 ml-3">dari {data.length} data</p>
          </div>
          <div className="flex space-x-3">
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}>
              First
            </button>
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ArrowLeftIcon
                size={16}
                className="mr-1"
              />
              Previous
            </button>
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
              <ArrowRightIcon
                size={16}
                className="ml-1"
              />
            </button>
            <button
              className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}>
              Last
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-12 transform -translate-x-1/2 left-1/2">
        <div className="bg-gray-50 rounded-full px-12 py-4 shadow-lg">
          <button
            className="px-2.5 py-1 font-medium rounded-md border border-indigo-500 flex items-center bg-indigo-500 text-gray-50 disabled:bg-indigo-300 disabled:border-indigo-300 disabled:cursor-not-allowed"
            onClick={() => console.info('rowSelection', rowSelection)}>
            Log `rowSelection` state
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyTable;
