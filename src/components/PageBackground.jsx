import BatikBackground from './BatikBackground';

const PageBackground = () => (
  <BatikBackground
    width={window.innerWidth || 1600}
    height={window.innerHeight || 1200}
    color="#111"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
    }}
  />
);

export default PageBackground;
