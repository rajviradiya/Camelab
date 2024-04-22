// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import TableBody from '@mui/material/TableBody';
// import CardHeader from '@mui/material/CardHeader';
// import Card, { CardProps } from '@mui/material/Card';
// import TableContainer from '@mui/material/TableContainer';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

// import { isAfter, isBetween } from 'src/utils/format-time';

// import { _invoices } from 'src/_mock';

// import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';
// import { useTable, getComparator, TableHeadCustom } from 'src/components/table';

// import { IInvoice, IInvoiceTableFilters } from 'src/types/invoice';

// import InvoiceTableRow from './app-invoice-table-row';

// type RowProps = {
//   id: string;
//   price: number;
//   status: string;
//   category: string;
//   invoiceNumber: string;
// };
// interface Props extends CardProps {
//   title?: string;
//   subheader?: string;
//   tableData: RowProps[];
//   tableLabels: any;
// }

// export default function AppNewInvoice({
//   title,
//   subheader,
//   tableData,
//   tableLabels,
//   ...other
// }: Props) {
//   return (
//     <Card {...other}>
//       <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

//       <TableContainer sx={{ overflow: 'unset' }}>
//         <Scrollbar>
//           <Table sx={{ minWidth: 680 }}>
//             <TableHeadCustom headLabel={tableLabels} />

//             <TableBody>
//               {tableData.map((row) => (
//                 <AppNewInvoiceRow key={row.id} row={row} />
//               ))}
//             </TableBody>
//           </Table>
//         </Scrollbar>
//       </TableContainer>

//       <Divider sx={{ borderStyle: 'dashed' }} />

//       <Box sx={{ p: 2, textAlign: 'right' }}>
//         <Button
//           size="small"
//           color="inherit"
//           endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
//         >
//           View All
//         </Button>
//       </Box>
//     </Card>
//   );
// }

// const defaultFilters: IInvoiceTableFilters = {
//   name: '',
//   service: [],
//   status: 'all',
//   startDate: null,
//   endDate: null,
// };

// const [tableData, setTableData] = useState<IInvoice[]>(_invoices);
// const [filters, setFilters] = useState(defaultFilters);
// const dateError = isAfter(filters.startDate, filters.endDate);

// type AppNewInvoiceRowProps = {
//   row: RowProps;
// };

// function AppNewInvoiceRow({ row }: AppNewInvoiceRowProps) {
//   const table = useTable({ defaultOrderBy: 'createDate' });

//   const TABLE_HEAD = [
//     { id: 'invoiceNumber', label: 'Customer' },
//     { id: 'createDate', label: 'Create' },
//     { id: 'dueDate', label: 'Due' },
//     { id: 'price', label: 'Amount' },
//     { id: 'sent', label: 'Sent', align: 'center' },
//     { id: 'status', label: 'Status' },
//     { id: '' },
//   ];

//   function applyFilter({
//     inputData,
//     comparator,
//     filters,
//     dateError,
//   }: {
//     inputData: IInvoice[];
//     comparator: (a: any, b: any) => number;
//     filters: IInvoiceTableFilters;
//     dateError: boolean;
//   }) {
//     const { name, status, service, startDate, endDate } = filters;

//     const stabilizedThis = inputData.map((el, index) => [el, index] as const);

//     stabilizedThis.sort((a, b) => {
//       const order = comparator(a[0], b[0]);
//       if (order !== 0) return order;
//       return a[1] - b[1];
//     });

//     inputData = stabilizedThis.map((el) => el[0]);

//     if (name) {
//       inputData = inputData.filter(
//         (invoice) =>
//           invoice.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
//           invoice.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
//       );
//     }

//     if (status !== 'all') {
//       inputData = inputData.filter((invoice) => invoice.status === status);
//     }

//     if (service.length) {
//       inputData = inputData.filter((invoice) =>
//         invoice.items.some((filterItem) => service.includes(filterItem.service))
//       );
//     }

//     if (!dateError) {
//       if (startDate && endDate) {
//         inputData = inputData.filter((invoice) =>
//           isBetween(invoice.createDate, startDate, endDate)
//         );
//       }
//     }

//     return inputData;
//   }

//   const dataFiltered = applyFilter({
//     inputData: tableData,
//     comparator: getComparator(table.order, table.orderBy),
//     filters,
//     dateError,
//   });

//   const router = useRouter();

//   const handleViewRow = useCallback(
//     (id: string) => {
//       router.push(paths.dashboard.invoice.details(id));
//     },
//     [router]
//   );

//   return (
//     <Scrollbar>
//       <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
//         <TableHeadCustom
//           order={table.order}
//           orderBy={table.orderBy}
//           headLabel={TABLE_HEAD}
//           rowCount={dataFiltered.length}
//           numSelected={table.selected.length}
//           onSort={table.onSort}
//           onSelectAllRows={(checked) =>
//             table.onSelectAllRows(
//               checked,
//               dataFiltered.map((i) => i.id)
//             )
//           }
//         />

//         <TableBody>
//           {dataFiltered
//             .slice(
//               table.page * table.rowsPerPage,
//               table.page * table.rowsPerPage + table.rowsPerPage
//             )
//             .map((item) => (
//               <InvoiceTableRow
//                 key={item.id}
//                 row={item}
//                 selected={table.selected.includes(item.id)}
//                 onSelectRow={() => table.onSelectRow(item.id)}
//                 onViewRow={() => handleViewRow(item.id)}
//               />
//             ))}
//         </TableBody>
//       </Table>
//     </Scrollbar>
//   );
// }
