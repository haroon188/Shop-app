import ProductsClient from "./ProductsClient";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
    sortBy?: string | string[];
    price?: string | string[];
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const pick = (value: string | string[] | undefined, fallback: string) =>
    Array.isArray(value) ? value[0] || fallback : value || fallback;

  return (
    <ProductsClient
      initialCategory={pick(params.category, "all")}
      searchQuery={pick(params.q, "")}
      initialSort={pick(params.sortBy, "featured")}
      initialPrice={pick(params.price, "all")}
    />
  );
}
