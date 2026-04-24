import Link from "next/link";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-3xl font-black text-slate-900">terms</h1>
      <p className="text-slate-600 leading-relaxed">This page is a simple working placeholder for the footer link.</p>
      <Link href="/" className="inline-flex px-4 py-2 rounded-xl bg-slate-900 text-white">Back home</Link>
    </div>
  );
}
