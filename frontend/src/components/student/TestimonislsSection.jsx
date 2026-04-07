import React from "react";
import assets, { dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className="py-14 px-4 md:px-10 max-w-6xl mx-auto text-center">
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
        Testimonials
      </h2>

      <p className="text-sm md:text-base text-gray-500 mt-3 max-w-2xl mx-auto">
        Hear from our learners as they share their experiences with our courses,
        journeys of transformation, and success stories.
      </p>

      {/* Grid */}
      <div
        className="grid gap-8 mt-12 
                      grid-cols-1 
                      sm:grid-cols-2 
                      lg:grid-cols-3"
      >
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-t-xl">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-md font-semibold text-gray-800">
                  {testimonial.name}
                </h3>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                    className="w-5 h-5"
                  />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-gray-600 mt-4 leading-relaxed">
                {testimonial.feedback}
              </p>

              {/* Read More */}
              <a
                href="#"
                className="inline-block text-blue-600 underline mt-4 hover:text-blue-800"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
