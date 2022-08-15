import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonPageTitle = () => {
  return <ExplorerSkeletonLoader width={'400px'} height={'31px'} className={'skeleton-title'} />;
};

export const SkeletonTag = () => {
  return <ExplorerSkeletonLoader width={'110px'} height={'24px'} className={'skeleton-title'} />;
};

export const ExplorerSkeletonLoader = ({ ...rest }) => {
  return (
    <Skeleton
      borderRadius={'4px'}
      style={{
        display: 'block',
      }}
      containerClassName="skeleton-outer"
      {...rest}
    />
  );
};
