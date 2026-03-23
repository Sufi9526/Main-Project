import CourseCard from "./TripCard";

const courses = [
  {
    title: "Goa",
    days: "4 Days",
    image: "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29hfGVufDB8fDB8fHww",
    price: "₹2,999",
    rating: 4.8,
    duration: "65 hours",
    category: "Goa",
  },
  {
    title: "Mumbai",
    days: "5 Days",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVtYmFpfGVufDB8fDB8fHww",
    price: "Free",
    rating: 4.6,
    duration: "12 hours",
    category: "Mumbai",
  },
  {
    title: "Kerala",
    days: "5 Days",
    image: "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S2VyYWxhfGVufDB8fDB8fHww",
    price: "₹1,999",
    rating: 4.7,
    duration: "42 hours",
    category: "Kerala",
  },
  {
    title: "Mysore",
    days: "4 Days",
    image: "https://images.unsplash.com/photo-1600112356915-089abb8fc71a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TXlzb3JlfGVufDB8fDB8fHww",
    price: "₹2,499",
    rating: 4.9,
    duration: "38 hours",
    category: "Mysore",
  },
];

const PopularDestinations = () => {
  return (
    <section className=" py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-700">
            Our experts have hand-picked the most loved destinations to inspire your next journey
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
