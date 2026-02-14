import { motion } from "framer-motion";

interface WaitlistConfirmationProps {
  name: string;
}

const WaitlistConfirmation: React.FC<WaitlistConfirmationProps> = ({ name }) => {
  return (
    <section id="waitlist" className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="text-5xl mb-6">⌚</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-steel mb-4">
          You're Now Ahead, {name}.
        </h2>
        <p className="text-muted-foreground font-light">
          We'll notify you before anyone else. Welcome to the movement.
        </p>
      </motion.div>
    </section>
  );
};

export default WaitlistConfirmation;
