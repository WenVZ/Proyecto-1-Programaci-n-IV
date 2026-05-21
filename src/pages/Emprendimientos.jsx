import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function Emprendimientos() {

  const data = [
    {
      id: 1,
      nombre: "Cabalgatas Guanacaste",
      contacto: "8888-8888",
      ubicacion: "Santa Cruz",
    },
    {
      id: 2,
      nombre: "Tour Diría",
      contacto: "7777-7777",
      ubicacion: "Nicoya",
    },
  ];

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Contacto",
      accessorKey: "contacto",
    },
    {
      header: "Ubicación",
      accessorKey: "ubicacion",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Emprendimientos
      </h1>

      <table className="w-full border">

        <thead className="bg-green-700 text-white">

          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>

              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 border"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}

            </tr>
          ))}

        </thead>

        <tbody>

          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>

              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-3 border"
                >
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
  );
}

export default Emprendimientos;