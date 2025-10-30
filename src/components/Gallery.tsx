import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2Fba26d505a7014992a6c947b749c63deb?format=webp&width=800",
      title: "Interior Floor Mat Detail",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F28b5dca427f341fc94a2831f78d505c1?format=webp&width=800",
      title: "Chevrolet Front Exterior",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F00b6ee4175694565b8b3ce099c5b7931?format=webp&width=800",
      title: "Ford Transit Van Wash",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F950777eb5a8f459499124e038e2924af?format=webp&width=800",
      title: "Honda Civic Exterior Shine",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F4ad05332a6c74f3eafb7d24d5271941d?format=webp&width=800",
      title: "Honda Civic Interior Clean",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F2cfab23f5bf74d988f12d1708d774d42?format=webp&width=800",
      title: "SUV Trunk Area Detail",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F6680517041584edc80e52197ddba3138?format=webp&width=800",
      title: "Blue Vehicle Side Finish",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets%2F8c5319227ec44fd9bdef2d63efcb9acb%2F7985c10546a9405da9ac79b2a4f61f21?format=webp&width=800",
      title: "Customer Vehicle Delivery",
    },
  ];

  return (
    <>
      <section id="gallery" className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />

        {/* Particle Effects */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider font-inter">
              Our Work
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold mt-4 mb-6">
              See the{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Transformation
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-inter">
              Real results from real customers. Every vehicle receives the same
              meticulous attention to detail.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-all duration-300"
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h4 className="text-xl font-montserrat font-bold">
                    {image.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2 font-inter">
                    Click to view
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center shadow-glow-primary">
                  <span className="text-xs text-primary-foreground">+</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-card border border-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full rounded-xl shadow-2xl border border-primary/30"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
};

export default Gallery;
