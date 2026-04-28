export default function DatacabLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="46" stroke="black" strokeWidth="4" />
      <ellipse cx="50" cy="50" rx="46" ry="18" stroke="black" strokeWidth="3" />
      <ellipse cx="50" cy="50" rx="26" ry="46" stroke="black" strokeWidth="3" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="black" strokeWidth="3" />
    </svg>
  );
}
