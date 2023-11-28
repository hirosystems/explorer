export const ExplorerSkeletonLoader = ({
  width,
  height,
  circle,
}: {
  width?: string;
  height?: string;
  circle?: boolean;
}) => {
  return (
    <div
      className="ssr-skeleton"
      style={{
        borderRadius: circle ? '50%' : '4px',
        width: width || '100%',
        height: height || '100%',
        opacity: 0.5,
      }}
    />
  );
};
