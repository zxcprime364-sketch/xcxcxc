type IconProps = {
  size?: number;
  className?: string;
};

export function VolumeOffIcon({ size = 32, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="
  M17.5 24
  Q17.5 25.5 16.5 25.8
  Q15.8 26 15.2 25.5
  L9.2 21
  Q8.8 20.7 8.2 20.7
  H5.5
  Q4 20.7 4 19.2
  V12.8
  Q4 11.3 5.5 11.3
  H8.2
  Q8.8 11.3 9.2 11
  L15.2 6.5
  Q15.8 6 16.5 6.2
  Q17.5 6.5 17.5 8
  Z
  "
        fill="currentColor"
      />
      <path
        d="M28.8621 13.6422C29.1225 13.3818 29.1225 12.9597 28.8621 12.6994L27.9193 11.7566C27.659 11.4962 27.2368 11.4962 26.9765 11.7566L24.7134 14.0197C24.6613 14.0717 24.5769 14.0717 24.5248 14.0197L22.262 11.7568C22.0016 11.4964 21.5795 11.4964 21.3191 11.7568L20.3763 12.6996C20.116 12.9599 20.116 13.382 20.3763 13.6424L22.6392 15.9053C22.6913 15.9573 22.6913 16.0418 22.6392 16.0938L20.3768 18.3562C20.1165 18.6166 20.1165 19.0387 20.3768 19.299L21.3196 20.2419C21.58 20.5022 22.0021 20.5022 22.2624 20.2418L24.5248 17.9795C24.5769 17.9274 24.6613 17.9274 24.7134 17.9795L26.976 20.2421C27.2363 20.5024 27.6585 20.5024 27.9188 20.2421L28.8616 19.2992C29.122 19.0389 29.122 18.6168 28.8616 18.3564L26.599 16.0938C26.547 16.0418 26.547 15.9573 26.599 15.9053L28.8621 13.6422Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function VolumeOnIcon({ size = 32, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="
  M17.5 24
  Q17.5 25.5 16.5 25.8
  Q15.8 26 15.2 25.5
  L9.2 21
  Q8.8 20.7 8.2 20.7
  H5.5
  Q4 20.7 4 19.2
  V12.8
  Q4 11.3 5.5 11.3
  H8.2
  Q8.8 11.3 9.2 11
  L15.2 6.5
  Q15.8 6 16.5 6.2
  Q17.5 6.5 17.5 8
  Z
  "
        fill="currentColor"
      />
      <rect
        x="25.5"
        y="9.3"
        width="2.7"
        height="13.4"
        rx="1.3"
        fill="currentColor"
      />

      <rect
        x="20.2"
        y="12"
        width="2.7"
        height="8"
        rx="1.3"
        fill="currentColor"
      />
    </svg>
  );
}
