// export const PriceTag2: React.FC = () => {
//   return (
//     <div style={containerStyle}>
//       <div style={bitcoinStyle}>
//         <span style={bitcoinIconStyle}>₿</span>
//       </div>
//       <div style={priceStyle}>
//         <span style={priceTextStyle}>$68,297</span>
//       </div>
//     </div>
//   );
// };
// const containerStyle: React.CSSProperties = {
//   display: 'flex',
//   alignItems: 'center',
//   padding: '0.5rem',
//   width: 'fit-content',
//   position: 'relative',
// };
// const bitcoinStyle: React.CSSProperties = {
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: '#f7931a',
//   color: 'white',
//   borderRadius: '50%',
//   width: '40px',
//   height: '40px',
//   fontSize: '1.5rem',
//   position: 'relative',
//   zIndex: 1,
// };
// const bitcoinIconStyle: React.CSSProperties = {
//   fontSize: '1.25rem',
// };
// const priceStyle: React.CSSProperties = {
//   padding: '0.5rem 1.5rem',
//   background: 'linear-gradient(to right, #f7931a 10%, #f1f1f1 90%)',
//   borderRadius: '50px',
//   clipPath: 'polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%)',
//   position: 'relative',
//   zIndex: 0,
// };
// const priceTextStyle: React.CSSProperties = {
//   fontSize: '1.5rem',
//   fontWeight: 'bold',
//   color: 'black',
// };
// export default PriceTag;

export const PriceTag2: React.FC = () => {
  return (
    <div style={containerStyle}>
      <div style={bitcoinStyle}>
        <span style={bitcoinIconStyle}>₿</span>
      </div>
      <div style={priceStyle}>
        <span style={priceTextStyle}>$68,297</span>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem',
  width: 'fit-content',
  position: 'relative',
};

const bitcoinStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f7931a',
  color: 'white',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  fontSize: '1.5rem',
  position: 'relative',
  zIndex: 1,
};

const bitcoinIconStyle: React.CSSProperties = {
  fontSize: '1.25rem',
};

const priceStyle: React.CSSProperties = {
  padding: '0.5rem 1.5rem',
  background: 'linear-gradient(to right, #f7931a, #f1f1f1)',
  borderRadius: '50px',
  clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)',
  position: 'relative',
  zIndex: 0,
};

const priceTextStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'black',
};
