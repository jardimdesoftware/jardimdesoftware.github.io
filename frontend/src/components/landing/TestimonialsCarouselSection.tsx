"use client";

import { Quote } from "lucide-react";

import { useTestimonials } from "@/hooks/queries/useTestimonials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Reveal } from "@/components/landing/Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TestimonialsCarouselSection() {
  const { data: testimonials, isLoading } = useTestimonials({
    featured: true,
  });

  if (!isLoading && (!testimonials || testimonials.length === 0)) {
    return null;
  }

  return (
    <section id="depoimentos" className="bg-brand-bg py-16 md:py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-brand-text">
            O que dizem os Membros
          </h2>
          <p className="mt-2 text-brand-muted">
            Relatos de quem já passou pelo Jardim de Software.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-2xl">
          {isLoading ? (
            <div className="h-48 animate-pulse rounded-2xl bg-white" />
          ) : (
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {testimonials!.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-[0_10px_30px_rgba(30,136,229,0.08)]">
                      <Quote className="mx-auto h-8 w-8 text-brand-blue/40" />
                      <p className="mt-4 text-lg leading-relaxed text-brand-text">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-6 flex flex-col items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={testimonial.authorPhotoUrl ?? undefined}
                            alt={testimonial.authorName}
                          />
                          <AvatarFallback>
                            {initials(testimonial.authorName)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-bold text-brand-text">
                          {testimonial.authorName}
                        </p>
                        {testimonial.authorRoleLabel && (
                          <p className="text-sm text-brand-muted">
                            {testimonial.authorRoleLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {testimonials!.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          )}
        </Reveal>
      </div>
    </section>
  );
}
