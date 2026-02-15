import { notFound } from "next/navigation";
import { bebasNeue } from "@/app/ui/fonts";
import { ProductForm } from "@/app/components/ProductForm";
import { fetchProductById } from "@/app/helpers/api";

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = Number(params.id);

  if (isNaN(id)) notFound();

  const res = await fetchProductById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1
        className={`${bebasNeue.className} text-4xl tracking-wider text-zinc-100`}
      >
        Editar Producto
      </h1>

      <div className="max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <ProductForm product={res.data} />
      </div>
    </div>
  );
}
