import { Bag } from "@/components/cart/bag";
export const metadata = { title: "Your shopping bag" };
export default function Page() {
  return (
    <main id="main" className="container page-shell" style={{ maxWidth: 700 }}>
      <div className="page-heading">
        <h1>Your shopping bag</h1>
      </div>
      <Bag />
    </main>
  );
}
