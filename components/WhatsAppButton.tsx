const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22899314796";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl shadow-lg transition hover:scale-105"
    >
      💬
    </a>
  );
}
