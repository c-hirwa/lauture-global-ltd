import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="text-center max-w-md">
      <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">404</p>
      <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Page not found</h1>
      <p className="text-muted-foreground mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="gold" asChild>
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
