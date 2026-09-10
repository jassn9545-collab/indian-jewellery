import Link from "next/link";
import { notFound } from "next/navigation";
const content: Record<string, { title: string; sections: [string, string][] }> =
  {
    shipping: {
      title: "Shipping & Delivery",
      sections: [
        [
          "Thoughtfully delivered",
          "We are preparing to deliver TECHGLOCK across India. Complimentary standard shipping is planned for orders above INR 799. Delivery timelines and serviceable pincodes will be confirmed at launch.",
        ],
        [
          "Tracking your order",
          "Once ordering is available, you will be able to view your shipment status from your account.",
        ],
      ],
    },
    returns: {
      title: "Returns & Refunds",
      sections: [
        [
          "A little reassurance",
          "Final return windows, eligibility, hygiene exclusions and refund timelines will be published before the store opens. Please check the product page and final policy before placing an order.",
        ],
        [
          "Need a hand?",
          "Our customer care details will be available at launch.",
        ],
      ],
    },
    faqs: {
      title: "A few things you may wonder",
      sections: [
        [
          "Is TECHGLOCK taking orders?",
          "This is a preview of our upcoming jewellery store. Checkout, payments and customer accounts are not live yet.",
        ],
        [
          "Is the jewellery solid gold?",
          "Our sample fashion jewellery collection uses gold-plated brass. Silver pieces are presented as 925 sterling silver. Final materials and certifications will be verified before launch.",
        ],
        [
          "How do I save a favourite?",
          "Tap the heart on a piece to add it to your wishlist. Your wishlist and shopping bag are stored in this browser.",
        ],
      ],
    },
    contact: {
      title: "Let's talk",
      sections: [
        [
          "Here for your little questions",
          "For questions about a piece, delivery or jewellery care, our customer care team will be happy to help once the store opens.",
        ],
        [
          "Customer care",
          "Contact details and WhatsApp support will be published at launch. Planned support hours: Monday to Saturday, 10:00 AM to 6:00 PM IST.",
        ],
      ],
    },
    care: {
      title: "A little care, a lasting sparkle",
      sections: [
        [
          "After every wear",
          "Gently wipe your jewellery with a clean, soft cloth. Keep perfume, lotions and household chemicals away from plated pieces.",
        ],
        [
          "A place of its own",
          "Store pieces separately in a dry pouch. Remove jewellery before swimming, showering or exercise.",
        ],
        [
          "Looking after silver",
          "Store silver away from moisture. Use a silver polishing cloth on plain silver surfaces, avoiding delicate stones and finishes.",
        ],
      ],
    },
    privacy: {
      title: "Privacy",
      sections: [
        [
          "About this preview",
          "Your bag, wishlist and appearance preference are stored locally in your browser. Preview forms do not submit personal details to a backend.",
        ],
        [
          "Before we launch",
          "A complete privacy policy covering customer accounts, payments, service providers and your data rights will be published before the store accepts orders.",
        ],
      ],
    },
    terms: {
      title: "Terms",
      sections: [
        [
          "Preview catalogue",
          "The catalogue, prices, reviews, ratings and product imagery are illustrative sample content for this frontend preview. They are not a live offer to sell.",
        ],
        [
          "Ordering",
          "No orders or payments can be processed in this preview. Final terms, product specifications and store policies will be published before launch.",
        ],
      ],
    },
  };
export function generateStaticParams() {
  return Object.keys(content).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: content[slug]?.title || "Help" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = content[slug];
  if (!page) notFound();
  return (
    <main id="main" className="container page-shell prose">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Help</span>
      </nav>
      <h1>{page.title}</h1>
      {page.sections.map(([title, text]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{text}</p>
        </section>
      ))}
      <Link className="text-link" href="/collections/all">
        Explore jewellery
      </Link>
    </main>
  );
}
