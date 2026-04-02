import { useEffect, useRef } from "react";
import scrollama from "scrollama";

const Scroll = ({ children, onEnter, stepId }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const scroller = scrollama();

    scroller
      .setup({
        step: sectionRef.current,
        offset: 0.5,
      })
      .onStepEnter(() => {
        onEnter?.(); // smooth trigger
      });

    return () => scroller.destroy();
  }, [onEnter]);

  return (
    <section ref={sectionRef} id={stepId} className="w-full min-h-300px">
      {children}
    </section>
  );
};

export default Scroll;