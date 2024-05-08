import { Box } from '@/ui/Box';
import { useEffect, useRef, useState } from 'react';

export const Ellipsis = ({
  children,
  maxLine = 1,
}: {
  children: React.ReactNode;
  maxLine?: number;
}) => {
  const contentRef = useRef(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollWidth, clientWidth } = contentRef.current;
      if (scrollWidth > clientWidth) {
        setTruncated(true);
      }
    }
  }, [children]); // Re-run when children change

  const style = {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: maxLine,
    // WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
  };
  const { scrollWidth, clientWidth } = contentRef.current || {};
  console.log({ truncated, scrollWidth, clientWidth });

  return (
    <Box ref={contentRef} style={style}>
      {children}
      {truncated && <span>...</span>}
    </Box>
  );
};
