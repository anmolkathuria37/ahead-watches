import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";
import WaitlistConfirmation from "./ui/WaitlistConfirmation";

const WaitlistSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    model: "",
    phone : "",
    preorder: "",
  });
  const [loading, setLoading] = useState(false);



  // Handle Submit Button (stores data locally for now, can connect to backend later)

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!form.name || !form.email || !form.model || !form.preorder) {
  //     toast.error("Please fill all fields");
  //     return;
  //   }
  //   // Store locally for now (can connect to backend later)
  //   const entries = JSON.parse(localStorage.getItem("ahead_waitlist") || "[]");
  //   entries.push({ ...form, timestamp: new Date().toISOString() });
  //   localStorage.setItem("ahead_waitlist", JSON.stringify(entries));
  //   setSubmitted(true);
  // };


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!form.name || !form.email || !form.model || !form.preorder) {
  //     toast.error("Please fill all fields");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("http://localhost:5000/api/waitlist", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(form),
  //     });

  //     if (res.status === 409) {
  //       toast.error("Email already on waitlist");
  //       return;
  //     }

  //     if (!res.ok) throw new Error();

  //     setSubmitted(true);
  //   } catch {
  //     toast.error("Something went wrong");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!form.name || !form.email || !form.model || !form.preorder) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/waitlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.status === 409) {
        toast.error("Email already on waitlist");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error();

      setSubmitted(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };




  // if (submitted) {
  //   return (
  //     <section id="waitlist" className="py-32 px-6">
  //       <motion.div
  //         initial={{ opacity: 0, scale: 0.95 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         transition={{ duration: 0.8 }}
  //         className="max-w-md mx-auto text-center"
  //       >
  //         <div className="text-5xl mb-6">⌚</div>
  //         <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-steel mb-4">
  //           You're Now Ahead.
  //         </h2>
  //         <p className="text-muted-foreground font-light">
  //           We'll notify you before anyone else. Welcome to the movement.
  //         </p>
  //       </motion.div>
  //     </section>
  //   );
  // }


  if (submitted) {
    return <WaitlistConfirmation name={form.name} />;
  }

  return (
    <section id="waitlist" className="py-32 px-6 bg-gradient-dark">
      <div className="section-divider max-w-xs mx-auto mb-20" />
      <div ref={ref} className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-steel mb-4">
            Join The Waitlist
          </h2>
          <p className="text-muted-foreground font-light">
            Be first in line. No spam. Only updates that matter.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
            maxLength={100}
          />

          <input
            type="tel"
            placeholder="Phone Number (with country code)"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
            maxLength={255}
          />
          <select
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all appearance-none"
          >
            <option value="" disabled>
              Preferred Model
            </option>
            <option value="5am">5:00 AM Edition</option>
            <option value="founder">Founder's Steel</option>
            <option value="midnight">Midnight Discipline</option>
          </select>
          <select
            value={form.preorder}
            onChange={(e) => setForm({ ...form, preorder: e.target.value })}
            className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all appearance-none"
          >
            <option value="" disabled>
              Pre-order with 10% founder discount?
            </option>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </select>
          {/* <button
            type="submit"
            className="w-full bg-gradient-steel text-primary-foreground py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm hover:opacity-90 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(220_20%_60%/0.3)]"
          >
            Secure My Spot
          </button> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-steel text-primary-foreground py-3.5 text-sm font-semibold tracking-widest uppercase rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Securing..." : "Secure My Spot"}
          </button>

        </motion.form>
      </div>
    </section>
  );
};

export default WaitlistSection;
