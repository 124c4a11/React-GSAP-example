import {
  forwardRef,
  LegacyRef,
  MutableRefObject,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "@/styles/Home.module.css";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";

gsap.registerPlugin(Flip);

interface BoxProps {
  // ndx: number;
  size: string;
  delay: number;
  // addAnimation: (animation: gsap.core.Tween, ndx: number) => void;
}

interface CircleRef {
  moveTo: (x: number, y: number) => void;
}

interface FadeInProps {
  children: ReactNode;
  stagger?: number;
  x?: number;
}

const Box = forwardRef<any>(function Box(props, ref) {
  return <div ref={ref} className={styles["box"]}></div>;
});

const Circle = forwardRef<CircleRef, BoxProps>(function Circle(
  { size, delay }: BoxProps,
  ref
) {
  const el = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      moveTo(x, y) {
        gsap.to(el.current, { x, y, delay });
      },
    }),
    [delay]
  );

  return (
    <div
      ref={el}
      className={`${styles["circle"]} ${styles[`circle_${size}`]}`}
    ></div>
  );
});

export default function Home() {
  const app = useRef(null);
  const box = useRef(null);

  const [ctx] = useState(gsap.context(() => {}, app));
  const [active, setActive] = useState(true);

  useEffect(() => ctx.revert(), []);

  useEffect(() => {
    ctx.add(() => {
      gsap.to(box.current, { opacity: 1 });
    });
  }, [active]);

  const toggle = () => {
    ctx.add(() => {
      gsap.to(box.current, {
        opacity: 0,
        onComplete: () => setActive((prev) => !prev),
      });
    });
  };

  return (
    <div ref={app} className={styles["container"]}>
      <div>
        <button onClick={toggle}>Reverse</button>
      </div>
      <div ref={box} className={`${styles["box"]} box`}>
        {active.toString()}
      </div>
    </div>
  );
}
