import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { cn } from "../lib/utils";

export default function WishlistButton({
  courseId,
  variant = "default",
  className,
}) {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && courseId) {
      checkWishlistStatus();
    }
  }, [user, courseId]);

  const checkWishlistStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setIsInWishlist(!!data);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add courses to wishlist");
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("course_id", courseId);

        if (error) throw error;

        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        const { error } = await supabase
          .from("wishlist")
          .insert({
            user_id: user.id,
            course_id: courseId,
          });

        if (error) throw error;

        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setLoading(false);
    }
  };

  // ICON VARIANT (heart icon only)
  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleWishlist}
        disabled={loading}
        className={cn(className)}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isInWishlist && "fill-red-500 text-red-500"
          )}
        />
      </Button>
    );
  }

  // DEFAULT BUTTON VARIANT
  return (
    <Button
      variant={isInWishlist ? "secondary" : "outline"}
      onClick={toggleWishlist}
      disabled={loading}
      className={cn("gap-2", className)}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          isInWishlist && "fill-red-500 text-red-500"
        )}
      />
      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  );
} 