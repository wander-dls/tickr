import Link from "next/link";
import { FaTicketAlt } from "react-icons/fa";


export default function Home() {
  return (
    <main className="flex flex-col text-center items-center justify-center min-h-screen px-4">
      <FaTicketAlt className="text-red-600 mx-auto mb-4" size={60} />
      <h1 className="text-4xl font-bold mb-4 md:text-5xl text-blue-600">
        Welcome to Tickr
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        Your one-stop solution for managing and tracking your tickets.
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center animate-slide opacity-0">
        <Link href="/tickets/new" className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition">
          <button>
            Submit Tickets
          </button>
        </Link>
        <Link href="/tickets/new" className="bg-blue-100 text-gray-700 px-6 py-3 rounded shadow hover:bg-blue-200 transition">
          <button>
            View Tickets
          </button>
        </Link>
      </div>
    </main>
  );
}
