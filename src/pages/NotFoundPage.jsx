import { Link } from "react-router-dom";
import "../assets/styles/NotFoundPage.css";

const NotFoundPage = () => (
  <main className="not-found-page">
    <p className="not-found-page__code">404</p>
    <h1>Page not found</h1>
    <p>The page you’re looking for doesn’t exist or may have moved.</p>
    <Link to="/">Return to home</Link>
  </main>
);

export default NotFoundPage;
