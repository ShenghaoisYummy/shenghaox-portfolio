import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-10">
      <label className="switch">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <span className="slider"></span>
      </label>

      <style jsx>{`
        /* The switch - the box around the slider */
        .switch {
          display: block;
          --width-of-switch: 3em;
          --height-of-switch: 1.5em;
          /* size of sliding icon -- sun and moon */
          --size-of-icon: 1.1em;
          /* it is like a inline-padding of switch */
          --slider-offset: 0.2em;
          position: relative;
          width: var(--width-of-switch);
          height: var(--height-of-switch);
          opacity: 0.8;
        }

        /* Hide default HTML checkbox */
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        /* The slider */
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #f4f4f5;
          transition: 0.4s;
          border-radius: 1.875rem;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: calc(var(--height-of-switch) - 0.4em);
          width: calc(var(--height-of-switch) - 0.4em);
          border-radius: 50%;
          left: var(--slider-offset, 0.2em);
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #4a90e2;
        }

        input:checked + .slider:before {
          left: calc(
            100% - (calc(var(--height-of-switch) - 0.4em) + var(--slider-offset, 0.2em))
          );
          background: #303136;
          /* change the value of second inset in box-shadow to change the angle and direction of the moon */
          box-shadow: inset -0.1875rem -0.125rem 0.3125rem -0.125rem #8983f7,
            inset -0.625rem -0.25rem 0 0 #a3dafb;
        }
      `}</style>
    </div>
  );
}
