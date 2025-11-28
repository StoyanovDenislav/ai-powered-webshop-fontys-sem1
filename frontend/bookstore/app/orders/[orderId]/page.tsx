import Link from "next/link";
import { HeaderWithAuth } from "../../components/HeaderWithAuth";
import headerData from "../../../src/content/header.json";
import footerData from "../../../src/content/footer.json";

type OrderItem = {
  id: number;
  book_id: number;
  unit_price: string;
  quantity: number;
  title: string;
  author: string;
};

type OrderDetails = {
  id: number;
  user_id: number;
  status: string;
  subtotal: string;
  total: string;
  placed_at: string;
  items: OrderItem[];
};

async function fetchOrderDetails(
  orderId: string
): Promise<OrderDetails | null> {
  try {
    const response = await fetch(`http://localhost:6001/orders/${orderId}`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function OrderDetailsPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.orderId;
  const order = await fetchOrderDetails(orderId);

  if (!order) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/90 p-8">
          <HeaderWithAuth navItems={headerData.navItems} />
          <div className="py-12 text-center">
            <h2 className="text-2xl font-semibold">Order not found</h2>
            <p className="mt-4 text-sm text-[#7a6455]">
              We couldn't find the order you're looking for.
            </p>
            <Link href="/" className="mt-6 inline-block text-sm text-[#8a5c40]">
              Return home →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <HeaderWithAuth navItems={headerData.navItems} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#342117]">
                Order #{order.id}
              </h1>
              <p className="text-sm text-[#7a6455]">
                Placed on{" "}
                {new Date(order.placed_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                order.status === "Paid"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="border-t border-[#efe4d8] pt-6">
            <h2 className="text-lg font-semibold text-[#342117] mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-4 rounded-2xl border border-[#efe4d8] bg-white/90"
                >
                  <div className="flex-1">
                    <Link
                      href={`/${item.book_id}`}
                      className="text-base font-medium text-[#342117] hover:text-[#b07b50] transition"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-[#7a6455] mt-1">{item.author}</p>
                    <p className="text-sm text-[#9a887a] mt-2">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#7a6455]">
                      €{Number(item.unit_price).toFixed(2)} each
                    </p>
                    <p className="text-base font-semibold text-[#342117] mt-1">
                      €{(Number(item.unit_price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#efe4d8] pt-6">
            <div className="space-y-3 max-w-sm ml-auto">
              <div className="flex justify-between text-sm text-[#7a6455]">
                <span>Subtotal:</span>
                <span>€{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-[#342117] pt-3 border-t border-[#efe4d8]">
                <span>Total:</span>
                <span>€{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Link
              href="/"
              className="rounded-full border border-[#dfcdbb] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#6a4e33] transition hover:border-[#b07b50] hover:text-[#40260f]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <footer className="border-t border-[#efe4d8] pt-6 text-center text-sm text-[#6a5a4c] sm:text-left">
          <p>
            © {new Date().getFullYear()} {footerData.rights}
          </p>
        </footer>
      </div>
    </main>
  );
}
