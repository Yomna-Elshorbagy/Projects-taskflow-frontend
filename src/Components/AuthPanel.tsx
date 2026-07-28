// Shared green marketing panel used on both Signup and Login pages

const stats = [
  { label: "To Do", value: "6" },
  { label: "In Progress", value: "3" },
  { label: "Done", value: "12" },
];

function AuthPanel() {
  return (
    <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-[#1a6b5a] to-[#0d4a3d] p-12 text-white">
      {/* Top tag */}
      <p className="text-xs font-semibold tracking-widest uppercase opacity-70">
        Task Management, Refined
      </p>

      {/* Main copy + stats */}
      <div>
        <h2 className="text-4xl font-bold leading-tight mb-4">
          The team task board
          <br />
          built for focus.
        </h2>
        <p className="text-sm opacity-80 max-w-sm leading-relaxed mb-10">
          Projects, tasks, statuses and assignments — arranged so your team
          can see exactly what needs to happen next.
        </p>

        {/* Stat cards */}
        <div className="flex gap-4">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                {label}
              </p>
              <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs opacity-50">© 2026 TaskFlow</p>
    </div>
  );
}

export default AuthPanel;
