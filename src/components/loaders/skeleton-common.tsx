import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonPageTitle = () => {
  return <ExplorerSkeletonLoader width="400px" height="31px" />;
};

export const SkeletonTag = () => {
  return <ExplorerSkeletonLoader width="110px" height="24px" />;
};

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
