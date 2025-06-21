"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RotatingText.css";

/* simple classNames helper */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

/* main rotating‑text component */
const RotatingText = forwardRef(
  (
    {
      texts,
      /* animation / timing props with sensible defaults */
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      /* style hooks */
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...rest
    },
    ref
  ) => {
    /* ===== state & helpers ===== */
    const [current, setCurrent] = useState(0);

    const splitIntoCharacters = useCallback((text) => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter("ru", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text), (s) => s.segment);
      }
      return Array.from(text);
    }, []);

    /* split current phrase according to splitBy */
    const elements = useMemo(() => {
      const currentText = texts[current];
      if (splitBy === "characters") {
        const words = currentText.split(" ");
        return words.map((w, i) => ({
          chars: splitIntoCharacters(w),
          needsSpace: i !== words.length - 1,
        }));
      }
      if (splitBy === "words")
        return currentText.split(" ").map((w, i, arr) => ({
          chars: [w],
          needsSpace: i !== arr.length - 1,
        }));
      if (splitBy === "lines")
        return currentText.split("\n").map((l, i, arr) => ({
          chars: [l],
          needsSpace: i !== arr.length - 1,
        }));
      /* custom delimiter */
      return currentText.split(splitBy).map((p, i, arr) => ({
        chars: [p],
        needsSpace: i !== arr.length - 1,
      }));
    }, [texts, current, splitBy, splitIntoCharacters]);

    /* ===== rotation controls ===== */
    const updateIndex = useCallback(
      (idx) => {
        setCurrent(idx);
        onNext?.(idx);
      },
      [onNext]
    );

    const next = useCallback(() => {
      const nextIdx = current === texts.length - 1 ? (loop ? 0 : current) : current + 1;
      if (nextIdx !== current) updateIndex(nextIdx);
    }, [current, texts.length, loop, updateIndex]);

    const previous = useCallback(() => {
      const prevIdx = current === 0 ? (loop ? texts.length - 1 : 0) : current - 1;
      if (prevIdx !== current) updateIndex(prevIdx);
    }, [current, texts.length, loop, updateIndex]);

    const jumpTo = useCallback(
      (idx) => updateIndex(clamp(idx, 0, texts.length - 1)),
      [texts.length, updateIndex]
    );

    const reset = useCallback(() => updateIndex(0), [updateIndex]);

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
      next,
      previous,
      jumpTo,
      reset,
    ]);

    /* auto‑play */
    useEffect(() => {
      if (!auto) return;
      const id = setInterval(next, rotationInterval);
      return () => clearInterval(id);
    }, [auto, rotationInterval, next]);

    /* stagger helper */
    const getDelay = useCallback(
      (idx, total) => {
        if (staggerFrom === "first") return idx * staggerDuration;
        if (staggerFrom === "last") return (total - 1 - idx) * staggerDuration;
        if (staggerFrom === "center") {
          const center = Math.floor(total / 2);
          return Math.abs(center - idx) * staggerDuration;
        }
        if (staggerFrom === "random") {
          const rand = Math.floor(Math.random() * total);
          return Math.abs(rand - idx) * staggerDuration;
        }
        /* numeric fallback */
        return Math.abs(staggerFrom - idx) * staggerDuration;
      },
      [staggerFrom, staggerDuration]
    );

    /* ===== render ===== */
    return (
      <motion.span
        {...rest}
        className={cn("text-rotate", mainClassName)}
        layout
        transition={transition}
      >
        <span className="text-rotate-sr-only">{texts[current]}</span>

        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.div
            key={current}
            className={cn(splitBy === "lines" ? "text-rotate-lines" : "text-rotate")}
            layout
            aria-hidden="true"
          >
            {elements.map((w, wi, arr) => {
              const prevChars = arr.slice(0, wi).reduce((s, word) => s + word.chars.length, 0);
              return (
                <span key={wi} className={cn("text-rotate-word", splitLevelClassName)}>
                  {w.chars.map((ch, ci) => (
                    <motion.span
                      key={ci}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getDelay(prevChars + ci, arr.reduce((s, word) => s + word.chars.length, 0)),
                      }}
                      className={cn("text-rotate-element", elementLevelClassName)}
                    >
                      {ch}
                    </motion.span>
                  ))}
                  {w.needsSpace && <span className="text-rotate-space"> </span>}
                </span>
              );
            })}
          </motion.div>
        </AnimatePresence>
        
      </motion.span>
    );
  }
);

RotatingText.displayName = "RotatingText";

export default RotatingText;
