import './index.sass';

export default function StarBackground({ children, ...rest }: any) {
  return (
    <div>
      <div className="stars1" {...rest}></div>
      <div className="stars2" {...rest}></div>
      <div className="stars3" {...rest}></div>
    </div>
  );
}
