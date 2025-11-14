const universities = [
    {
      id: "iut",
      name: "INHA University in Tashkent",
      city: "Tashkent",
      type: "International",
      overallScore: 91,
      tuitionUsd: 3000,
    },
    {
      id: "wiut",
      name: "Westminster International University in Tashkent",
      city: "Tashkent",
      type: "International",
      overallScore: 88,
      tuitionUsd: 3500,
    },
  ];
  
  export default function UniversitiesPage() {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">
          Universities in Uzbekistan
        </h1>
  
        <div className="grid gap-4 md:grid-cols-2">
          {universities.map((u) => (
            <article
              key={u.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <h2 className="text-lg font-semibold">{u.name}</h2>
              <p className="text-sm text-slate-400">
                {u.city} · {u.type}
              </p>
              <p className="mt-3 text-sm text-slate-300">
                Overall score:{" "}
                <span className="font-semibold text-sky-400">
                  {u.overallScore}/100
                </span>
              </p>
              <p className="text-sm text-slate-400">
                Tuition: ${u.tuitionUsd.toLocaleString()} / year
              </p>
            </article>
          ))}
        </div>
      </div>
    );
  }
  