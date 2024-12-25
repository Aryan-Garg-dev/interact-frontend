const CountWidget = ({
  charCount,
  limit,
  className,
  hideText = false
}: {
  charCount: number;
  limit: number; 
  className?: string;
  hideText?: boolean;
})=>{
  const fillPercentage = Math.min(100, Math.max(0, charCount / limit * 100));
  return (
    <div className={`character-count w-fit flex items-center gap-2 ${charCount === limit ? 'character-count--warning' : ''} ${className}`}>
      <svg
        height="20"
        width="20"
        viewBox="0 0 20 20"
      >
        <circle
          r="10"
          cx="10"
          cy="10"
          fill="#e9ecef"
        />
        <circle
          r="5"
          cx="10"
          cy="10"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={`calc(${fillPercentage} * 31.4 / 100) 31.4`}
          transform="rotate(-90) translate(-20)"
          />
        <circle
          r="6"
          cx="10"
          cy="10"
          fill="white"
        />
      </svg>

      {!hideText && <div className="text-xs text-slate-500">
        {charCount} / {limit}
        <br />
        characters 
      </div>}
    </div>
  )
}

export default CountWidget;