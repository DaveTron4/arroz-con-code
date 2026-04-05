export default function ChatPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">AI Chat</h1>

      <div className="flex min-h-96 flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mt-auto text-center text-sm text-gray-400">
          Ask a question about education, healthcare, or technology.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your question..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Send
        </button>
      </div>
    </section>
  );
}
