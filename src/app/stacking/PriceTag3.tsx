export const PriceTag3: React.FC = () => {
  return (
    <div style={svgContainer}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
        <defs>
          <clipPath id="blobClip">
            <path
              fill="#FFFFFF"
              d="M10 30 C 20 0, 80 0, 90 30 C 100 60, 180 60, 190 30 Q 200 10, 190 30 C 180 50, 100 50, 90 30 C 80 10, 20 10, 10 30 Z"
            />
          </clipPath>
        </defs>

        <rect width="100%" height="100%" fill="white" clipPath="url(#blobClip)" />
      </svg>
      <div style={bitcoinStyle}>
        <span style={bitcoinIconStyle}>₿</span>
      </div>
      <div style={priceStyle}>
        <span style={priceTextStyle}>$68,297</span>
      </div>
    </div>
  );
};

const svgContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
};

const bitcoinStyle: React.CSSProperties = {
  position: 'absolute',
  left: '15px',
  backgroundColor: '#f7931a',
  color: 'white',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const bitcoinIconStyle: React.CSSProperties = {
  fontSize: '1.25rem',
};

const priceStyle: React.CSSProperties = {
  position: 'absolute',
  right: '15px',
  paddingLeft: '70px',
  paddingRight: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
};

const priceTextStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
};
