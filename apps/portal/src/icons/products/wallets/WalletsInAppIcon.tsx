export function WalletsInAppIcon(props: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <title>In-App</title>
      <rect
        x="21.5427"
        y="11.2789"
        width="16"
        height="10"
        rx="1.5"
        transform="rotate(152.102 21.5427 11.2789)"
        fill="url(#paint0_linear_327_3)"
      />
      <g filter="url(#filter0_bi_327_3)">
        <path
          d="M3 10.9371C3 9.83256 3.89543 8.93713 5 8.93713H17C18.1046 8.93713 19 9.83256 19 10.9371V18.9371C19 20.0417 18.1046 20.9371 17 20.9371H5C3.89543 20.9371 3 20.0417 3 18.9371V10.9371Z"
          fill="#B9DDFF"
          fillOpacity="0.8"
        />
      </g>
      <path
        d="M4.98647 12H8.10913C8.69614 12 9.24374 12.2955 9.56604 12.7861V12.7861C10.2546 13.8342 11.7913 13.8342 12.4799 12.7861V12.7861C12.8022 12.2955 13.3498 12 13.9368 12H17.0142"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <filter
          id="filter0_bi_327_3"
          x="1"
          y="6.93713"
          width="20"
          height="16"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="1" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_327_3"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_327_3"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.2" />
          <feGaussianBlur stdDeviation="0.05" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_327_3"
          />
        </filter>
        <linearGradient
          id="paint0_linear_327_3"
          x1="34.3715"
          y1="15.4681"
          x2="22.8403"
          y2="21.0623"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2567FF" />
          <stop offset="1" stopColor="#22A7FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
