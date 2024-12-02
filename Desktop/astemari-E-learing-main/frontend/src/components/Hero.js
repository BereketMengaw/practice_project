import Image from "next/image";

const Hero = () => {
  return (
    <section className=" h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}

      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/images/hero.png" // Path to image inside the public folder
          alt="banner image"
          layout="fill" // Makes the image fill the entire section
          objectFit="cover" // Ensures the image covers the section fully
          priority // Ensures the image is loaded as soon as possible
        />
      </div>

      {/* Content */}
      <div className="text-center text-white z-10 px-4 md:px-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to Astemari</h1>
        <p className="text-lg md:text-xl">
          Explore courses and unlock your potential!
        </p>
      </div>
    </section>
  );
};

export default Hero;
