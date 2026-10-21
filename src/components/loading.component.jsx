import "../assets/styles/Loading.css";

const Loading = ({ label = "Loading" }) => (
  <div className="loading-state" role="status" aria-live="polite">
    <span className="loading-state__spinner" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default Loading;
