import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star } from "lucide-react";

// Mock data to find the person based on the dynamic ID route
// In a real app, this might come from a DB or CMS
const peopleData = [
  {
    id: 1,
    name: "Satrajit Sanyal",
    location: "Agra, In",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    badges: ["Humility", "Wisdom", "Honesty"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.",
    longDescription:
      "Detailed biography and information about Satrajit Sanyal goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.",
  },
  {
    id: 2,
    name: "Ajay Nayak",
    location: "Agra, In",
    image:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    badges: ["Love", "Respect", "Compassion"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.",
    longDescription:
      "Detailed biography and information about Ajay Nayak goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.",
  },
  {
    id: 3,
    name: "Pinaki Roy",
    location: "Agra, In",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    badges: ["Equality", "Dignity", "Harmony", "Compassion"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.",
    longDescription:
      "Detailed biography and information about Pinaki Roy goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus.",
  },
];

export async function generateStaticParams() {
  return peopleData.map((person) => ({
    id: person.id.toString(),
  }));
}

export default async function PersonProfile({ params }) {
  const { id } = await params;

  // Find the correct person by ID
  const person = peopleData.find((p) => p.id.toString() === id);

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Person Not Found</h1>
          <Link href="/people" className="text-blue-500 hover:underline">
            Return to People Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to People</span>
        </Link>

        <div className="bg-card text-card-foreground rounded-[2rem] overflow-hidden border border-border shadow-[0_4px_30px_rgba(0,0,0,0.06)] dark:shadow-none flex flex-col md:flex-row transition-all duration-300">
          {/* Image container */}
          <div className="w-full md:w-1/3 aspect-square md:aspect-auto md:min-h-[400px] relative bg-muted shrink-0 flex items-center justify-center">
            {person.image ? (
              <Image
                src={person.image}
                alt={`Profile image of ${person.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center text-muted-foreground gap-3">
                <span className="text-6xl sm:text-7xl">🧑‍🏫</span>
                <span className="text-base font-medium">
                  No Image Available
                </span>
              </div>
            )}
          </div>

          {/* Content container */}
          <div className="p-6 sm:p-8 md:p-12 flex flex-col flex-1 bg-card">
            <h1 className="text-[#6d4c3d] dark:text-[#dfc3b4] text-3xl sm:text-4xl md:text-5xl leading-tight font-extrabold mb-4 tracking-tight break-words">
              {person.name || "Unknown Person"}
            </h1>

            <div className="flex items-center text-muted-foreground mb-6 sm:mb-8 gap-2 shrink-0">
              <MapPin
                className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                aria-hidden="true"
              />
              <span className="font-medium text-[15px] sm:text-lg">
                {person.location || "Location unknown"}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
              {person.badges && person.badges.length > 0 ? (
                person.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-[#f6f4f0] dark:bg-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-transparent dark:border-slate-700 break-words"
                  >
                    <Star
                      className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] text-muted-foreground shrink-0"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="text-[13px] sm:text-[14px] font-semibold text-[#5a463a] dark:text-gray-300">
                      {badge}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-[14px] text-muted-foreground italic">
                  No badges listed for this profile.
                </span>
              )}
            </div>

            <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
                About
              </h3>
              {person.longDescription ? (
                <p className="text-muted-foreground leading-[1.7] mb-6">
                  {person.longDescription}
                </p>
              ) : (
                <p className="text-muted-foreground leading-[1.7] mb-6 italic">
                  A detailed biography is not currently available for this
                  person.
                </p>
              )}
              {person.description && (
                <p className="text-muted-foreground leading-[1.7]">
                  {person.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
