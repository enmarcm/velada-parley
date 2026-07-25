export default function Toast({ msg, type = "info" }) {
  const colors = {
    info: "bg-acentoFrio/90",
    error: "bg-descartado/90",
    success: "bg-ganado/90",
    warn: "bg-vivo/90",
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-[480px] mx-auto animate-slideUp">
      <div className={`${colors[type] || colors.info} text-white text-center text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg`}>
        {msg}
      </div>
    </div>
  );
}
