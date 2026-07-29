export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-8 md:py-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#0A1128] dark:text-white">
          Tech insights for
          <span className="block text-[#1a2a4a] dark:text-gray-300">
            modern developers
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Building the future of technology, one post at a time.
          Exploring software, AI, cloud, and everything in between.
        </p>
      </section>

      {/* Coming Soon Section */}
      <section className="py-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-500">
         Content coming soon. Stay tuned!
        </p>
      </section>
    </div>
  );
}