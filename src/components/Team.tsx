import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const teamMembers = [
    {
      name: "Blake Aslin",
      role: "Owner & Founder",
      bio: "Dedicated to delivering premium mobile detailing services with attention to detail and customer excellence.",
      image: "https://cdn.builder.io/api/v1/image/assets%2Fbd2db2bf76dc466fa0ee7e5d644defec%2Fdc5c1a1001fc41c5a3adb673d2fe2294?format=webp&width=800",
    },
  ];

  return (
    <section id="team" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-card/50" />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider font-inter">
            Meet the Owner
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mt-4 mb-6">
            Meet the{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Owner
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-inter">
            Proudly serving the Charlotte area with personal, high-quality mobile detailing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-montserrat font-bold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-semibold mb-3 font-inter">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed font-inter">
                    {member.bio}
                  </p>
                </div>

                {/* Glow Effect */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;
