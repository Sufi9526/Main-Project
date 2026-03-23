import { Clock, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import WishlistButton from "./WishlistButton";

const TripCard = ({
  title,
  days,
  image,
  price,
  rating,
  duration,
  category,
  tripId,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to explore trips");
      navigate("/auth");
      return;
    }

    if (!tripId) {
      toast.error("Trip information not available");
      return;
    }

    setIsLoading(true);

    try {
      // 👉 later booking / enroll logic ivide add cheyyam
      navigate(`/trip/${tripId}`);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          <Badge className="absolute right-3 top-3 bg-accent">
            {category}
          </Badge>

          {tripId && (
            <WishlistButton
              tripId={tripId}
              variant="icon"
              className="absolute left-3 top-3 bg-background/80 hover:bg-background"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
          {title}
        </h3>

        <p className="mb-3 text-sm text-muted-foreground">
          {days}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">{rating}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-2xl font-bold text-primary">
          {price}
        </span>

        <Button onClick={handleEnroll} disabled={isLoading}>
          {isLoading ? "Loading..." : "Explore Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
