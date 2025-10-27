import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const teamMembers = [
    {
      name: "Marcus Johnson",
      role: "Founder & Master Detailer",
      bio: "15+ years of experience in professional auto detailing and ceramic coating applications.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    },
    {
      name: "David Chen",
      role: "Paint Correction Specialist",
      bio: "Certified in advanced paint correction techniques with expertise in luxury and exotic vehicles.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces",
    },
    {
      name: "Sarah Williams",
      role: "Interior Detailing Expert",
      bio: "Specialist in leather restoration and interior fabric care with meticulous attention to detail.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces",
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
            Our Team
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mt-4 mb-6">
            Meet the{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Experts
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-inter">
            Our certified professionals bring decades of combined experience to
            every detail.
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-gradient-to-r from-card via-primary/5 to-card border border-primary/20 rounded-2xl p-8 max-w-2xl">
            <h3 className="text-2xl font-montserrat font-bold mb-4">
              Join Our Team
            </h3>
            <p className="text-muted-foreground mb-6 font-inter">
              We're always looking for passionate detailing professionals. If
              you're dedicated to excellence and want to work with the best,
              we'd love to hear from you.
            </p>
            <a
              href="mailto:cornerstonemobile55@gmail.com"
              className="inline-block px-6 py-3 bg-gradient-primary rounded-lg font-semibold hover:shadow-glow-primary transition-all duration-300 font-inter"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
