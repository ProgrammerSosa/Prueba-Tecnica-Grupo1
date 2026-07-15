export const HoneycombPattern = ({ className = "" }) => (
  <svg
    className={className}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern
        id="honeycomb-pattern"
        width="56"
        height="100"
        patternUnits="userSpaceOnUse"
        patternTransform="scale(1)"
      >
        <path
          d="M28 0 L56 16.5 L56 49.5 L28 66 L0 49.5 L0 16.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M28 66 L56 82.5 L56 115.5 L28 132 L0 115.5 L0 82.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#honeycomb-pattern)" />
  </svg>
);
