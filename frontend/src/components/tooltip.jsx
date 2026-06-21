function Tooltip({ children, text }) {
  return (
    <span className="group/tooltip relative inline-flex cursor-help items-center">
      {children}

      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-56 -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-xs font-normal normal-case tracking-normal text-gray-300 opacity-0 shadow-xl shadow-black/40 transition-opacity group-hover/tooltip:opacity-100">
        {text}
      </span>
    </span>
  )
}

export default Tooltip